// Transcribe voz.mp3 con Whisper (whisper.cpp vía @remotion/install-whisper-cpp)
// y escribe public/captions.json con tiempos palabra por palabra.
//
// Uso: npm run transcribe            (modelo "medium" por defecto)
//      WHISPER_MODEL=large-v3 npm run transcribe
import {execFileSync} from 'node:child_process';
import {copyFileSync, existsSync, mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {
  downloadWhisperModel,
  installWhisperCpp,
  toCaptions,
  transcribe,
} from '@remotion/install-whisper-cpp';

const ROOT = process.cwd();
const WHISPER_DIR = path.join(ROOT, 'whisper.cpp');
const WHISPER_VERSION = '1.5.5';
const MODEL = process.env.WHISPER_MODEL ?? 'medium';

const rootVoice = path.join(ROOT, 'voz.mp3');
const publicVoice = path.join(ROOT, 'public', 'voz.mp3');
if (existsSync(rootVoice)) {
  mkdirSync(path.dirname(publicVoice), {recursive: true});
  copyFileSync(rootVoice, publicVoice);
  console.log('voz.mp3 copiado a public/voz.mp3');
}
if (!existsSync(publicVoice)) {
  console.error('No encuentro voz.mp3 (ni en la raíz del proyecto ni en public/).');
  process.exit(1);
}

await installWhisperCpp({to: WHISPER_DIR, version: WHISPER_VERSION});
await downloadWhisperModel({model: MODEL, folder: WHISPER_DIR});

// whisper.cpp necesita WAV 16 kHz mono
mkdirSync(path.join(ROOT, 'out'), {recursive: true});
const wav = path.join(ROOT, 'out', 'voz-16k.wav');
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', publicVoice, '-ar', '16000', '-ac', '1', wav]);

const output = await transcribe({
  inputPath: wav,
  whisperPath: WHISPER_DIR,
  whisperCppVersion: WHISPER_VERSION,
  model: MODEL,
  modelFolder: WHISPER_DIR,
  tokenLevelTimestamps: true,
  splitOnWord: true,
  language: 'es',
  // Pista de vocabulario para que escriba las cifras con números.
  additionalArgs: [[
    '--prompt',
    'Ahorro e interés compuesto: 25 años, 35 años, 8%, 150.000 dólares, 350.000 dólares, 12.000 dólares, la regla del 72, 9 años.',
  ]],
  onProgress: (p) => process.stdout.write(`\rTranscribiendo... ${Math.round(p * 100)}%`),
});

const {captions} = toCaptions({whisperCppOutput: output});
writeFileSync(path.join(ROOT, 'public', 'captions.json'), JSON.stringify(captions, null, 2));
console.log(`\n${captions.length} palabras -> public/captions.json`);
console.log(captions.map((c) => c.text).join('').trim());
