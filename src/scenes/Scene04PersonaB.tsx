import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';
import {appear, ramp, useIn} from '../ui/anim';
import {ArrowDown, Box, Center, Label, Person, Strike} from '../ui/primitives';
import type {SceneProps} from './types';

export const Scene04PersonaB: React.FC<SceneProps> = ({cues}) => {
  const frame = useCurrentFrame();
  const p1 = useIn(2);
  const p2 = useIn(10);
  const pBox = useIn(cues.cuandoGane);
  const strike = ramp(frame, cues.strike, cues.strike + 12);
  return (
    <Center>
      <Label color={COLORS.dark} style={{...appear(p1), marginBottom: 40}}>
        Persona B
      </Label>
      <div style={appear(p1)}>
        <Person size={230} color={COLORS.dark} glow={false} />
      </div>
      <Label color={COLORS.gray} size={40} style={{...appear(p2), marginTop: 60}}>
        Empieza a los 35
      </Label>
      <div style={{...appear(pBox), marginTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
        <ArrowDown opacity={0.6} />
        <div style={{position: 'relative'}}>
          <Box active={false} dashed size={44} style={{color: COLORS.gray, borderColor: COLORS.dark}}>
            Cuando gane más
          </Box>
          <Strike p={strike} color={COLORS.gray} />
        </div>
      </div>
    </Center>
  );
};
