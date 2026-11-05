import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setConcurrency(null); // automático según CPU
// Chrome local (entorno sin acceso a remotion.media). Comentar para usar el que descarga Remotion.
if (process.env.REMOTION_BROWSER) Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
