import React from 'react';
import {Composition} from 'remotion';
import {ZerumMillon} from './ZerumMillon';
import {DURATION_FRAMES, FPS, HEIGHT, WIDTH} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="ZerumMillon"
    component={ZerumMillon}
    durationInFrames={DURATION_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
