// Genera TODO el audio del video por síntesis (sin samples externos).
// Salida: public/audio/*.wav  (44.1 kHz, 16-bit, estéreo)
//
//   node scripts/generate-audio.mjs
//
// Música: loop "chic house" de 10 s a 120 BPM (5 compases de 4/4).
//   - Compás 1 (0–2 s): intro sólo con piano eléctrico + arpegio filtrado (entra el logo).
//   - Desde 2 s (corte a la placa 2): entra el bombo four-on-the-floor, bajo, hi-hats y snaps.
// Efectos: whoosh, pop, shimmer (brillo), tap (clic de "Seguir") y ding (confirmación).

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'audio');
fs.mkdirSync(OUT, {recursive: true});

const SR = 44100;
const TAU = Math.PI * 2;

// ---------- utilidades ----------
let seed = 1234567;
const rand = () => {
  // PRNG determinista (mismo audio en cada ejecución)
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const noise = () => rand() * 2 - 1;

const makeBuf = (seconds) => ({
  L: new Float32Array(Math.ceil(seconds * SR)),
  R: new Float32Array(Math.ceil(seconds * SR)),
});

// pan: -1 izquierda … +1 derecha (equal power)
const put = (buf, i, v, pan = 0) => {
  if (i < 0 || i >= buf.L.length) return;
  const a = (pan + 1) * Math.PI * 0.25;
  buf.L[i] += v * Math.cos(a);
  buf.R[i] += v * Math.sin(a);
};

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

// Biquad RBJ
class Biquad {
  constructor(type, freq, q = 0.707) {
    this.type = type;
    this.x1 = this.x2 = this.y1 = this.y2 = 0;
    this.set(freq, q);
  }
  set(freq, q = this.q) {
    this.q = q;
    const w = (TAU * Math.min(freq, SR * 0.45)) / SR;
    const cos = Math.cos(w);
    const alpha = Math.sin(w) / (2 * q);
    let b0, b1, b2, a0, a1, a2;
    if (this.type === 'lp') {
      b0 = (1 - cos) / 2; b1 = 1 - cos; b2 = (1 - cos) / 2;
    } else if (this.type === 'hp') {
      b0 = (1 + cos) / 2; b1 = -(1 + cos); b2 = (1 + cos) / 2;
    } else {
      // band-pass (ganancia de pico constante)
      b0 = alpha; b1 = 0; b2 = -alpha;
    }
    a0 = 1 + alpha; a1 = -2 * cos; a2 = 1 - alpha;
    this.b0 = b0 / a0; this.b1 = b1 / a0; this.b2 = b2 / a0;
    this.a1 = a1 / a0; this.a2 = a2 / a0;
  }
  run(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1; this.x1 = x;
    this.y2 = this.y1; this.y1 = y;
    return y;
  }
}

const writeWav = (name, buf, peakDb = -1) => {
  const n = buf.L.length;
  let peak = 0;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(buf.L[i]), Math.abs(buf.R[i]));
  const gain = peak > 0 ? Math.pow(10, peakDb / 20) / peak : 1;
  const data = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    const l = Math.max(-1, Math.min(1, buf.L[i] * gain));
    const r = Math.max(-1, Math.min(1, buf.R[i] * gain));
    data.writeInt16LE(Math.round(l * 32767), i * 4);
    data.writeInt16LE(Math.round(r * 32767), i * 4 + 2);
  }
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8);
  h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22);
  h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34);
  h.write('data', 36); h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(path.join(OUT, name), Buffer.concat([h, data]));
  console.log(`✓ ${name}  ${(n / SR).toFixed(2)} s`);
};

// ---------- instrumentos ----------
const BPM = 120;
const BEAT = 60 / BPM; // 0.5 s
const BAR = BEAT * 4; // 2 s
const LEN = 10; // s

function kick(buf, t, vel = 1) {
  const s0 = Math.round(t * SR);
  const len = Math.round(0.45 * SR);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const tt = i / SR;
    const f = 45 + 110 * Math.exp(-tt * 28);
    ph += (TAU * f) / SR;
    const env = Math.exp(-tt * 7.5);
    const click = i < 90 ? noise() * 0.25 * (1 - i / 90) : 0;
    put(buf, s0 + i, (Math.sin(ph) * env + click) * 0.9 * vel);
  }
}

