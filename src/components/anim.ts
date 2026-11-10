import { Easing, interpolate, spring } from "remotion";

/** Ease-out suave, sin rebotes. */
export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** 0→1 entre dos frames, con ease-out y clamp. */
export const prog = (
  frame: number,
  start: number,
  end: number,
  easing: (t: number) => number = easeOut,
) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Spring con damping alto (sin rebote). */
export const softSpring = (frame: number, fps: number, delay = 0, durationInFrames?: number) =>
  spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, stiffness: 80, mass: 1 },
    durationInFrames,
  });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
