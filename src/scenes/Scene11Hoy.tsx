import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';
import {appear, ramp, useIn} from '../ui/anim';
import {BigText, Center, Label, Strike} from '../ui/primitives';
import type {SceneProps} from './types';

export const Scene11Hoy: React.FC<SceneProps> = ({cues}) => {
  const frame = useCurrentFrame();
  const p1 = useIn(2);
  const strikeAt = Math.max(16, cues.hoy - 18);
  const strike = ramp(frame, strikeAt, strikeAt + 12);
  const p2 = useIn(cues.hoy);
  return (
    <Center>
      <Label style={{...appear(p1), marginBottom: 40}}>El mejor momento</Label>
      <div style={{...appear(p1), position: 'relative'}}>
        <BigText size={110} glow="none" color={COLORS.gray}>
          HACE 10 AÑOS
        </BigText>
        <Strike p={strike} color={COLORS.gray} />
      </div>
      <BigText size={300} glow="strong" style={{...appear(p2), marginTop: 120}}>
        HOY
      </BigText>
    </Center>
  );
};
