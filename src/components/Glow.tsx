/**
 * <Glow>: duplica su contenido SVG en dos capas desenfocadas
 *  - cercana: blur 4px al 70%
 *  - amplia:  blur 18px al 25%
 * `amount` (0→1) permite que el glow "se encienda" después del trazo.
 */
import React from 'react';
import {STROKE} from '../theme';

export const Glow: React.FC<{amount?: number; boost?: number; children: React.ReactNode}> = ({
  amount = 1,
  boost = 1,
  children,
}) => (
  <g>
    {amount > 0.001 && (
      <>
        <g filter="url(#gFar)" opacity={Math.min(1, STROKE.glowFar.opacity * amount * boost)}>
          {children}
        </g>
        <g filter="url(#gNear)" opacity={Math.min(1, STROKE.glowNear.opacity * amount * boost)}>
          {children}
        </g>
      </>
    )}
    {children}
  </g>
);

/** Glow tipográfico (CSS) equivalente al de las líneas. */
export const textGlow = (k = 1, color = '255,255,255') =>
  k <= 0
    ? 'none'
    : `0 0 4px rgba(${color},${0.7 * k}), 0 0 18px rgba(${color},${0.35 * k}), 0 0 42px rgba(${color},${0.18 * k})`;
