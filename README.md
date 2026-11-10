# Alquimia · MAK Power Floc Gel — motion graphics 9:16

Video explicativo de 41,5 s, 1080×1920 a 30 fps, hecho con Remotion (React + TypeScript).

- Render final: `out/video_9x16.mp4` (H.264)
- Un frame por escena para revisión: `out/frames/`

## Estructura

| Ruta | Qué contiene |
| --- | --- |
| `src/config.ts` | **Archivo único de configuración**: tiempos de escenas y animaciones, textos, contacto y paleta |
| `src/Video.tsx` | Arma la línea de tiempo: fondo, escenas, transiciones (definidas en `TRANSITIONS`) y música opcional |
| `src/scenes/*.tsx` | Una escena por componente (Gancho, Presentacion, ComoActua, Beneficios, ComoSeUsa, Cierre) |
| `src/components/` | Fondo vivo, títulos, transiciones (ola, reflejo de luz y trazo de la M), pileta, partículas y helpers de animación |
| `src/icons/LineIcons.tsx` | Íconos de línea con volumen (vidrio, esferas, sombras) para beneficios y pasos |
| `src/icons/PhotoSteps.tsx` | Pasos 2 y 3 con las fotos reales: la tapa se despega y el gel cae al canasto |
| `src/components/Materials.tsx` / `RealObject.tsx` | Materiales SVG (esferas, arena, vidrio) y tratamiento 3D/brillo de las fotos del producto |
| `src/mPath.ts` | Trazo de la "M" del logo, vectorizado con potrace |
| `scripts/cutouts.py` | Recorta la cápsula y el disco de gel de `assets/producto.png` (con sombra propia) |
| `scripts/logo_assets.py` | Genera el logo para fondo oscuro y vectoriza la M (`pip install potracer pillow numpy`) |
| `public/` | Assets que se usan en el video: imágenes procesadas y la tipografía Montserrat 400/600 |

## Uso

```bash
npm i
npm run dev        # Remotion Studio (vista previa interactiva)
npm run render     # → out/video_9x16.mp4
npm run assets     # regenera recortes, logo y trazo M desde ./assets
```

### Props

- `telefono` / `instagram` (string): datos de contacto del cierre. Por defecto son `3364 51-9437` y `@alquimia583`, definidos en `CONTACTO` dentro de `src/config.ts`.
- `musicSrc` (string, opcional): puede ser una URL o un archivo dentro de `public/`. Ejemplo:
  `npx remotion render PowerFloc-9x16 out/video_9x16.mp4 --props='{"musicSrc":"musica.mp3"}'`.
  Sin música, el video funciona igual. Con música, el audio entra y sale con un fundido.
