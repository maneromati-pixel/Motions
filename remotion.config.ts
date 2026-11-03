import {Config} from '@remotion/cli/config';

// H.264, crf 18, 60 fps vertical, con voz en off (AAC).
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
Config.setColorSpace('bt709');
Config.setAudioCodec('aac');
Config.setAudioBitrate('192k');
Config.setOverwriteOutput(true);
Config.setBrowserExecutable(process.env.REMOTION_BROWSER ?? null);
