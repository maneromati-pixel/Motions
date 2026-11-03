# Video TikTok: "El orden de tu sueldo" (Remotion)

- `npm install`: instala las dependencias
- `npm run dev`: abre Remotion Studio para previsualizar (http://localhost:3000)
- `npm run render`: renderiza `out/video.mp4` y regenera `out/subtitulos.srt`
- `npm run srt`: regenera solo los subtítulos
- `npx remotion still Video out/captura.png --frame=480`: captura de un frame puntual

Cosas para editar:
- Usuario de la pantalla final: `const USUARIO` al principio de `src/Video.tsx`
- Tiempos y textos de la voz en off: `src/guion.ts` (los usan el video y el .srt)
- Voz: ver la sección "Voz" más abajo
- Música: si existe `public/musica.mp3`, se suma sola de fondo con volumen 0.15
- Escenas: `src/escenas/EscenaXX.tsx`; componentes: `src/componentes/`

## Voz
- La locución original está en `audio/voz-original.mp3`.
- `npm run voz` corta cada frase según `corte` en `src/guion.ts` y arma `public/voz.mp3` alineado a las escenas
  (lo hace solo `npm run render`).
- Si cambiás la voz, actualizá en `src/guion.ts` los `corte` y las `frases` (tiempos dentro del audio nuevo) y el `dur` de cada escena:
  las animaciones se estiran o comprimen solas para durar eso.
