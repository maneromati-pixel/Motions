import React from 'react';
import {Composition, staticFile} from 'remotion';
import type {Caption} from '@remotion/captions';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {Video, type VideoProps} from './Video';
import {buildTimeline} from './cues';
import {FPS, HEIGHT, WIDTH} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Video"
    component={Video}
    width={WIDTH}
    height={HEIGHT}
    fps={FPS}
    durationInFrames={75 * FPS}
    defaultProps={{captions: [], timeline: []} satisfies VideoProps}
    calculateMetadata={async () => {
      // Duración = la del audio. Escenas = sincronizadas con las palabras de Whisper.
      const [seconds, captions] = await Promise.all([
        getAudioDurationInSeconds(staticFile('voz.mp3')),
        fetch(staticFile('captions.json')).then((r) => r.json() as Promise<Caption[]>),
      ]);
      const durationInFrames = Math.ceil(seconds * FPS);
      return {durationInFrames, props: {captions, timeline: buildTimeline(captions, durationInFrames, FPS)}};
    }}
  />
);
