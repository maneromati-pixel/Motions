import {Easing} from 'remotion';

/** Easing premium del video. */
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
/** In-out suave para recorridos largos y continuos (curva, conteos con arranque). */
export const EASE_INOUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_SINE = Easing.bezier(0.37, 0, 0.63, 1);

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const lerp = (a: number, b: number, x: number) => a + (b - a) * x;

/** Progreso eased de 0→1 entre `start` y `start+dur` (segundos). */
export const p = (t: number, start: number, dur: number, ease: (x: number) => number = EASE) =>
  dur <= 0 ? (t >= start ? 1 : 0) : ease(clamp01((t - start) / dur));

/** Opacidad de entrada/salida. */
export const inOut = (
  t: number,
  inStart: number,
  inDur: number,
  outStart = Infinity,
  outDur = 0.5,
  ease: (x: number) => number = EASE,
) => p(t, inStart, inDur, ease) * (1 - p(t, outStart, outDur, ease));

/** Formato argentino: 1054900 → "1.054.900". */
export const thousands = (n: number) => {
  const s = Math.round(Math.abs(n)).toString();
  return (n < 0 ? '−' : '') + s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
export const money = (n: number) => '$' + thousands(n);

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const mixColor = (a: string, b: string, x: number) => {
  const A = hex(a);
  const B = hex(b);
  const k = clamp01(x);
  return '#' + A.map((v, i) => Math.round(lerp(v, B[i], k)).toString(16).padStart(2, '0')).join('');
};
