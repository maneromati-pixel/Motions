/**
 * Genera SFX sintéticos y la pista ambiental en /public/sfx con ffmpeg
 * (ruido filtrado + senoidales). Reemplazá cualquier archivo por uno propio
 * con el mismo nombre y el video lo toma sin tocar código.
 *
 *   npm run sfx
 */
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdirSync, renameSync} from 'node:fs';

const OUT = 'public/sfx';
mkdirSync(OUT, {recursive: true});
const SR = 48000;

/** Normaliza el pico del archivo a `peakDb` dBFS (los niveles de mezcla se ajustan en SoundDesign.tsx). */
const normalizePeak = (file, peakDb = -3) => {
  const r = spawnSync('ffmpeg', ['-i', file, '-af', 'volumedetect', '-f', 'null', '-'], {encoding: 'utf8'});
  const max = Number(r.stderr.match(/max_volume: (-?[0-9.]+) dB/)?.[1] ?? 0);
  const tmp = file.replace(/(\.\w+)$/, '.tmp$1');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', file, '-af', `volume=${(peakDb - max).toFixed(2)}dB`, tmp]);
  renameSync(tmp, file);
};

const run = (name, args, {peak = -3, out = name} = {}) => {
  const file = `${OUT}/${out}`;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...args, '-ar', String(SR), '-ac', '2', file]);
  normalizePeak(file, peak);
  console.log('✓', out);
};
const expr = (name, dur, e, filters = 'anull') =>
  run(name, ['-f', 'lavfi', '-i', `aevalsrc='${e}':s=${SR}:d=${dur}`, '-af', filters]);

// whoosh: ruido rosa con barrido de banda y envolvente en campana
run('whoosh.wav', [
  '-f', 'lavfi', '-i', `anoisesrc=c=pink:d=0.7:a=0.9:r=${SR}`,
  '-af', [
    "volume='pow(sin(PI*t/0.7),2)':eval=frame",
    'bandpass=f=900:width_type=h:w=1400',
    'highpass=f=180',
    'lowpass=f=5000',
    'volume=1.6',
    'afade=t=out:st=0.55:d=0.15',
  ].join(','),
]);

// tick: dos senoidales con decaimiento muy corto
expr('tick.wav', 0.12, '0.5*sin(2*PI*1900*t)*exp(-t*60)+0.25*sin(2*PI*3800*t)*exp(-t*90)');

// shing: parciales metálicos inarmónicos + transitorio de ruido agudo
expr(
  'shing.wav',
  1.6,
  '(0.22*sin(2*PI*2310*t)+0.18*sin(2*PI*3697*t)+0.14*sin(2*PI*5120*t)+0.1*sin(2*PI*6930*t)+0.06*sin(2*PI*8410*t))*exp(-t*2.6)*(1-exp(-t*400))+0.35*(random(0)*2-1)*exp(-t*45)',
  'highpass=f=1200,aecho=0.6:0.5:40|70:0.25|0.15,volume=1.2'
);

// golpe grave (cortes a negro): senoidal con caída de pitch + cuerpo
expr(
  'thud.wav',
  1.4,
  '0.9*sin(2*PI*(42*t+38*(1-exp(-t*14))/14))*exp(-t*3.2)+0.3*(random(0)*2-1)*exp(-t*30)',
  'lowpass=f=420,volume=1.1'
);

// click (cierre / tecleo): ráfaga de ruido muy corta en banda media-alta
expr('click.wav', 0.05, '(random(0)*2-1)*exp(-t*260)+0.3*sin(2*PI*2600*t)*exp(-t*200)', 'bandpass=f=3200:width_type=h:w=3000,volume=1.4');

// acento (espiral → flecha): subida tonal corta + golpe suave
expr(
  'accent.wav',
  1.2,
  '0.4*sin(2*PI*(180*t+260*t*t))*(t/0.35)*lt(t,0.35)+0.6*sin(2*PI*330*t)*exp(-(t-0.35)*5)*gte(t,0.35)+0.25*sin(2*PI*660*t)*exp(-(t-0.35)*8)*gte(t,0.35)',
  'lowpass=f=3000,aecho=0.7:0.6:90:0.2'
);

// clink: moneda que toca el piso
expr('clink.wav', 0.6, '0.35*sin(2*PI*4180*t)*exp(-t*9)+0.25*sin(2*PI*6270*t)*exp(-t*12)+0.2*sin(2*PI*2890*t)*exp(-t*7)');

// pista ambiental: pad oscuro (La1 + quinta + octava) con trémolo lento + ruido marrón grave
const DRONE_SECONDS = Number(process.env.DRONE_SECONDS ?? 95);
run('drone.wav', [
  '-f', 'lavfi', '-i',
  `aevalsrc='(0.32*sin(2*PI*55*t)+0.2*sin(2*PI*82.41*t+0.3*sin(2*PI*0.07*t))+0.14*sin(2*PI*110.3*t)+0.07*sin(2*PI*164.8*t))*(0.75+0.25*sin(2*PI*0.09*t))':s=${SR}:d=${DRONE_SECONDS}`,
  '-f', 'lavfi', '-i', `anoisesrc=c=brown:d=${DRONE_SECONDS}:a=0.25:r=${SR}`,
  '-filter_complex',
  `[1]lowpass=f=220,volume=0.6[n];[0][n]amix=inputs=2:normalize=0,lowpass=f=900,afade=t=in:d=1.5,afade=t=out:st=${DRONE_SECONDS - 3}:d=3[out]`,
  '-map', '[out]',
  '-b:a', '128k',
], {peak: -6, out: 'drone.mp3'});
