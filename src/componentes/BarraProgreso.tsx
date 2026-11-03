import React from 'react';
import {interpolateColors} from 'remotion';
import {COLOR, GLOW} from '../tema';

// Barra de progreso horizontal (se llena hacia la derecha) o vertical (se llena hacia arriba).
// vacia: 0..1 -> el borde pasa a gris (estado "vacío")
export const BarraProgreso: React.FC<{
  progreso: number;
  orientacion?: 'horizontal' | 'vertical';
  largo?: number;
  grosor?: number;
  vacia?: number;
  punteada?: boolean;
  style?: React.CSSProperties;
}> = ({progreso, orientacion = 'horizontal', largo = 800, grosor = 56, vacia = 0, punteada = false, style}) => {
  const vertical = orientacion === 'vertical';
  const colorBorde = punteada ? COLOR.gris : interpolateColors(vacia, [0, 1], [COLOR.blanco, COLOR.gris]);
  const radio = vertical ? 22 : grosor / 2;
  const p = Math.max(0, Math.min(1, progreso));
  const pad = 7;
  return (
    <div
      style={{
        position: 'relative',
        width: vertical ? grosor : largo,
        height: vertical ? largo : grosor,
        border: `3px ${punteada ? 'dashed' : 'solid'} ${colorBorde}`,
        borderRadius: radio,
        filter: punteada || vacia > 0.5 ? undefined : GLOW,
        ...style,
      }}
    >
      {p > 0.001 && (
        <div
          style={{
            position: 'absolute',
            left: pad,
            bottom: pad,
            borderRadius: radio - pad,
            background: COLOR.blanco,
            ...(vertical
              ? {right: pad, height: `calc((100% - ${pad * 2}px) * ${p})`}
              : {top: pad, width: `calc((100% - ${pad * 2}px) * ${p})`, minWidth: grosor - pad * 2}),
          }}
        />
      )}
    </div>
  );
};
