import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Fuentes locales (fontsource): sin dependencia de red al renderizar.
const faces: Array<[string, string, string]> = [
  ['Plus Jakarta Sans', 'plus-jakarta-sans', '400'],
  ['Plus Jakarta Sans', 'plus-jakarta-sans', '500'],
  ['Plus Jakarta Sans', 'plus-jakarta-sans', '600'],
  ['Plus Jakarta Sans', 'plus-jakarta-sans', '700'],
  ['Plus Jakarta Sans', 'plus-jakarta-sans', '800'],
  ['JetBrains Mono', 'jetbrains-mono', '300'],
  ['JetBrains Mono', 'jetbrains-mono', '400'],
  ['JetBrains Mono', 'jetbrains-mono', '500'],
  ['JetBrains Mono', 'jetbrains-mono', '600'],
];

let started = false;
export const ensureFonts = () => {
  if (started) return;
  started = true;
  for (const [family, file, weight] of faces) {
    loadFont({
      family,
      url: staticFile(`fonts/${file}-latin-${weight}-normal.woff2`),
      weight,
      style: 'normal',
    });
  }
};
