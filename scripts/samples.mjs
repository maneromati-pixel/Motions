// Exporta portada.png (frame 0) y un PNG de muestra por escena en muestras/,
// más una hoja de contactos (muestras/comparativa.png) para comparar el estilo.
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import path from 'node:path';

const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'Video', browserExecutable});
const {timeline} = composition.props;

mkdirSync('muestras', {recursive: true});
await renderStill({composition, serveUrl, frame: 0, output: 'portada.png', browserExecutable});
console.log('portada.png (frame 0)');

const files = [];
for (let i = 0; i < timeline.length; i++) {
  const {start, end, cues} = timeline[i];
  // Muestra al ~80% de la escena, o después del último momento clave (antes del fade de salida).
  const lastCue = Math.max(0, ...Object.values(cues)) + 18;
  const frame = i === 0 ? 0 : Math.min(end - 9, start + Math.max(Math.round((end - start) * 0.8), lastCue));
  const out = `muestras/escena-${String(i + 1).padStart(2, '0')}.png`;
  await renderStill({composition, serveUrl, frame, output: out, browserExecutable});
  files.push(out);
  console.log(`${out}  (frame ${frame}, escena ${start}-${end})`);
}

const inputs = files.flatMap((f) => ['-i', f]);
const scaled = files.map((_, i) => `[${i}:v]scale=360:640[s${i}]`).join(';');
const layout = files.map((_, i) => `${(i % 6) * 360}_${Math.floor(i / 6) * 640}`).join('|');
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex',
  `${scaled};${files.map((_, i) => `[s${i}]`).join('')}xstack=inputs=${files.length}:layout=${layout}`,
  'muestras/comparativa.png']);
console.log('muestras/comparativa.png');
