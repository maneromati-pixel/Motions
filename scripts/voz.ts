// Arma public/voz.mp3 a partir de audio/voz-original.mp3:
// corta el tramo de cada escena (src/guion.ts) y lo rellena con silencio hasta la duración de la escena.
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {LINEA, FPS} from '../src/guion.ts';

const raiz = path.join(import.meta.dirname, '..');
const entrada = path.join(raiz, 'audio', 'voz-original.mp3');
const salida = path.join(raiz, 'public', 'voz.mp3');

const filtros = LINEA.map(
  (e, i) =>
    `[0:a]atrim=start=${e.corte[0]}:end=${e.corte[1]},asetpts=PTS-STARTPTS,apad,atrim=duration=${(e.frames / FPS).toFixed(4)}[a${i}]`,
);
const concat = `${LINEA.map((_, i) => `[a${i}]`).join('')}concat=n=${LINEA.length}:v=0:a=1[voz]`;

execFileSync(
  'ffmpeg',
  ['-y', '-loglevel', 'error', '-i', entrada, '-filter_complex', [...filtros, concat].join(';'), '-map', '[voz]', '-ar', '44100', '-b:a', '192k', salida],
  {stdio: 'inherit'},
);
console.log(`Voz: ${salida}`);
