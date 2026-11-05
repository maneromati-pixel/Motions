/**
 * Post-render: out/video.raw.mp4 → out/video.mp4 (video copiado, audio AAC 320 kbps).
 *  - Con voz: normaliza la mezcla final a -14 LUFS (true peak -1 dB), dos pasadas.
 *  - Sin voz: no sube el ambiente a -14 LUFS (quedaría fuerte); solo limita picos.
 */
import {spawnSync} from 'node:child_process';
import {existsSync, readFileSync, unlinkSync} from 'node:fs';

const IN = 'out/video.raw.mp4';
const OUT = 'out/video.mp4';
const hasVoice = !/VOICE[^=]*=\s*null/.test(readFileSync('src/voice.generated.ts', 'utf8'));
const ff = (args) => spawnSync('ffmpeg', ['-hide_banner', ...args], {encoding: 'utf8'});

let af = 'alimiter=limit=0.89:level=false';
if (hasVoice) {
  const p1 = ff(['-i', IN, '-af', 'loudnorm=I=-14:TP=-1:LRA=11:print_format=json', '-vn', '-f', 'null', '-']).stderr;
  const m = JSON.parse(p1.slice(p1.lastIndexOf('{'), p1.lastIndexOf('}') + 1));
  af = `loudnorm=I=-14:TP=-1:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
  console.log(`Mezcla: ${m.input_i} LUFS → -14 LUFS`);
}
const r = ff(['-y', '-i', IN, '-map', '0:v', '-map', '0:a', '-c:v', 'copy', '-af', af, '-ar', '48000', '-c:a', 'aac', '-b:a', '320k', '-movflags', '+faststart', OUT]);
if (r.status !== 0) {
  console.error(r.stderr);
  process.exit(1);
}
const meas = ff(['-i', OUT, '-af', 'ebur128=peak=true', '-vn', '-f', 'null', '-']).stderr;
const I = meas.match(/I:\s+(-?[\d.]+) LUFS/g)?.pop();
console.log(`✓ ${OUT} · loudness final ${I}${hasVoice ? '' : ' (sin voz: solo ambiente + SFX)'}`);
if (existsSync(OUT)) unlinkSync(IN);
