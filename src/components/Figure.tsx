/**
 * Figura humana mínima de línea (cabeza + cuerpo). Reutilizada en varias escenas.
 * (x, y) = pies. `s` = escala.
 */
import React from 'react';
import {LineDraw} from './LineDraw';

export const figurePaths = (x: number, y: number, s = 1) => {
  const h = 150 * s;
  const head = `M ${x} ${y - h - 44 * s} m ${-22 * s} 0 a ${22 * s} ${22 * s} 0 1 0 ${44 * s} 0 a ${22 * s} ${22 * s} 0 1 0 ${-44 * s} 0`;
  const body = `M ${x} ${y - h + 6 * s} L ${x} ${y - 52 * s} M ${x - 34 * s} ${y - h + 50 * s} L ${x} ${y - h + 24 * s} L ${x + 34 * s} ${y - h + 50 * s} M ${x - 26 * s} ${y} L ${x} ${y - 52 * s} L ${x + 26 * s} ${y}`;
  return {head, body};
};

export const Figure: React.FC<{x: number; y: number; s?: number; p?: number; g?: number; width?: number; color?: string}> = ({
  x,
  y,
  s = 1,
  p = 1,
  g = 1,
  width = 3.5,
  color,
}) => {
  const {head, body} = figurePaths(x, y, s);
  return (
    <g>
      <LineDraw d={head} p={p} g={g} width={width} color={color} />
      <LineDraw d={body} p={Math.max(0, p * 1.2 - 0.2)} g={g} width={width} color={color} />
    </g>
  );
};
