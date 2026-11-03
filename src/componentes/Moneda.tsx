import React from 'react';
import {COLOR, FUENTE, GLOW} from '../tema';

// Moneda blanca sólida con "$".
export const Moneda: React.FC<{
  tam?: number;
  glow?: boolean | string;
  style?: React.CSSProperties;
}> = ({tam = 80, glow = false, style}) => (
  <svg
    width={tam}
    height={tam}
    viewBox="0 0 100 100"
    style={{overflow: 'visible', filter: glow ? (typeof glow === 'string' ? glow : GLOW) : undefined, ...style}}
  >
    <circle cx={50} cy={50} r={48} fill={COLOR.blanco} />
    <circle cx={50} cy={50} r={39} fill="none" stroke={COLOR.fondo} strokeWidth={3} opacity={0.25} />
    <text
      x={50}
      y={53}
      textAnchor="middle"
      dominantBaseline="central"
      fontFamily={FUENTE}
      fontWeight={700}
      fontSize={56}
      fill={COLOR.fondo}
    >
      $
    </text>
  </svg>
);
