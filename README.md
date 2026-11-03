# Video TikTok: "El orden de tu sueldo" (Remotion)

- `npm install`: instala las dependencias
- `npm run dev`: abre Remotion Studio para previsualizar (http://localhost:3000)
- `npm run render`: renderiza `out/video.mp4` y regenera `out/subtitulos.srt`
- `npm run srt`: regenera solo los subtítulos
- `npx remotion still Video out/captura.png --frame=480`: captura de un frame puntual

Cosas para editar:
- Usuario de la pantalla final: `const USUARIO` al principio de `src/Video.tsx`
- Tiempos y textos de la voz en off: `src/guion.ts` (los usan el video y el .srt)
- Voz: guardá tu grabación como `public/voz.mp3` y descomentá el `<Audio>` en `src/Video.tsx`
- Música: si existe `public/musica.mp3`, se suma sola de fondo con volumen 0.15
- Escenas: `src/escenas/EscenaXX.tsx`; componentes: `src/componentes/`