function hat(buf, t, vel = 1, open = false, pan = 0.25) {
  const s0 = Math.round(t * SR);
  const dec = open ? 9 : 45;
  const len = Math.round((open ? 0.35 : 0.09) * SR);
  const hp = new Biquad('hp', 7500, 0.8);
  for (let i = 0; i < len; i++) {
    const env = Math.exp((-i / SR) * dec);
    put(buf, s0 + i, hp.run(noise()) * env * 0.22 * vel, pan);
  }
}

// "snap"/clap: 3 ráfagas de ruido band-pass
function snap(buf, t, vel = 1) {
  const s0 = Math.round(t * SR);
  const bp = new Biquad('bp', 1800, 1.4);
  const len = Math.round(0.25 * SR);
  for (let i = 0; i < len; i++) {
    const tt = i / SR;
    let env = Math.exp(-tt * 22);
    for (const off of [0, 0.011, 0.022]) if (tt >= off && tt < off + 0.008) env += 0.8;
    put(buf, s0 + i, bp.run(noise()) * env * 0.55 * vel, -0.1);
  }
}

function bassNote(buf, t, midi, dur, vel = 1) {
  const s0 = Math.round(t * SR);
  const len = Math.round(dur * SR);
  const f = mtof(midi);
  const lp = new Biquad('lp', 700, 0.9);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const tt = i / SR;
    ph += (TAU * f) / SR;
    const att = Math.min(1, tt / 0.006);
    const rel = Math.min(1, (dur - tt) / 0.03);
    const env = att * rel * (0.55 + 0.45 * Math.exp(-tt * 6));
    // seno + armónicos suaves (bajo redondo)
    const x = Math.sin(ph) + 0.35 * Math.sin(2 * ph) + 0.12 * Math.sin(3 * ph);
    lp.set(250 + 900 * Math.exp(-tt * 10));
    put(buf, s0 + i, lp.run(x) * env * 0.42 * vel);
  }
}

// Piano eléctrico (tipo Rhodes): seno + armónicos con trémolo
function epNote(buf, t, midi, dur, vel = 1, pan = 0) {
  const s0 = Math.round(t * SR);
  const len = Math.round((dur + 0.4) * SR);
  const f = mtof(midi);
  for (let i = 0; i < len; i++) {
    const tt = i / SR;
    const att = Math.min(1, tt / 0.004);
    const rel = tt > dur ? Math.exp(-(tt - dur) * 9) : 1;
    const env = att * rel * Math.exp(-tt * 1.6);
    const trem = 1 + 0.18 * Math.sin(TAU * 4.5 * tt);
    const x =
      Math.sin(TAU * f * tt) +
      0.25 * Math.sin(TAU * 2 * f * tt) * Math.exp(-tt * 4) +
      0.08 * Math.sin(TAU * 7.03 * f * tt) * Math.exp(-tt * 25); // "tine" metálico
    put(buf, s0 + i, x * env * trem * 0.11 * vel, pan + 0.15 * Math.sin(TAU * 0.5 * tt));
  }
}

// Pluck brillante para el arpegio
function pluck(buf, t, midi, vel = 1, pan = 0, cutoff = 6000) {
  const s0 = Math.round(t * SR);
  const len = Math.round(0.5 * SR);
  const f = mtof(midi);
  const lp = new Biquad('lp', cutoff, 0.7);
  for (let i = 0; i < len; i++) {
    const tt = i / SR;
    const env = Math.min(1, tt / 0.002) * Math.exp(-tt * 9);
    // triangular aproximada
    const p = (f * tt) % 1;
    const tri = 4 * Math.abs(p - 0.5) - 1;
    const x = 0.6 * tri + 0.4 * Math.sin(TAU * 2 * f * tt);
    put(buf, s0 + i, lp.run(x) * env * 0.07 * vel, pan);
  }
}

