/**
 * Sincroniza todo con la voz real.
 *   1. Normaliza /public/voz.mp3 a -14 LUFS (dos pasadas de loudnorm) → public/voz.norm.wav
 *   2. Detecta silencios con ffmpeg (silencedetect) y la amplitud por tramos.
 *   3. Reparte el guion: cada frontera entre chunks se "imanta" al silencio más
 *      cercano; dentro de cada chunk las palabras se reparten por sílabas.
 *   4. Escribe src/voice.generated.ts → timings.ts pasa a usar esos tiempos.
 *
 *   npm run analyze-voice
 *
 * Para precisión palabra por palabra, podés reemplazar el paso 3 por una
 * transcripción con timestamps (p. ej. whisper.cpp) y escribir el mismo formato.
 */
import {spawnSync} from 'node:child_process';
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {SCRIPT} from '../src/timings';

const SRC = 'public/voz.mp3';
const OUT_TS = 'src/voice.generated.ts';
const header = `/**\n * ARCHIVO GENERADO por \`npm run analyze-voice\` — no editar a mano.\n * null = no hay /public/voz.mp3 → los tiempos se estiman en timings.ts.\n * Si hay voz: words[chunk][palabra] = [inicioSeg, finSeg].\n */\n`;

if (!existsSync(SRC)) {
  writeFileSync(OUT_TS, `${header}export const VOICE: {file: string; words: [number, number][][]} | null = null;\n`);
  console.log('No hay public/voz.mp3 → se usan tiempos estimados.');
  process.exit(0);
}

const ff = (args: string[]) => spawnSync('ffmpeg', ['-hide_banner', ...args], {encoding: 'utf8'}).stderr;

