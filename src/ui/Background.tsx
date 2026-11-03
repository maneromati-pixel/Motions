import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS} from '../theme';

// Fondo negro con viñeta radial. `navy` (0→1) transiciona al degradado de la escena final.
export const Background: React.FC<{navy: number}> = ({navy}) => (
  <AbsoluteFill style={{backgroundColor: COLORS.black}}>
    <AbsoluteFill
      style={{background: `radial-gradient(75% 55% at 50% 50%, ${COLORS.vignetteCenter} 0%, ${COLORS.black} 100%)`}}
    />
    {navy > 0 ? (
      <AbsoluteFill
        style={{
          opacity: navy,
          background: `radial-gradient(75% 55% at 50% 50%, ${COLORS.navyCenter} 0%, ${COLORS.navyEdge} 100%)`,
        }}
      />
    ) : null}
  </AbsoluteFill>
);
