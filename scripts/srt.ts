// Genera out/subtitulos.srt a partir de src/guion.ts
import fs from 'node:fs';
import path from 'node:path';
import {LINEA, FPS} from '../src/guion.ts';

const MAX_LINEA = 38;

const tc = (s: number) => {
  const ms = Math.round(s * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  const r = ms % 1000;
  const p = (n: number, l = 2) => String(n).padStart(l, '0');
  return `${p(h)}:${p(m)}:${p(sec)},${p(r, 3)}`;
};

const dosLineas = (t: string) => {
  if (t.length <= MAX_LINEA) return t;
  const palabras = t.split(' ');
  let mejor = 1;
  let dif = Infinity;
  for (let i = 1; i < palabras.length; i++) {
    const a = palabras.slice(0, i).join(' ').length;
    const b = palabras.slice(i).join(' ').length;
    if (Math.abs(a - b) < dif) {
      dif = Math.abs(a - b);
      mejor = i;
    }
  }
  return palabras.slice(0, mejor).join(' ') + '\n' + palabras.slice(mejor).join(' ');
};

// Cada frase se ubica en el video según su tiempo real en la locución.
const cues: string[] = [];
let n = 1;
for (const esc of LINEA) {
  const inicio = esc.desdeF / FPS;
  const fin = (esc.desdeF + esc.frames) / FPS;
  esc.frases.forEach(([a, b, texto], i) => {
    const desde = inicio + (a - esc.corte[0]);
    const sig = esc.frases[i + 1];
    const tope = sig ? inicio + (sig[0] - esc.corte[0]) - 0.05 : fin - 0.05;
    const hasta = Math.min(tope, inicio + (b - esc.corte[0]) + 0.6);
    cues.push(`${n++}\n${tc(desde)} --> ${tc(hasta)}\n${dosLineas(texto)}\n`);
  });
}

const salida = path.join(import.meta.dirname, '..', 'out', 'subtitulos.srt');
fs.mkdirSync(path.dirname(salida), {recursive: true});
fs.writeFileSync(salida, cues.join('\n'));
console.log(`Subtítulos: ${salida} (${cues.length} bloques)`);
