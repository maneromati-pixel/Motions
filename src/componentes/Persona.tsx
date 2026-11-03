import React from 'react';
import {COLOR, GLOW} from '../tema';

// Muñequito minimalista: cabeza circular + cuerpo redondeado.
export const Persona: React.FC<{
  alto?: number;
  color?: string;
  glow?: boolean | string;
  style?: React.CSSProperties;
}> = ({alto = 120, color = COLOR.blanco, glow = false, style}) => (
  <svg
    width={(alto * 100) / 140}
    height={alto}
    viewBox="0 0 100 140"
    style={{overflow: 'visible', filter: glow ? (typeof glow === 'string' ? glow : GLOW) : undefined, ...style}}
  >
    <circle cx={50} cy={25} r={22} fill={color} />
    <path d="M12 128 V96 A38 38 0 0 1 88 96 V128 Q88 136 80 136 H20 Q12 136 12 128 Z" fill={color} />
  </svg>
);
