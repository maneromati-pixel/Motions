# GB Accesorios & Moda · Reel de Instagram (10 s)

Animación vertical **1080×1920 · 30 fps · 300 frames (10 s)** hecha con Remotion + TypeScript para invitar a seguir a **@gb.accesorios_moda**.

Video final: [`Renders/gb-accesorios-instagram-10s.mp4`](Renders/gb-accesorios-instagram-10s.mp4) (H.264 + AAC).

## Uso

```bash
npm install
npm run audio          # vuelve a sintetizar la música y los efectos (public/audio/*.wav)
npm run studio         # vista previa interactiva
npm run render         # → Renders/gb-accesorios-instagram-10s.mp4
npx remotion still GBInstagram stills/frame.png --frame=120
```

> En este entorno el render usa el Chromium preinstalado:
> `REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell npm run render`.
> En una máquina normal no hace falta: Remotion descarga su propio navegador.

## Guion

| Placa | Tiempo | Frames | Contenido | Audio |
|---|---|---|---|---|
| 1 · Logo | 0–2 s | 0–59 | Cuadriculado ondulado, el logo entra rebotando como un globo, saltan corazones, brillo y *"accesorios & moda / que enamoran 💖"* | intro filtrada + pop + burbujas + shimmer |
| 2 · Perfil | 2–4 s | 60–119 | *"encontranos en IG 💕"*: maqueta del perfil, se tipea `gb.accesorios_moda`, avatar con el logo, bio, botón **Seguir**, destacados y grilla | entra el beat (drop) + whoosh |
| 3 · Productos | 4–6,5 s | 120–194 | *"lo nuevo 💖"*: grilla 3×3 de stickers que gira tile por tile → carrusel *"tu favorito 💕"* (Perfumes → Carteras → Aros) que avanza a tempo | whoosh + shimmer |
| 4 · Mensaje | 6,5–8 s | 195–239 | *"tu estilo, en cada detalle"* en letras globo sobre magenta, corazón que late · NOVEDADES QUE ENAMORAN 💖 | whoosh |
| 5 · Cierre | 8–10 s | 240–299 | Logo + *"Seguinos en @gb.accesorios_moda"*, un dedo toca **+ Seguir** → **Siguiendo ✓** con corazones | whoosh + tap + burbujas + ding, fade-out |

Todos los tiempos (cortes y efectos) están en [`src/timeline.json`](src/timeline.json); el audio y las animaciones leen de ahí.

## Audio (100 % sintetizado por código)

`scripts/generate-audio.mjs` (Node puro, sin samples ni descargas):

- **music.wav** — loop pop/house dulce a **120 BPM** (1 negra = 15 frames, 1 compás = 2 s = 60 frames), progresión Cmaj9 – Am9 – Fmaj9 – G6 – Cmaj9. Piano eléctrico tipo Rhodes con trémolo, arpegio pluck con delay estéreo, bajo disco en contratiempo, bombo four-on-the-floor, hi-hats y snaps. El primer compás es una intro filtrada; el beat entra justo en el corte a la placa 2.
- **whoosh.wav** — ruido con band-pass que barre 300 Hz → 4,5 kHz y paneo izq → der (pico a 0,3 s = sobre el corte).
- **pop.wav** — blip senoidal con glissando ascendente (aparición del logo).
- **shimmer.wav** — campanitas agudas en pentatónica de Do mayor + aire.
- **bubble.wav** — tres blips ascendentes (los corazones que saltan).
- **tap.wav** — clic + golpe grave (presionar "Seguir").
- **ding.wav** — notificación de dos notas (Mi6 → Si6) al quedar "Siguiendo".

En `src/GBInstagram.tsx` la música baja a ~60 % mientras suena cada efecto (ducking) y hace fade-in/fade-out.

## Identidad de marca

Ver [`BRAND.md`](BRAND.md). Colores y fuentes centralizados en [`src/theme.ts`](src/theme.ts).

## Estructura

```
src/
  Root.tsx, index.ts, GBInstagram.tsx   composición + audio
  theme.ts, fonts.ts, timeline.json     marca, fuentes locales, tiempos
  components/  Logo (PNG oficial + brillo), CheckerBg (cuadriculado ondulado), Heart, Products (9 ilustraciones semirrealistas), Sparkle, Wipe
  scenes/      Scene1Logo … Scene5CTA
scripts/generate-audio.mjs              síntesis de audio
scripts/extract-logo.py                 recorta el logo del fondo (brand/ → public/logo-gb.png)
brand/logo-original.png                 logo original enviado por la marca
public/fonts, public/audio              assets locales
stills/                                 fotogramas clave de cada placa
Renders/                                video final
```
