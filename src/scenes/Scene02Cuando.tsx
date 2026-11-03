import React from 'react';
import {interpolateColors, useCurrentFrame} from 'remotion';
import {COLORS, GLOW} from '../theme';
import {appear, ramp, useIn} from '../ui/anim';
import {BigText, Center, Label} from '../ui/primitives';
import type {SceneProps} from './types';

export const Scene02Cuando: React.FC<SceneProps> = ({cues}) => {
  const frame = useCurrentFrame();
  const pNo = useIn(2);
  const dim = ramp(frame, cues.esCuando, cues.esCuando + 10);
  const pSi = useIn(cues.esCuando);
  return (
    <Center>
      <Label style={{...appear(pNo), marginBottom: 70}}>La diferencia</Label>
      <BigText
        size={120}
        glow="none"
        style={{
          ...appear(pNo),
          color: interpolateColors(dim, [0, 1], [COLORS.white, COLORS.dark]),
          textShadow: dim < 1 ? GLOW.textSoft.replace(/0\.35/g, String(0.35 * (1 - dim))) : 'none',
        }}
      >
        NO ES CUÁNTO
      </BigText>
      <BigText size={150} glow="strong" style={{...appear(pSi), marginTop: 60}}>
        ES CUÁNDO
      </BigText>
    </Center>
  );
};
