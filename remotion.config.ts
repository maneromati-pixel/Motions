import {Config} from '@remotion/cli/config';
import fs from 'node:fs';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
Config.setCrf(18);
Config.setOverwriteOutput(true);

// En este entorno de nube usamos el Chrome headless ya instalado.
// En tu máquina no hace falta: Remotion descarga el suyo automáticamente.
const chromeLocal =
  '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
if (fs.existsSync(chromeLocal)) {
  Config.setBrowserExecutable(chromeLocal);
}
