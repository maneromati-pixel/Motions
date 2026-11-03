import {continueRender, delayRender, staticFile} from 'remotion';

// Fuentes empaquetadas localmente (@fontsource) para que el render no dependa de internet.
const faces: Array<[string, string, string]> = [
  ['Titan One', 'titan-one-latin-400-normal.woff2', '400'],
  ['Fredoka', 'fredoka-latin-400-normal.woff2', '400'],
  ['Fredoka', 'fredoka-latin-500-normal.woff2', '500'],
  ['Fredoka', 'fredoka-latin-600-normal.woff2', '600'],
  ['Fredoka', 'fredoka-latin-700-normal.woff2', '700'],
];

let loaded = false;
export const loadFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('Cargando fuentes de marca');
  Promise.all(
    faces.map(([family, file, weight]) => {
      const face = new FontFace(family, `url(${staticFile(`fonts/${file}`)}) format('woff2')`, {weight});
      return face.load().then((f) => document.fonts.add(f));
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
};
