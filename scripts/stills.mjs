// Renderiza stills de control en varios tiempos con un solo bundle.
// Uso: node scripts/stills.mjs 0 1.5 12.3 ...   (segundos)  [SCALE=0.5]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const times = process.argv.slice(2).map(Number);
const scale = Number(process.env.SCALE ?? 0.5);
const outDir = path.resolve('out/stills');
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const composition = await selectComposition({serveUrl, id: 'ZerumMillon', browserExecutable});
for (const s of times) {
  const frame = Math.round(s * composition.fps);
  const output = path.join(outDir, `t${s.toFixed(2)}.png`);
  await renderStill({composition, serveUrl, frame, output, scale, browserExecutable});
  console.log(output);
}
