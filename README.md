# Reel "Una termina con el doble" (Remotion)

Video vertical 1080x1920 · 30 fps · motion graphics minimalista y monocromo.
La duración es la de `voz.mp3`, y cada escena arranca cuando Whisper detecta su frase en la narración.

## Uso

```bash
npm install
# 1. Pon voz.mp3 en la raíz del proyecto
npm run transcribe   # whisper.cpp → public/captions.json (+ copia la voz a public/voz.mp3)
npm run render       # → video_final.mp4
npm run portada      # → portada.png (frame 0)
npm run muestras     # → muestras/escena-XX.png + muestras/comparativa.png
npm run dev          # Remotion Studio
```

- `npm run transcribe` descarga el modelo de Whisper desde `huggingface.co` (por defecto `medium`;
  se cambia con `WHISPER_MODEL=large-v3`). Si no hay acceso a internet, copia `ggml-medium.bin` a `whisper.cpp/`.
- Sin acceso a `remotion.media` (descarga de Chrome headless), define
  `REMOTION_BROWSER=/ruta/a/chrome-headless-shell`.

## Estructura

- `src/theme.ts`: colores, fuente, glow, estilo de etiquetas, números y animación (lo comparten todas las escenas).
- `src/cues.ts`: sincronización. Para cada escena hay frases de la voz que la disparan (`alts`) y
  momentos clave internos (`cues`, p. ej. cuándo aparece "ES CUÁNDO" o "HOY"). Si una frase no se
  encuentra en la transcripción, se usa un tiempo de respaldo proporcional.
- `src/scenes/Scene01Hook.tsx` … `Scene12Sigueme.tsx`: una escena por archivo.
- `src/ui/`: piezas reutilizables (etiqueta, número grande, caja, persona, moneda, barra, tachado, fondo).
- Usuario de la escena final: `USUARIO` en `src/scenes/Scene12Sigueme.tsx`.

El frame 0 (portada) no tiene animación de entrada: la frase gancho y los dos íconos ya están completos.
