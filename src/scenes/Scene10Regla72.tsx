import React from 'react';
import {appear, useIn} from '../ui/anim';
import {BigText, Box, Center, Label} from '../ui/primitives';
import {COLORS} from '../theme';
import type {SceneProps} from './types';

export const Scene10Regla72: React.FC<SceneProps> = ({cues}) => {
  const eq = Math.round((cues.pct + cues.result) / 2);
  const p = [useIn(2), useIn(8), useIn(cues.div), useIn(cues.pct), useIn(eq), useIn(cues.result)];
  const box = {size: 72, padding: '22px 34px', style: {letterSpacing: 0, fontWeight: 900}};
  return (
    <Center>
      <Label color={COLORS.white} glow style={{...appear(p[0]), marginBottom: 110}}>
        Regla del 72
      </Label>
      <div style={{display: 'flex', gap: 22, alignItems: 'center'}}>
        <div style={appear(p[1])}>
          <Box {...box}>72</Box>
        </div>
        <div style={appear(p[2])}>
          <Box {...box} active={false} style={{...box.style, color: COLORS.gray, borderColor: COLORS.dark}}>
            ÷
          </Box>
        </div>
        <div style={appear(p[3])}>
          <Box {...box}>8%</Box>
        </div>
        <div style={appear(p[4])}>
          <Box {...box} active={false} style={{...box.style, color: COLORS.gray, borderColor: COLORS.dark}}>
            =
          </Box>
        </div>
      </div>
      <BigText size={190} glow="strong" style={{...appear(p[5]), marginTop: 110}}>
        9 AÑOS
      </BigText>
      <Label style={{...appear(p[5]), marginTop: 50}}>Tu dinero se duplica</Label>
    </Center>
  );
};
