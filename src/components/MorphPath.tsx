/**
 * <MorphPath>: transforma una forma en otra.
 *  - mode 'points' (default): muestrea ambos paths en N puntos y los interpola.
 *    Funciona con trazos abiertos (espiral → flecha), que es lo que necesita
 *    un dibujo de línea.
 *  - mode 'flubber': usa flubber para formas cerradas (círculo → cuenco).
 */
import React, {useMemo} from 'react';
import {getLength, getPointAtLength} from '@remotion/paths';
import {interpolate as flubber} from 'flubber';
import {LineDraw} from './LineDraw';

type Pt = [number, number];

export const samplePath = (d: string, n: number): Pt[] => {
  const len = getLength(d);
  return Array.from({length: n}, (_, i) => {
    const pt = getPointAtLength(d, (len * i) / (n - 1));
    return [pt!.x, pt!.y];
  });
};

export const pointsToPath = (pts: Pt[], closed = false) =>
  'M ' + pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(' L ') + (closed ? ' Z' : '');

export const lerpPoints = (a: Pt[], b: Pt[], p: number): Pt[] => a.map(([x, y], i) => [x + (b[i][0] - x) * p, y + (b[i][1] - y) * p]);

type Props = {
  from: string;
  to: string;
  p: number; // 0 = from, 1 = to
  mode?: 'points' | 'flubber';
  samples?: number;
  closed?: boolean;
  draw?: number; // progreso del trazo
  g?: number;
  width?: number;
  color?: string;
  opacity?: number;
};

export const MorphPath: React.FC<Props> = ({from, to, p, mode = 'points', samples = 240, closed, draw = 1, g = 1, width, color, opacity}) => {
  const fn = useMemo(() => {
    if (mode === 'flubber') return flubber(from, to, {maxSegmentLength: 4});
    const a = samplePath(from, samples);
    const b = samplePath(to, samples);
    return (k: number) => pointsToPath(lerpPoints(a, b, k), closed);
  }, [from, to, mode, samples, closed]);
  const d = p <= 0 ? from : p >= 1 ? to : fn(p);
  return <LineDraw d={d} p={draw} g={g} width={width} color={color} opacity={opacity} />;
};
