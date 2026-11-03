import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FADE, SPRING} from '../theme';

// Progreso 0→1 de un spring suave que arranca en `at` (frames locales).
export const useIn = (at = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - at, fps, config: SPRING, durationInFrames: 18});
};

export const fadeIn = (frame: number, at = 0, dur = FADE) =>
  interpolate(frame, [at, at + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

export const ramp = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// Estilo de aparición estándar: fade + leve subida.
export const appear = (p: number, dist = 24): React.CSSProperties => ({
  opacity: p,
  transform: `translateY(${(1 - p) * dist}px)`,
});
