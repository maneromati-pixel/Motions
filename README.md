# Siete respiraciones — pieza explicativa (Remotion)

1080×1920 · 30 fps · Remotion 4 · Inter local · todo el arte es SVG original de línea.

```bash
npm i
npm run dev            # Remotion Studio (preview interactivo)
npm run render         # out/video.mp4 (H.264 CRF 18, AAC 320 kbps, loudness)
```

En entornos sin acceso a `remotion.media`, apuntá a un Chrome local:
`REMOTION_BROWSER=/ruta/a/chrome-headless-shell npm run render`.

## Cambiar textos y tiempos (todo en `src/timings.ts`)

| Querés…                         | Tocá                                                     |
| ------------------------------- | -------------------------------------------------------- |
| Cambiar una frase del subtítulo | `SCRIPT[i].text`                                         |
| Cambiar la palabra destacada    | rodeala con `*asteriscos*` (puede ser más de una palabra) |
| Palabra grande al centro        | `big: 'TEXTO'` (y `bigAccent: true` para rojo)           |
| Mover un corte de escena        | `scene: 'id'` en el chunk donde empieza la escena        |
| Ritmo general sin voz           | `WORDS_PER_SECOND`, `PAUSE`                              |
| Momentos de animación/SFX       | `CUES` (se definen con `cue('palabra del guion')`)       |
| Usuario del cierre              | `USERNAME`                                               |
| Duración del cierre / remate    | `OUTRO_SECONDS`, `FINAL_HOLD`                            |

Las escenas, los subtítulos, las palabras grandes, los SFX y el ducking se
calculan desde ahí. Si una palabra grande cae pegada a un corte, el corte se
demora solo (J-cut, `BIG_MIN_HOLD`).

Colores, curvas, tipografía, grosor de línea, glow y zonas seguras: `src/theme.ts`.
Tipo de transición de cada corte: `src/transitions.ts`.

## Con voz real

1. Copiá la locución a `public/voz.mp3`.
2. `npm run analyze-voice` → la normaliza a -14 LUFS, detecta silencios con
   ffmpeg, encaja cada frase del guion en las pausas reales y escribe
   `src/voice.generated.ts`. Todo el video se re-sincroniza.
3. `npm run review` (frames clave en `/review`) y `npm run render`.

Para precisión de palabra exacta, se puede reemplazar el reparto por sílabas con
timestamps de una transcripción (whisper.cpp) en el mismo formato.

## Sonido

Música de fondo: `public/music/fondo.mp3`, arranca en el segundo 7 de la canción (`MUSIC.startAtSecond`) a volumen leve (`MIX.music`).

`npm run sfx` regenera los SFX sintéticos y el pad en `public/sfx` (ffmpeg).
Reemplazá cualquier archivo por uno propio con el mismo nombre. Los niveles de
mezcla están en `MIX` (`src/audio/SoundDesign.tsx`).

## QC

- `npm run review` → un PNG por escena en `/review` (o `npm run review -- 120 455`).
- `npm run render:preview` + `node scripts/qc-motion.mjs out/preview.mp4` →
  reporta tramos quietos > 1,5 s y saltos fuera de los cortes.

## Estructura

```
src/
  theme.ts  timings.ts  transitions.ts  Video.tsx  Root.tsx
  components/  LineDraw Glow TopLabel KineticCaption BigNumber BigWord Card
               Camera FilmGrain MorphPath MotionBlur Figure SceneContext GlowDefs
  scenes/      S01Hook … S16Outro (una escena por archivo)
  audio/       SoundDesign.tsx
scripts/       generate-audio · analyze-voice · review-stills · qc-motion · loudnorm
```
