import React from 'react';
import {appear, useIn} from '../ui/anim';
import {ArrowDown, Box, Center, Label, Person} from '../ui/primitives';
import {COLORS} from '../theme';
import type {SceneProps} from './types';

export const Scene03PersonaA: React.FC<SceneProps> = ({cues}) => {
  const p1 = useIn(2);
  const p2 = useIn(10);
  const p3 = useIn(cues.box);
  return (
    <Center>
      <Label style={{...appear(p1), marginBottom: 40}}>Persona A</Label>
      <div style={appear(p1)}>
        <Person size={230} />
      </div>
      <Label color={COLORS.white} glow size={40} style={{...appear(p2), marginTop: 60}}>
        Empieza a los 25
      </Label>
      <div style={{...appear(p3), marginTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
        <ArrowDown />
        <Box size={52}>$100 / mes</Box>
      </div>
    </Center>
  );
};
