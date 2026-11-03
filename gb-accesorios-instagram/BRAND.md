# GB Accesorios & Moda — resumen de marca

## Fuentes

- **Logo oficial**: lo pasó la clienta (`brand/logo-original.png`, 1080×1350). De ahí salen la paleta, el estilo tipográfico y el fondo.
- **Instagram** (`instagram.com/gb.accesorios_moda`): no se pudo abrir desde este entorno (dominio bloqueado por la red y la página pide login).
- **Búsqueda web**: no hay publicaciones indexadas, web, tienda, Facebook ni Linktree de la cuenta. *GB Wear* (gbwear.com.ar) es otra marca y se descartó.

## Logo

- `public/logo-gb.png`: el logo original recortado con transparencia mediante `scripts/extract-logo.py`. El script rellena desde los bordes todo lo claro hasta el contorno magenta y suaviza el borde. Queda en 681×472 px y en el video se usa a 820 px de ancho como máximo.
- Estilo: letras **"globo"** G + B, relleno rosa, contorno magenta grueso, brillos blancos y dos corazones (uno sobre la G y otro dentro de su curva).
- Fondo de la pieza original: **cuadriculado ondulado** rosa. Lo recreé como fondo animado (`src/components/CheckerBg.tsx`).

## Paleta (medida sobre el logo)

| Rol | HEX |
|---|---|
| Magenta del contorno (color principal) | `#E30364` |
| Magenta oscuro (volumen / sombras) | `#B0024E` |
| Frambuesa (texto oscuro, derivado) | `#8A0A42` |
| Rosa corazón | `#FB81C4` |
| Rosa globo (relleno de letras) | `#FBAEDB` |
| Rosa cuadros oscuros | `#FBD3EE` |
| Rosa cuadros claros | `#FDECF5` |
| Blanco (brillos) | `#FFFFFF` |

## Tipografía

El logo está dibujado a mano (letras globo con contorno), no es una fuente descargable. Elegí las Google Fonts más parecidas:

- **Titan One** para titulares: gruesa, redondeada y con terminaciones blandas, la más parecida a las letras globo. En el video se usa con relleno rosa, contorno magenta y sombra dura (`bubbleText()` en `src/theme.ts`), igual que el logo. Limitación: el archivo no trae la "í", así que en los títulos con Titan One evité palabras con tilde.
- **Fredoka** para textos de interfaz, bio y botones: redondeada y amigable, combina con el logo y se lee bien en tamaños chicos.

## Tono de comunicación

- Estética **Y2K / girly / kawaii**: corazones, brillos, cuadriculado, rosa total.
- Cercano y juvenil, con voseo: "Seguinos", "encontranos en IG", "Mirá todos los productos".
- Frases cortas y afectivas: "accesorios que enamoran", "tu estilo, en cada detalle".
- Emojis rosas y tiernos: 💖 💕 🎀 ✨ 💌 📦.
- Hashtags: `#GBAccesorios #AccesoriosDeModa`.

## Productos representados

Aros, carteras, collares, lentes, perfumes, anillos, pulseras, hebillas y body splash, como **ilustraciones semirrealistas** (oro metálico, perlas, vidrio, cuero acolchado, brillos y sombras) (`src/components/Products.tsx`). No había fotos reales del catálogo. Si las pasan, se reemplazan ahí.
