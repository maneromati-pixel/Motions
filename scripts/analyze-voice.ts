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
import {existsSync, writeFileSync} from 'node:fs';
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
const sd = ff(['-i', 'public/voz.norm.wav', '-af', 'silencedetect=noise=-38dB:d=0.16', '-f', 'null', '-']);
const starts = [...sd.matchAll(/silence_start: ([\d.]+)/g)].map((x) => Number(x[1]));
const ends = [...sd.matchAll(/silence_end: ([\d.]+)/g)].map((x) => Number(x[1]));
const silences = starts.map((s, i) => ({s, e: ends[i] ?? dur, mid: (s + (ends[i] ?? dur)) / 2}));
const speechStart = silences[0]?.s === 0 ? silences[0].e : 0;
const lastSil = silences[silences.length - 1];
const speechEnd = lastSil && lastSil.e >= dur - 0.05 ? lastSil.s : dur;
console.log(`Duración ${dur.toFixed(2)} s · ${silences.length} silencios · habla ${speechStart.toFixed(2)}–${speechEnd.toFixed(2)} s`);

// 3) reparto del guion
const syl = (w: string) => Math.max(1, (({'7': 'siete', '10': 'diez'} as Record<string, string>)[w.replace(/\W/g, '')] ?? w).toLowerCase().match(/[aeiouáéíóúü]+/g)?.length ?? 1);
const chunks = SCRIPT.map((c) => c.text.replace(/\*/g, '').split(/\s+/));
const weight = chunks.map((ws) => ws.reduce((a, w) => a + syl(w), 0) + 1.5); // +pausa
const total = weight.reduce((a, b) => a + b, 0);
// Estimación proporcional de cada frontera…
const guesses: number[] = [];
let acc = 0;
for (let i = 0; i < chunks.length - 1; i++) {
  acc += weight[i];
  guesses.push(speechStart + ((speechEnd - speechStart) * acc) / total);
}
// …y asignación monótona (programación dinámica) de fronteras a silencios internos:
// minimiza la distancia a la estimación y premia los silencios largos (pausas reales).
const inner = silences.filter((x) => x.s > speechStart + 0.05 && x.e < speechEnd - 0.05);
const n = guesses.length;
const M = inner.length;
const SKIP = 4; // costo de no encontrar silencio para una frontera
const skipSil = (j: number) => 1.5 * Math.min(0.6, inner[j].e - inner[j].s); // ignorar una pausa larga también cuesta
const cost = (i: number, j: number) => Math.abs(inner[j].mid - guesses[i]) - 0.8 * Math.min(0.6, inner[j].e - inner[j].s);
// dp[i][j] = mejor costo usando fronteras 0..i-1 y silencios 0..j-1
const dp = Array.from({length: n + 1}, () => new Array(M + 1).fill(Infinity));
const how: string[][] = Array.from({length: n + 1}, () => new Array(M + 1).fill(''));
for (let j = 0; j <= M; j++) dp[0][j] = 0;
for (let i = 1; i <= n; i++) {
  for (let j = 0; j <= M; j++) {
    if (j > 0 && dp[i][j - 1] + skipSil(j - 1) < dp[i][j]) { dp[i][j] = dp[i][j - 1] + skipSil(j - 1); how[i][j] = 'skipSil'; }
    if (dp[i - 1][j] + SKIP < dp[i][j]) { dp[i][j] = dp[i - 1][j] + SKIP; how[i][j] = 'noSil'; }
    if (j > 0 && dp[i - 1][j - 1] + cost(i - 1, j - 1) < dp[i][j]) { dp[i][j] = dp[i - 1][j - 1] + cost(i - 1, j - 1); how[i][j] = 'match'; }
  }
}
const chosen: (number | null)[] = new Array(n).fill(null);
for (let i = n, j = M; i > 0; ) {
  const h = how[i][j];
  if (h === 'match') { chosen[i - 1] = j - 1; i--; j--; }
  else if (h === 'skipSil') j--;
  else { i--; }
}
const bounds: number[] = [speechStart, ...chosen.map((c, i) => (c === null ? guesses[i] : inner[c].mid))];
bounds.push(speechEnd);

const words = chunks.map((ws, ci) => {
  // recorta el silencio del borde para que el chunk empiece cuando empieza la voz
  let a = bounds[ci];
  let b = bounds[ci + 1];
  const sa = silences.find((s) => s.mid === a);
  const sb = silences.find((s) => s.mid === b);
  if (sa) a = sa.e;
  if (sb) b = sb.s;
  const tot = ws.reduce((x, w) => x + syl(w), 0);
  let t = a;
  return ws.map((w) => {
    const d = ((b - a) * syl(w)) / tot;
    const r: [number, number] = [Number(t.toFixed(3)), Number((t + d).toFixed(3))];
    t += d;
    return r;
  });
});

writeFileSync(OUT_TS, `${header}export const VOICE: {file: string; words: [number, number][][]} | null = ${JSON.stringify({file: 'voz.norm.wav', words})};\n`);
console.log(`✓ ${OUT_TS} escrito (${chunks.length} chunks). Revisá con: npm run review`);
