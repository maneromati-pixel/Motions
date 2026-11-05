import React from 'react';
import {Composition, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {Video} from './Video';
import {TOTAL_FRAMES} from './timings';
import {VIDEO} from './theme';

// Inter local (public/fonts) — no depende de la red al renderizar.
const weights: [string, string][] = [
  ['400', 'Inter-Regular.otf'],
  ['500', 'Inter-Medium.otf'],
  ['600', 'Inter-SemiBold.otf'],
  ['700', 'Inter-Bold.otf'],
  ['800', 'Inter-ExtraBold.otf'],
];
weights.forEach(([weight, file]) => loadFont({family: 'Inter', url: staticFile(`fonts/${file}`), weight}));

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Video"
    component={Video}
    durationInFrames={TOTAL_FRAMES}
    fps={VIDEO.fps}
    width={VIDEO.width}
    height={VIDEO.height}
  />
);
