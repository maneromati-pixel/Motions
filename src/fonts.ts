import {continueRender, delayRender, staticFile} from 'remotion';

const faces = [
  {weight: '600', file: 'fonts/montserrat-latin-600-normal.woff2'},
  {weight: '800', file: 'fonts/montserrat-latin-800-normal.woff2'},
  {weight: '900', file: 'fonts/montserrat-latin-900-normal.woff2'},
];

let loaded = false;

export const loadFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('Cargando Montserrat');
  Promise.all(
    faces.map(async ({weight, file}) => {
      const face = new FontFace('Montserrat', `url(${staticFile(file)}) format('woff2')`, {weight});
      await face.load();
      (document.fonts as unknown as {add: (f: FontFace) => void}).add(face);
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
};