// ---------- MÚSICA ----------
function music() {
  const buf = makeBuf(LEN);
  const arpBuf = makeBuf(LEN);

  // Progresión (La menor, chic/nocturna): Am9 – Fmaj7 – Cmaj7 – G6 – Am9
  const chords = [
    {root: 45, notes: [57, 60, 64, 67, 71]}, // Am9
    {root: 41, notes: [57, 60, 64, 65, 69]}, // Fmaj7 (voicing cercano)
    {root: 48, notes: [55, 59, 60, 64, 67]}, // Cmaj7
    {root: 43, notes: [55, 59, 62, 64, 67]}, // G6
    {root: 45, notes: [57, 60, 64, 67, 71]}, // Am9
  ];

  for (let bar = 0; bar < 5; bar++) {
    const t0 = bar * BAR;
    const ch = chords[bar];
    const intro = bar === 0;

    // Piano eléctrico: golpe en 1 y anticipación en el "y" del 2 (síncopa)
    for (const [beat, dur, vel] of [[0, 0.9, 1], [1.5, 0.45, 0.7], [2.5, 1.2, 0.85]]) {
      ch.notes.forEach((n, k) => epNote(buf, t0 + beat * BEAT + k * 0.006, n, dur, vel, (k - 2) * 0.12));
    }

    // Arpegio en corcheas (2 octavas arriba), alternando paneo
    const arpNotes = [ch.notes[0], ch.notes[2], ch.notes[4], ch.notes[3], ch.notes[1] + 12, ch.notes[4], ch.notes[2] + 12, ch.notes[3]];
    for (let s = 0; s < 8; s++) {
      const cutoff = intro ? 1200 + 2400 * (s / 8) : 6500; // intro filtrada que se abre
      pluck(arpBuf, t0 + s * (BEAT / 2), arpNotes[s] + 12, s % 2 ? 0.75 : 1, s % 2 ? 0.45 : -0.45, cutoff);
    }

    if (intro) {
      // Pequeño redoble de snaps al final de la intro (prepara el drop en 2 s)
      for (const b of [3, 3.25, 3.5, 3.75]) snap(buf, t0 + b * BEAT, 0.35 + (b - 3) * 0.6);
      continue;
    }

    for (let b = 0; b < 4; b++) {
      kick(buf, t0 + b * BEAT, b === 0 ? 1 : 0.9);
      hat(buf, t0 + b * BEAT + BEAT / 2, 1, b === 3 && bar % 2 === 0); // offbeat
      hat(buf, t0 + b * BEAT + BEAT * 0.25, 0.35, false, -0.3); // semicorchea fantasma
      hat(buf, t0 + b * BEAT + BEAT * 0.75, 0.35, false, -0.3);
    }
    snap(buf, t0 + 1 * BEAT);
    snap(buf, t0 + 3 * BEAT);

    // Bajo: raíz en contratiempo + octava (groove disco)
    const r = ch.root;
    const pattern = [[0.5, r, 0.22], [1.5, r + 12, 0.18], [2.5, r, 0.22], [3, r + 7, 0.15], [3.5, r + 12, 0.18]];
    for (const [b, m, d] of pattern) bassNote(buf, t0 + b * BEAT, m, d);
  }

  // Delay estéreo (corchea con puntillo) sobre el arpegio
  const dl = Math.round(BEAT * 0.75 * SR);
  for (let i = 0; i < arpBuf.L.length; i++) {
    const L = arpBuf.L[i] + (i >= dl ? 0.38 * arpBuf.R[i - dl] : 0);
    const R = arpBuf.R[i] + (i >= dl ? 0.38 * arpBuf.L[i - dl] : 0);
    arpBuf.L[i] = L; arpBuf.R[i] = R;
    buf.L[i] += L; buf.R[i] += R;
  }

  // Saturación suave de master
  for (let i = 0; i < buf.L.length; i++) {
    buf.L[i] = Math.tanh(buf.L[i] * 1.4);
    buf.R[i] = Math.tanh(buf.R[i] * 1.4);
  }
  // micro-fades para que el loop no haga clic
  const f = Math.round(0.01 * SR);
  for (let i = 0; i < f; i++) {
    const g = i / f;
    buf.L[i] *= g; buf.R[i] *= g;
    buf.L[buf.L.length - 1 - i] *= g; buf.R[buf.R.length - 1 - i] *= g;
  }
  writeWav('music.wav', buf, -1.5);
}

