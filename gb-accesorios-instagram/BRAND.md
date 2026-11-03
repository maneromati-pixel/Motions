# GB Accesorios & Moda — resumen de marca

## Investigación y fuentes

- **Instagram (`instagram.com/gb.accesorios_moda`)**: no se pudo abrir: el dominio está bloqueado por la red de este entorno, y además pide login.
- **Búsqueda web** (`"gb.accesorios_moda"`, `"GB Accesorios & Moda"`, `"GB Accesorios y Moda"` + Argentina): no hay publicaciones indexadas, web, tienda online, Facebook ni Linktree de esta cuenta. El único resultado parecido, *GB Wear* (gbwear.com.ar: cinturones, ojotas), es otra marca y **no** se usó.
- Por eso, **la identidad de abajo es una propuesta inferida** a partir del nombre, el rubro (accesorios y moda) y el voseo del @ (Argentina). Está centralizada en `src/theme.ts` y en `src/components/Logo.tsx` para que se pueda ajustar en minutos apenas tengamos la foto de perfil o capturas del feed.

## Paleta (propuesta)

| Rol | HEX |
|---|---|
| Carbón (texto / fondo oscuro) | `#1B1717` |
| Crema (fondo principal) | `#F7F1EB` |
| Nude rosado | `#EBD5CB` |
| Rosa empolvado | `#D9A9A1` |
| Rose gold (acentos) | `#B9776E` |
| Dorado champagne (logo, botones) | `#C8A165` |
| Dorado profundo | `#9C7A43` |

Nudes + dorado + negro: la combinación más típica en cuentas de bijou y accesorios femeninos (fotos sobre fondos claros, piezas doradas).

## Tipografía

- **Playfair Display** (titulares y monograma): serif de alto contraste, estilo editorial de revista de moda, con una itálica muy elegante para "& Moda" y frases destacadas.
- **Montserrat** (handle, bio, botones, etiquetas en mayúsculas espaciadas): sans geométrica, limpia, la que más se parece a la interfaz de Instagram y a las placas de tiendas online.
- Las dos están empaquetadas en local (`@fontsource`, en `public/fonts`), así el render no depende de internet.

## Logo

No hay una versión pública disponible, así que lo **recreé en SVG** (`src/components/Logo.tsx`): monograma **G*B*** (G recta + B itálica) en dorado degradé, dentro de un aro doble, con "ACCESORIOS & MODA" en curva y un rombo como detalle. Si nos pasan el logo real (PNG o SVG), se reemplaza en ese componente.

## Tono de comunicación

- **Cercano y femenino, con voseo rioplatense**: "Seguinos", "Elegí tu favorito", "Mirá todos los productos".
- **Chic pero accesible**: frases cortas y aspiracionales ("Tu estilo, en cada detalle", "Novedades que enamoran").
- **Emojis moderados y de rubro**: ✨ 💍 📦 💌.
- **Hashtags**: `#GBAccesorios #AccesoriosDeModa`.

## Productos representados

Aros, carteras, collares, lentes de sol, relojes, anillos, pulseras, hebillas y perfumes, como **ilustraciones vectoriales** (sin fotos reales disponibles). Estética: fondos nude claros, piezas doradas y negras, brillos sutiles.
