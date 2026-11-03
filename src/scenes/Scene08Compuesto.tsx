import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, SPRING} from '../theme';
import {appear, useIn} from '../ui/anim';
import {BigText, Center, Coin, Label} from '../ui/primitives';
import type {SceneProps} from './types';

const S = 190; // separación
const POS: Record<number, [number, number][]> = {
  1: [[0, 0]],
  2: [[-S / 2, 0], [S / 2, 0]],
  4: [[-1.5 * S, 0], [-S / 2, 0], [S / 2, 0], [1.5 * S, 0]],
  8: [
    [-1.5 * S, -S / 2], [-S / 2, -S / 2], [S / 2, -S / 2], [1.5 * S, -S / 2],
    [-1.5 * S, S / 2], [-S / 2, S / 2], [S / 2, S / 2], [1.5 * S, S / 2],
  ],
};
const STAGES = [1, 2, 4, 8];

export const Scene08Compuesto: React.FC<SceneProps> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pLabel = useIn(2);
  // 4 etapas repartidas en la escena: 1 → 2 → 4 → 8
  const step = Math.max(18, Math.floor((duration - 20) / 4));
  const stageStarts = [8, 8 + step, 8 + 2 * step, 8 + 3 * step];
  let s = 0;
  stageStarts.forEach((st, i) => {
    if (frame >= st) s = i;
  });
  const t = s === 0 ? 1 : spring({frame: frame - stageStarts[s], fps, config: SPRING, durationInFrames: 16});
  const cur = STAGES[s];
  const prev = STAGES[Math.max(0, s - 1)];
  const first = interpolate(frame, [8, 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const coins = Array.from({length: cur}, (_, i) => {
    const to = POS[cur][i];
    const from = s === 0 ? to : i < prev ? POS[prev][i] : POS[prev][i - prev];
    const x = from[0] + (to[0] - from[0]) * t;
    const y = from[1] + (to[1] - from[1]) * t;
    const o = s === 0 ? first : i < prev ? 1 : t;
    return (
      <div key={i} style={{position: 'absolute', left: x - 70, top: y - 70, opacity: o}}>
        <Coin size={140} />
      </div>
    );
  });

  return (
    <Center>
      <Label color={COLORS.white} glow style={{...appear(pLabel), position: 'absolute', top: 440}}>
        Interés compuesto
      </Label>
      <div style={{position: 'relative', width: 0, height: 0}}>{coins}</div>
      <BigText size={110} glow="soft" style={{position: 'absolute', top: 1260, opacity: first}}>
        ×{cur}
      </BigText>
    </Center>
  );
};
