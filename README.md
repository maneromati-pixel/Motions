# El millón empieza a los 20 — @zerum00

Video vertical (Remotion + React + TypeScript) sobre interés compuesto:
USD 200/mes desde los 20, 8% anual estimado, capitalización mensual.

- Composición: `ZerumMillon` · 1080×1920 · 60 fps · 63 s · H.264 crf 18 · voz en off AAC
- Música: `public/audio/musica.mp3`, desde el segundo 8, baja y con ducking bajo la voz (`MUSIC` en `src/voice.ts`)
- Voz: `public/audio/voz.mp3` (ElevenLabs). Cada frase se recorta y se ubica sobre su imagen en `src/voice.ts`
- Cifras: `src/data.ts` (no modificar) · Tiempos: `src/timeline.ts`
- Render final: `renders/ZerumMillon.mp4` · Portada (frame 0 del MP4): `renders/cover-frame0.png`
- Versión blanco y negro: composición `ZerumMillonBN` → `renders/ZerumMillon-BN.mp4` · `renders/cover-frame0-BN.png`
  (lo que pusiste = gris, lo que hizo el interés = blanco brillante; paletas en `src/theme.ts`)

```bash
npm install
npm run dev          # Remotion Studio
npm run render       # out/ZerumMillon.mp4
npm run render:bn    # out/ZerumMillon-BN.mp4
npm run still:cover  # out/cover-frame0.png
node scripts/stills.mjs 0 12.5 30   # stills de control
```

En entornos sin Chrome descargable: `REMOTION_BROWSER=/ruta/a/chrome-headless-shell`.
