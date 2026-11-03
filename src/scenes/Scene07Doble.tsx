import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, money} from '../theme';
import {appear, useIn} from '../ui/anim';
import {BigText, Center, Label} from '../ui/primitives';
import type {SceneProps} from './types';

export const Scene07Doble: React.FC<SceneProps> = ({cues}) => {
  const frame = useCurrentFrame();
  const p1 = useIn(2);
  const p2 = useIn(cues.termino);
  const count = interpolate(frame, [cues.termino, cues.termino + 30], [0, 200000], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <Center style={{alignItems: 'flex-start', paddingLeft: 110}}>
      <div style={appear(p1)}>
        <Label>Aportó</Label>
        <BigText size={120} glow="none" color={COLORS.gray} style={{marginTop: 20}}>
          +$12.000
        </BigText>
      </div>
      <div style={{...appear(p2), marginTop: 130}}>
        <Label color={COLORS.white} glow>
          Terminó con
        </Label>
        <BigText size={170} glow="strong" style={{marginTop: 24}}>
          +{money(count)}
        </BigText>
      </div>
    </Center>
  );
};
