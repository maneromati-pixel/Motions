/**
 * QC de ritmo: mide la diferencia entre frames consecutivos de un render.
 *  - Reporta tramos de > 1.5 s sin movimiento perceptible.
 *  - Reporta "pops" (saltos bruscos) que no coinciden con un corte de escena.
 *   node scripts/qc-motion.mjs out/preview.mp4
 */
import {spawnSync} from 'node:child_process';

const file = process.argv[2] ?? 'out/preview.mp4';
const r = spawnSync('ffmpeg', ['-i', file, '-vf', 'scale=108:192:flags=area,tblend=all_mode=difference,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-', '-an', '-f', 'null', '-'], {encoding: 'utf8', maxBuffer: 1 << 28});
const vals = [...r.stdout.matchAll(/YAVG=([\d.]+)/g)].map((m) => Number(m[1]));
const scenes = JSON.parse(spawnSync('npx', ['-y', 'tsx', '-e', "import {SCENES,BLACK_CUTS} from './src/timings'; console.log(JSON.stringify({s:SCENES.map(s=>s.start), b:BLACK_CUTS}))"], {encoding: 'utf8'}).stdout);
const cuts = new Set(scenes.s.flatMap((c) => [c - 9, c - 8, c - 7, c - 6, c - 5, c - 4, c - 3, c - 2, c - 1, c, c + 1, c + 2, c + 3, c + 4, c + 5, c + 6, c + 7, c + 8]));
scenes.b.forEach((b) => [b.at - 1, b.at, b.at + b.dur - 1, b.at + b.dur, b.at + b.dur + 1].forEach((x) => cuts.add(x)));

const STILL = 0.02; // YAVG por debajo de esto = quieto (en 0–255)
let run = 0;
const stills = [];
vals.forEach((v, i) => {
  if (v < STILL) run++;
  else {
    if (run > 45) stills.push([i - run, i]);
    run = 0;
  }
});
if (run > 45) stills.push([vals.length - run, vals.length]);
const median = [...vals].sort((a, b) => a - b)[Math.floor(vals.length / 2)];
const pops = vals.map((v, i) => [i + 1, v]).filter(([f, v]) => v > Math.max(4, median * 25) && !cuts.has(f));
console.log(`frames ${vals.length} · mediana dif ${median.toFixed(3)}`);
console.log('Tramos quietos > 1.5 s:', stills.length ? stills.map(([a, b]) => `${a}-${b}`).join(', ') : 'ninguno');
console.log('Pops fuera de cortes:', pops.length ? pops.map(([f, v]) => `${f}(${v.toFixed(1)})`).join(', ') : 'ninguno');
