/** Geometría compartida por las escenas 6 (espiral) y 7 (espiral → flecha). */
import {prog} from '../lib/anim';
import {EASE} from '../theme';
import {scene} from '../timings';

export const SPIRAL_C = {x: 520, y: 820};

/** Espiral de Arquímedes de afuera hacia adentro (nunca llega al centro). */
export const SPIRAL = (() => {
  const turns = 4.2;
  const steps = 260;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const k = i / steps;
    const a = k * turns * Math.PI * 2;
    const r = 250 - 215 * k;
    pts.push(`${(SPIRAL_C.x + Math.cos(a) * r).toFixed(1)} ${(SPIRAL_C.y + Math.sin(a) * r * 0.96).toFixed(1)}`);
  }
  return 'M ' + pts.join(' L ');
})();

/** Flecha recta hacia arriba (un único trazo, la punta al final). */
export const ARROW = `M 520 1080 L 520 560 L 466 618 M 520 560 L 574 618`;

/** Rotación continua de la espiral (deg) en función del frame global. */
export const spiralSpin = (g: number) => {
  const s = scene('spiral').start;
  const x = Math.max(0, g - s);
  return -(x * 1.1 + x * x * 0.0015);
};

/** Rotación de cámara: gira con la espiral y vuelve a 0 al romperse. */
export const spiralCamRot = (g: number, breakAt: number) => {
  const s = scene('spiral');
  const r = -7 * prog(g, s.start, s.end - s.start + 20, EASE.camera);
  return r * (1 - prog(g, breakAt, 18, EASE.in));
};
