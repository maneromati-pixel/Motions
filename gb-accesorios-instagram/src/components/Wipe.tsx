import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, Easing} from 'remotion';
import {colors} from '../theme';

// Barrido diagonal de bandas (magenta / rosa / crema) que tapa cada corte.
// Se monta centrado en el corte: dura 2*half frames, cubre la pantalla justo en el medio.
export const Wipe: React.FC<{half?: number; variant?: number}> = ({half = 9, variant = 0}) => {
  const frame = useCurrentFrame();
  const bands = variant % 2 === 0 ? [colors.hot, colors.bubble, colors.cream] : [colors.heart, colors.white, colors.hot];
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      {bands.map((c, i) => {
        const delay = i * 2;
        const p = interpolate(frame - delay, [0, half * 2 - 4], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.inOut(Easing.cubic),
        });
        // banda que entra desde abajo-izquierda y sale arriba-derecha
        const x = interpolate(p, [0, 1], [-3000, 3000]);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 2000,
              height: 4200,
              marginLeft: -1000,
              marginTop: -2100,
              background: c,
              transform: `rotate(28deg) translateX(${x}px)`,
              boxShadow: '0 0 60px rgba(0,0,0,0.15)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
