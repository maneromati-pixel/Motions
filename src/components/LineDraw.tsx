/**
 * <LineDraw>: trazo de línea blanca que se dibuja con stroke-dashoffset.
 *  - p: progreso del trazo (0→1)
 *  - g: intensidad del glow (0→1), normalmente con 4–6 frames de delay
 *  - from: 'start' | 'center' (se dibuja desde el centro hacia afuera)
 * pathLength=1 normaliza cualquier path: no hace falta medirlo.
 */
import React from 'react';
import {COLORS, STROKE} from '../theme';
import {Glow} from './Glow';

type Props = {
  d: string;
  p?: number;
  g?: number;
  width?: number;
  color?: string;
  opacity?: number;
  from?: 'start' | 'center';
  /** recorta el inicio del trazo (0→1) para "borrarlo" hacia adelante */
  tail?: number;
  boost?: number;
  dash?: string; // patrón punteado opcional (sin animación de trazo)
};

export const LineDraw: React.FC<Props> = ({
  d,
  p = 1,
  g = 1,
  width = STROKE.width,
  color = COLORS.line,
  opacity = 1,
  from = 'start',
  tail = 0,
  boost = 1,
  dash,
}) => {
  if (p <= 0.001 || tail >= 0.999 || opacity <= 0.001) return null;
  const visible = Math.max(0, p - tail);
  const dashArray = dash ?? (from === 'center' ? `${p} 2` : `${visible} 2`);
  const dashOffset = dash ? 0 : from === 'center' ? -(0.5 - p / 2) : -tail;
  const path = (
    <path
      d={d}
      pathLength={1}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dashArray}
      strokeDashoffset={dashOffset}
    />
  );
  return (
    <g opacity={opacity}>
      <Glow amount={g} boost={boost}>
        {path}
      </Glow>
    </g>
  );
};
