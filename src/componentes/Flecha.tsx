import React from 'react';
import {COLOR, GLOW} from '../tema';

// Flecha que se "dibuja" según progreso (0..1). Vertical (abajo) u horizontal (derecha).
export const Flecha: React.FC<{
  largo?: number;
  direccion?: 'abajo' | 'derecha';
  progreso?: number;
  color?: string;
  grosor?: number;
  glow?: boolean;
}> = ({largo = 90, direccion = 'abajo', progreso = 1, color = COLOR.blanco, grosor = 4, glow = true}) => {
  const punta = Math.max(8, largo * 0.16);
  const ancho = punta * 2 + grosor * 2;
  const L = Math.max(0, (largo - grosor) * progreso);
  const vertical = direccion === 'abajo';
  if (progreso <= 0.01) return <div style={{width: vertical ? ancho : largo, height: vertical ? largo : ancho}} />;
  const c = ancho / 2;
  const linea = vertical ? `M ${c} ${grosor / 2} L ${c} ${L}` : `M ${grosor / 2} ${c} L ${L} ${c}`;
  const cabeza = vertical
    ? `M ${c - punta * 0.8} ${L - punta} L ${c} ${L} L ${c + punta * 0.8} ${L - punta}`
    : `M ${L - punta} ${c - punta * 0.8} L ${L} ${c} L ${L - punta} ${c + punta * 0.8}`;
  return (
    <svg
      width={vertical ? ancho : largo}
      height={vertical ? largo : ancho}
      style={{overflow: 'visible', filter: glow ? GLOW : undefined}}
    >
      <path d={linea} stroke={color} strokeWidth={grosor} strokeLinecap="round" fill="none" />
      {progreso > 0.15 && (
        <path
          d={cabeza}
          stroke={color}
          strokeWidth={grosor}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={Math.min(1, (progreso - 0.15) * 4)}
        />
      )}
    </svg>
  );
};
