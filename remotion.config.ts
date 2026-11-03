import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setCodec("h264");
Config.setCrf(18);
Config.setMuted(true);
Config.setPixelFormat("yuv420p");
// Navegador headless preinstalado en el entorno (si no existe, Remotion descarga el suyo).
if (process.env.REMOTION_CHROME) {
  Config.setBrowserExecutable(process.env.REMOTION_CHROME);
}
