import React from 'react';
import {BigText, Center, Label, Person} from '../ui/primitives';

// Portada: en el frame 0 TODO está visible. Sin animaciones de entrada.
export const Scene01Hook: React.FC = () => (
  <Center>
    <Label color="#D4D4D4" size={36}>
      Dos personas. Mismo ahorro.
    </Label>
    <BigText size={104} style={{marginTop: 46, textAlign: 'center', lineHeight: 1.08}}>
      UNA TERMINA
      <br />
      CON EL DOBLE
    </BigText>
    <div style={{display: 'flex', gap: 90, marginTop: 110}}>
      <Person size={170} />
      <Person size={170} />
    </div>
  </Center>
);
