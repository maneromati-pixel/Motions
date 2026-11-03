import React from 'react';
import {COLOR, FUENTE, GLOW} from '../tema';

// 48000 -> "48.000"
export const formatear = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// Número grande en bold con glow. El valor animado lo calcula la escena con interpolate().
export const Contador: React.FC<{
  valor: number;
  prefijo?: string;
  size?: number;
  color?: string;
  glow?: boolean;
  style?: React.CSSProperties;
}> = ({valor, prefijo = '$', size = 140, color = COLOR.blanco, glow = true, style}) => (
  <div
    style={{
      fontFamily: FUENTE,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1,
      color,
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-0.01em',
      filter: glow ? GLOW : undefined,
      ...style,
    }}
  >
    {prefijo}
    {formatear(valor)}
  </div>
);
