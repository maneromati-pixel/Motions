/**
 * Helpers de animación. Todo pasa por curvas de theme.ts — nunca lineal.
 */
import {interpolate, spring, type EasingFunction} from 'remotion';
import {DUR, EASE, SPRING, VIDEO} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Progreso 0→1 entre `start` y `start+dur` con una curva. */
export const prog = (frame: number, start: number, dur: number, ease: EasingFunction = EASE.in) =>
  dur <= 0 ? (frame >= start ? 1 : 0) : interpolate(frame, [start, start + dur], [0, 1], {...clamp, easing: ease});

/** Mapea un progreso 0→1 a un rango. */
export const mix = (p: number, a: number, b: number) => a + (b - a) * p;

/** Trazo + glow que se "enciende" unos frames después. */
export const drawGlow = (frame: number, start: number, dur: number, glowDelay: number = DUR.glowDelay) => ({
  p: prog(frame, start, dur, EASE.stroke),
  g: prog(frame, start + glowDelay + dur * 0.5, dur * 0.6 + 6, EASE.in),
});

/** Opacidad de entrada/salida (expo out al entrar, expo in al salir). */
export const inOut = (frame: number, inStart: number, inDur: number, outStart: number, outDur: number) =>
  Math.min(prog(frame, inStart, inDur, EASE.in), 1 - prog(frame, outStart, outDur, EASE.out));

/** Respiración: escala 1 → 1+amp en loop lento (movimiento secundario). */
export const breathe = (frame: number, amp = 0.015, period: number = DUR.breathePeriod, phase = 0) =>
  1 + amp * (0.5 - 0.5 * Math.cos(((frame + phase) / period) * Math.PI * 2));

/** Deriva suave en px (loop). */
export const drift = (frame: number, amp = 3, period = 140, phase = 0) =>
  amp * Math.sin(((frame + phase) / period) * Math.PI * 2);

/** Spring con leve overshoot que se asienta. */
export const settle = (frame: number, start: number, config: Record<string, number> = SPRING.settle) =>
  spring({frame: frame - start, fps: VIDEO.fps, config});

export const soft = (frame: number, start: number) =>
  spring({frame: frame - start, fps: VIDEO.fps, config: SPRING.soft});

/**
 * Anticipación + overshoot: antes de `start` hay una contracción de `amount`
 * (6 frames) y después un spring que pasa apenas de 1 y se asienta.
 * Devuelve un valor que va de 0 a 1 (con un pequeño negativo previo).
 */
export const anticipate = (frame: number, start: number, amount = 0.08, windup = 6) => {
  if (frame < start - windup) return 0;
  if (frame < start) return -amount * Math.sin((prog(frame, start - windup, windup, EASE.stroke) * Math.PI) / 2);
  const s = settle(frame, start);
  const back = -amount * (1 - prog(frame, start, 4, EASE.in));
  return s + back * (1 - s);
};

/** Ruido determinístico barato (para jitter/grano). */
export const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
