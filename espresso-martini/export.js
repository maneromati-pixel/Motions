// Frame-accurate export: node export.js [out.mp4]  (needs playwright + ffmpeg)
const { chromium } = require('playwright');
const { spawn } = require('child_process');
(async () => {
  const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined, args: ['--ignore-certificate-errors'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + require('path').join(__dirname, 'index.html'));
  await p.waitForFunction(() => window.__ready);
  const FPS = 30, N = 30 * FPS;
  const ff = spawn('ffmpeg', ['-loglevel','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','16','-preset','medium','-movflags','+faststart', process.argv[2] || 'espresso-martini-1080x1920.mp4'], { stdio: ['pipe','inherit','inherit'] });
  for (let i = 0; i < N; i++) {
    const d = await p.evaluate(t => { window.renderAt(t); return document.getElementById('c').toDataURL('image/jpeg', 0.95); }, i / FPS);
    if (!ff.stdin.write(Buffer.from(d.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
})();