// ---------- EFECTOS ----------
function whoosh() {
  const dur = 0.6;
  const buf = makeBuf(dur);
  const bpL = new Biquad('bp', 400, 1.2);
  const bpR = new Biquad('bp', 400, 1.2);
  const n = buf.L.length;
  for (let i = 0; i < n; i++) {
    const x = i / n; // 0..1, pico en 0.5 (= 0.3 s)
    const env = Math.pow(Math.sin(Math.PI * Math.pow(x, 0.9)), 2.2);
    const fc = 300 + 4200 * Math.sin(Math.PI * x);
    bpL.set(fc, 1.1); bpR.set(fc * 1.05, 1.1);
    const pan = -0.8 + 1.6 * x; // barrido izquierda → derecha
    const a = (pan + 1) * Math.PI * 0.25;
    buf.L[i] += bpL.run(noise()) * env * Math.cos(a);
    buf.R[i] += bpR.run(noise()) * env * Math.sin(a);
  }
  writeWav('whoosh.wav', buf, -3);
}

function pop() {
  const dur = 0.25;
  const buf = makeBuf(dur);
  let ph = 0;
  for (let i = 0; i < buf.L.length; i++) {
    const t = i / SR;
    const f = 380 + 900 * (1 - Math.exp(-t * 60));
    ph += (TAU * f) / SR;
    const env = Math.min(1, t / 0.002) * Math.exp(-t * 28);
    const click = i < 60 ? noise() * 0.3 * (1 - i / 60) : 0;
    put(buf, i, Math.sin(ph) * env + click);
  }
  writeWav('pop.wav', buf, -2);
}

function shimmer() {
  const dur = 1.6;
  const buf = makeBuf(dur);
  // Campanitas agudas en notas de La menor pentatónica, con entradas escalonadas
  const notes = [93, 96, 100, 103, 105, 108, 100, 112, 105, 108];
  notes.forEach((m, k) => {
    const t0 = k * 0.055 + rand() * 0.02;
    const f = mtof(m);
    const pan = (rand() * 2 - 1) * 0.8;
    const s0 = Math.round(t0 * SR);
    const len = Math.round(1.1 * SR);
    for (let i = 0; i < len; i++) {
      const t = i / SR;
      const env = Math.min(1, t / 0.003) * Math.exp(-t * 4.5);
      const x = Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * f * 2.76 * t) * Math.exp(-t * 12);
      put(buf, s0 + i, x * env * 0.25 * (1 - k * 0.05), pan);
    }
  });
  // aire: ruido muy agudo
  const hp = new Biquad('hp', 9000, 0.7);
  for (let i = 0; i < buf.L.length; i++) {
    const t = i / SR;
    put(buf, i, hp.run(noise()) * 0.05 * Math.exp(-t * 3) * Math.min(1, t / 0.05));
  }
  writeWav('shimmer.wav', buf, -3);
}

function tap() {
  const dur = 0.15;
  const buf = makeBuf(dur);
  const hp = new Biquad('hp', 3000, 0.8);
  for (let i = 0; i < buf.L.length; i++) {
    const t = i / SR;
    const click = hp.run(noise()) * Math.exp(-t * 600);
    const tone = Math.sin(TAU * 1700 * t) * Math.exp(-t * 90) * 0.5;
    const thump = Math.sin(TAU * (110 + 80 * Math.exp(-t * 80)) * t) * Math.exp(-t * 40) * 0.7;
    put(buf, i, click + tone + thump);
  }
  writeWav('tap.wav', buf, -1.5);
}

function ding() {
  const dur = 1.4;
  const buf = makeBuf(dur);
  // dos notas tipo notificación: Mi6 → Si6
  for (const [t0, m] of [[0, 88], [0.11, 95]]) {
    const f = mtof(m);
    const s0 = Math.round(t0 * SR);
    for (let i = 0; i < buf.L.length - s0; i++) {
      const t = i / SR;
      const env = Math.min(1, t / 0.002) * Math.exp(-t * 3.8);
      const x = Math.sin(TAU * f * t) + 0.35 * Math.sin(TAU * f * 2.0 * t) * Math.exp(-t * 6) + 0.15 * Math.sin(TAU * f * 3.01 * t) * Math.exp(-t * 10);
      put(buf, s0 + i, x * env * 0.5, m === 88 ? -0.2 : 0.2);
    }
  }
  writeWav('ding.wav', buf, -2);
}

music();
whoosh();
pop();
shimmer();
tap();
ding();
