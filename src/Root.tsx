import React from 'react';
import {Composition, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {Video} from './Video';
import {FPS, DURACION_SEG} from './guion';
import {ANCHO, ALTO} from './tema';

loadFont({family: 'Inter', url: staticFile('fonts/inter-latin-500-normal.woff2'), weight: '500'});
loadFont({family: 'Inter', url: staticFile('fonts/inter-latin-700-normal.woff2'), weight: '700'});

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Video"
    component={Video}
    durationInFrames={DURACION_SEG * FPS}
    fps={FPS}
    width={ANCHO}
    height={ALTO}
  />
);
