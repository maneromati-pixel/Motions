import React from 'react';
import {Composition} from 'remotion';
import {ZerumMillon, ZerumMillonBN} from './ZerumMillon';
import {DURATION_FRAMES, FPS, HEIGHT, WIDTH} from './theme';

export const RemotionRoot: React.FC = () => (
  <>
  <Composition
    id="ZerumMillon"
    component={ZerumMillon}
    durationInFrames={DURATION_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
  <Composition
    id="ZerumMillonBN"
    component={ZerumMillonBN}
    durationInFrames={DURATION_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
  </>
);
