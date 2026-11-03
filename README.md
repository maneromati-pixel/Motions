# El millón empieza a los 20 — @zerum00

Video vertical (Remotion + React + TypeScript) sobre interés compuesto:
USD 200/mes desde los 20, 8% anual estimado, capitalización mensual.

- Composición: `ZerumMillon` · 1080×1920 · 60 fps · 62 s · H.264 crf 18 · mudo
- Cifras: `src/data.ts` (no modificar) · Tiempos: `src/timeline.ts`
- Render final: `renders/ZerumMillon.mp4` · Portada (frame 0 del MP4): `renders/cover-frame0.png`

```bash
npm install
npm run dev          # Remotion Studio
npm run render       # out/ZerumMillon.mp4
npm run still:cover  # out/cover-frame0.png
node scripts/stills.mjs 0 12.5 30   # stills de control
```

En entornos sin Chrome descargable: `REMOTION_BROWSER=/ruta/a/chrome-headless-shell`.
