import React from 'react';
import {colors} from '../theme';

// Corazón "globo" como los del logo: relleno rosa, contorno magenta y brillo blanco.
export const Heart: React.FC<{size: number; fill?: string; stroke?: string; style?: React.CSSProperties}> = ({
  size,
  fill = colors.bubble,
  stroke = colors.hot,
  style,
}) => (
  <svg width={size} height={size} viewBox="-4 -4 32 32" style={{overflow: 'visible', ...style}}>
    <path
      d="M12 21.5s-8.2-5-10.2-10C.3 7.6 2.7 3.5 6.8 3.5c2.2 0 3.8 1.2 5.2 3.1 1.4-1.9 3-3.1 5.2-3.1 4.1 0 6.5 4.1 5 8-2 5-10.2 10-10.2 10z"
      fill={fill}
      stroke={stroke}
      strokeWidth="2.6"
      strokeLinejoin="round"
    />
    <path d="M5.2 8.2c.4-1.6 1.7-2.6 3.1-2.5" stroke={colors.white} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <circle cx="5" cy="10.6" r="0.9" fill={colors.white} />
  </svg>
);
