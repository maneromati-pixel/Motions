/**
 * Control de calidad: renderiza frames clave de cada escena como PNG en /review.
 *   npm run review            → un frame "clave" por escena (≈ 60% de la escena)
 *   npm run review -- 120 455 → frames puntuales
 */
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {mkdirSync} from 'node:fs';
import path from 'node:path';

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const composition = await selectComposition({serveUrl, id: 'Video', browserExecutable});
mkdirSync('review', {recursive: true});

const args = process.argv.slice(2).map(Number).filter((n) => !Number.isNaN(n));
let frames;
if (args.length) {
  frames = args.map((f) => ({f, name: `f${String(f).padStart(4, '0')}`}));
} else {
  // los tiempos de escena se exponen desde la composición via inputProps no; los recalculamos con tsx
  const {execFileSync} = await import('node:child_process');
  const json = execFileSync('npx', ['-y', 'tsx', '-e', "import {SCENES} from './src/timings'; console.log(JSON.stringify(SCENES))"]).toString();
  const scenes = JSON.parse(json);
  const KEY = {hook: 0.75, breaths: 0.8, warrior: 0.5, calm: 0.92, arrow: 0.55, prepared: 0.9, hiding: 0.62, face: 0.8, luck: 0.86, prudence: 0.55};
  frames = scenes.map((s, i) => {
    const k = KEY[s.id] ?? 0.6;
    return {f: Math.round(s.start + (s.end - s.start) * k), name: `${String(i + 1).padStart(2, '0')}-${s.id}`};
  });
}

for (const {f, name} of frames) {
  await renderStill({composition, serveUrl, frame: f, output: `review/${name}.png`, scale: 0.5, imageFormat: 'png', browserExecutable});
  console.log('✓', name, 'frame', f);
}