// 1) loudnorm en dos pasadas a -14 LUFS, true peak -1.5 dB
const pass1 = ff(['-i', SRC, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-']);
const m = JSON.parse(pass1.slice(pass1.lastIndexOf('{'), pass1.lastIndexOf('}') + 1));
ff([
  '-y', '-i', SRC, '-af',
  `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`,
  '-ar', '48000', 'public/voz.norm.wav',
]);
console.log(`Voz normalizada: ${m.input_i} LUFS → -14 LUFS`);

// 2) silencios
const dur = Number(ff(['-i', SRC]).match(/Duration: (\d+):(\d+):([\d.]+)/)!.slice(1).reduce((a, v) => a * 60 + Number(v), 0));
const sd = ff(['-i', 'public/voz.norm.wav', '-af', 'silencedetect=noise=-38dB:d=0.11', '-f', 'null', '-']);
const starts = [...sd.matchAll(/silence_start: ([\d.]+)/g)].map((x) => Number(x[1]));
const ends = [...sd.matchAll(/silence_end: ([\d.]+)/g)].map((x) => Number(x[1]));
const silences = starts.map((s, i) => ({s, e: ends[i] ?? dur, mid: (s + (ends[i] ?? dur)) / 2}));
const speechStart = silences[0]?.s === 0 ? silences[0].e : 0;
const lastSil = silences[silences.length - 1];
const speechEnd = lastSil && lastSil.e >= dur - 0.05 ? lastSil.s : dur;
console.log(`Duración ${dur.toFixed(2)} s · ${silences.length} silencios · habla ${speechStart.toFixed(2)}–${speechEnd.toFixed(2)} s`);

// 3) alineación guion ↔ voz
// Se trabaja en "tiempo hablado" (sin silencios): ahí la posición esperada de cada
// palabra es proporcional a sus sílabas y no se desfasa por la duración de las pausas.
// Cada silencio real se encaja (programación dinámica) en la frontera de palabra más
// probable, priorizando puntos y comas del guion.
const syl = (w: string) => Math.max(1, (({'7': 'siete', '10': 'diez'} as Record<string, string>)[w.replace(/\W/g, '')] ?? w).toLowerCase().match(/[aeiouáéíóúü]+/g)?.length ?? 1);
const chunks = SCRIPT.map((c) => c.text.replace(/\*/g, '').split(/\s+/));
const flat = chunks.flatMap((ws, ci) => ws.map((w, wi) => ({w, ci, wi, last: wi === ws.length - 1})));
const inner = silences.filter((x) => x.s > speechStart + 0.05 && x.e < speechEnd - 0.05);

const toSpeech = (t: number) => {
  let gone = 0;
  for (const x of inner) if (x.e <= t) gone += x.e - x.s; else if (x.s < t) gone += t - x.s;
  return t - speechStart - gone;
};
const totalSpeech = toSpeech(speechEnd);
const cumSyl: number[] = [];
flat.reduce((a, x, i) => (cumSyl[i] = a + syl(x.w)), 0);
const SYL = cumSyl[cumSyl.length - 1];

const strength = (i: number) => (/[.?!]$/.test(flat[i].w) ? 1 : /[,;:]$/.test(flat[i].w) ? 0.6 : flat[i].last ? 0.4 : 0.03);
const K = flat.length - 1;
const expect = (k: number) => (cumSyl[k] / SYL) * totalSpeech;
const pos = inner.map((x) => toSpeech(x.s));
const M = inner.length;
const matchCost = (k: number, j: number) => 2.2 * Math.abs(expect(k) - pos[j]) - strength(k) * 1.2;
const unusedSil = (j: number) => 0.8 + 2 * Math.min(0.5, inner[j].e - inner[j].s);
const unusedBound = (k: number) => strength(k) * 0.9;
const dp = Array.from({length: K + 1}, () => new Float64Array(M + 1).fill(Infinity));
const how = Array.from({length: K + 1}, () => new Int8Array(M + 1));
dp[0][0] = 0;
for (let j = 1; j <= M; j++) { dp[0][j] = dp[0][j - 1] + unusedSil(j - 1); how[0][j] = 1; }
for (let k = 1; k <= K; k++) {
  for (let j = 0; j <= M; j++) {
    let best = dp[k - 1][j] + unusedBound(k - 1);
    let h = 2;
    if (j > 0 && dp[k][j - 1] + unusedSil(j - 1) < best) { best = dp[k][j - 1] + unusedSil(j - 1); h = 1; }
    if (j > 0 && dp[k - 1][j - 1] + matchCost(k - 1, j - 1) < best) { best = dp[k - 1][j - 1] + matchCost(k - 1, j - 1); h = 3; }
    dp[k][j] = best;
    how[k][j] = h;
  }
}
const anchor = new Map<number, number>(); // palabra k → silencio que la sigue
for (let k = K, j = M; k > 0 || j > 0; ) {
  const h = how[k][j];
  if (h === 3) { anchor.set(k - 1, j - 1); k--; j--; } else if (h === 1) j--; else k--;
}
console.log(`Fronteras encajadas en silencios reales: ${anchor.size} de ${M}`);
if (process.env.DEBUG) [...anchor.entries()].sort((a, b) => a[0] - b[0]).forEach(([k, j]) => console.log(`  ${inner[j].s.toFixed(2)} (habla ${pos[j].toFixed(2)}) ← "${flat[k].w}" esperado ${expect(k).toFixed(2)}`));

// entre anclas, las palabras se reparten por sílabas
const times: [number, number][] = new Array(flat.length);
const segStarts = [0, ...[...anchor.keys()].sort((a, b) => a - b).map((k) => k + 1)];
segStarts.forEach((s0, si) => {
  const e0 = si + 1 < segStarts.length ? segStarts[si + 1] - 1 : flat.length - 1;
  const t0 = s0 === 0 ? speechStart : inner[anchor.get(s0 - 1)!].e;
  const t1 = e0 === flat.length - 1 ? speechEnd : inner[anchor.get(e0)!].s;
  let tot = 0;
  for (let i = s0; i <= e0; i++) tot += syl(flat[i].w);
  let t = t0;
  for (let i = s0; i <= e0; i++) {
    const d = ((t1 - t0) * syl(flat[i].w)) / tot;
    times[i] = [Number(t.toFixed(3)), Number((t + d).toFixed(3))];
    t += d;
  }
});
// 4) Si hay transcripción con tiempos por palabra (public/voz.words.json, de
//    scripts/transcribe.py), manda ella: se alinea guion ↔ transcripción por edición
//    (tolera palabras distintas o faltantes) y se usan los tiempos reales.
const TRANSCRIPT = 'public/voz.words.json';
if (existsSync(TRANSCRIPT)) {
  const tr: [string, number, number][] = JSON.parse(readFileSync(TRANSCRIPT, 'utf8'));
  const norm = (w: string) =>
    (({'7': 'siete', '10': 'diez'} as Record<string, string>)[w.replace(/\W/g, '')] ?? w)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-zñ0-9]/g, '');
  const sim = (a: string, b: string) => {
    if (a === b) return 0;
    const d = Array.from({length: a.length + 1}, (_, i) => [i, ...new Array(b.length).fill(0)]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++)
      for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length] / Math.max(a.length, b.length); // 0 = igual, 1 = distinta
  };
  const A = flat.map((x) => norm(x.w));
  const B = tr.map((x) => norm(x[0]));
  const D = Array.from({length: A.length + 1}, () => new Float64Array(B.length + 1));
  for (let i = 1; i <= A.length; i++) D[i][0] = i * 0.8;
  for (let j = 1; j <= B.length; j++) D[0][j] = j * 0.8;
  for (let i = 1; i <= A.length; i++)
    for (let j = 1; j <= B.length; j++) D[i][j] = Math.min(D[i - 1][j] + 0.8, D[i][j - 1] + 0.8, D[i - 1][j - 1] + 1.4 * sim(A[i - 1], B[j - 1]));
  const match: (number | null)[] = new Array(A.length).fill(null);
  for (let i = A.length, j = B.length; i > 0 && j > 0; ) {
    if (D[i][j] === D[i - 1][j - 1] + 1.4 * sim(A[i - 1], B[j - 1])) {
      if (sim(A[i - 1], B[j - 1]) < 0.5) match[i - 1] = j - 1;
      i--; j--;
    } else if (D[i][j] === D[i - 1][j] + 0.8) i--;
    else j--;
  }
  const matched = match.filter((m) => m !== null).length;
  console.log(`Transcripción: ${matched}/${A.length} palabras del guion encontradas en la voz`);
  const missing = flat.filter((_, i) => match[i] === null).map((x) => x.w);
  if (missing.length) console.log(`  ⚠ no encontradas (se interpolan): ${missing.join(' ')}`);
  flat.forEach((_, i) => {
    const m = match[i];
    if (m !== null) times[i] = [tr[m][1], tr[m][2]];
  });
  // las no encontradas: interpolación entre vecinas encontradas
  flat.forEach((_, i) => {
    if (match[i] !== null) return;
    let a = i - 1;
    while (a >= 0 && match[a] === null) a--;
    let b = i + 1;
    while (b < flat.length && match[b] === null) b++;
    const t0 = a >= 0 ? times[a][1] : speechStart;
    const t1 = b < flat.length ? times[b][0] : speechEnd;
    const n = b - a - 1;
    const k = i - a - 1;
    times[i] = [t0 + ((t1 - t0) * k) / n, t0 + ((t1 - t0) * (k + 1)) / n].map((v) => Number(v.toFixed(3))) as [number, number];
  });
}

const words = chunks.map((_, ci) => flat.map((x, i) => ({x, i})).filter(({x}) => x.ci === ci).map(({i}) => times[i]));

writeFileSync(OUT_TS, `${header}export const VOICE: {file: string; words: [number, number][][]} | null = ${JSON.stringify({file: 'voz.norm.wav', words})};\n`);
console.log(`✓ ${OUT_TS} escrito (${chunks.length} chunks). Revisá con: npm run review`);
