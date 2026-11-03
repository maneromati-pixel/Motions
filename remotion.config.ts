import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');

// En entornos sin acceso a remotion.media (p. ej. este contenedor) usa el Chromium local.
// Define REMOTION_BROWSER con la ruta a un Chrome/Chromium headless si hace falta.
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
