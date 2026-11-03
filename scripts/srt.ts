// Genera out/subtitulos.srt a partir de src/guion.ts
// Cada escena se parte en frases; el tiempo de la escena se reparte según la longitud de cada frase.
import fs from 'node:fs';
import path from 'node:path';
import {GUION} from '../src/guion.ts';

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

// Parte en frases (después de . : … ?) y luego en bloques de hasta 2 líneas.
const frases = (texto: string): string[] => {
  const partes = texto.match(/[^.:…?!]+[.:…?!]*/g)?.map((s) => s.trim()).filter(Boolean) ?? [texto];
  const res: string[] = [];
  for (const f of partes) {
    const palabras = f.split(' ');
    let bloque: string[] = [];
    for (const w of palabras) {
      if ([...bloque, w].join(' ').length > MAX_LINEA * 2 && bloque.length) {
        res.push(bloque.join(' '));
        bloque = [];
      }
      bloque.push(w);
    }
    if (bloque.length) res.push(bloque.join(' '));
  }
  // une fragmentos muy cortos con el siguiente ("Cobra…")
  const unidos: string[] = [];
  for (const f of res) {
    const prev = unidos[unidos.length - 1];
    if (prev && (prev.length < 14 || f.length < 8) && (prev + ' ' + f).length <= MAX_LINEA * 2) unidos[unidos.length - 1] = prev + ' ' + f;
    else unidos.push(f);
  }
  return unidos;
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

let n = 1;
const cues: string[] = [];
for (const esc of GUION) {
  const fs_ = frases(esc.voz);
  const total = fs_.reduce((a, f) => a + f.length, 0);
  const dur = esc.fin - esc.inicio - 0.1;
  let t = esc.inicio;
  for (const f of fs_) {
    const d = (f.length / total) * dur;
    cues.push(`${n++}\n${tc(t)} --> ${tc(t + d - 0.05)}\n${dosLineas(f)}\n`);
    t += d;
  }
}

const salida = path.join(import.meta.dirname, '..', 'out', 'subtitulos.srt');
fs.mkdirSync(path.dirname(salida), {recursive: true});
fs.writeFileSync(salida, cues.join('\n'));
console.log(`Subtítulos: ${salida} (${cues.length} bloques)`);
