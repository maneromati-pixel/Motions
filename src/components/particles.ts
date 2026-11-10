import { random } from "remotion";

export type Particle = {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
  depth: number; // 0 = lejos (más chica/borrosa), 1 = cerca
  k: number; // valor aleatorio extra
};

/** Partículas deterministas (mismo resultado en cada render). */
export const makeParticles = (
  seed: string,
  n: number,
  area: { x0: number; x1: number; y0: number; y1: number },
  rMin = 4,
  rMax = 12,
): Particle[] =>
  new Array(n).fill(0).map((_, i) => {
    const depth = random(`${seed}-d-${i}`);
    return {
      x: area.x0 + random(`${seed}-x-${i}`) * (area.x1 - area.x0),
      y: area.y0 + random(`${seed}-y-${i}`) * (area.y1 - area.y0),
      r: rMin + (rMax - rMin) * (0.35 + 0.65 * depth) * random(`${seed}-r-${i}`) ** 0.6,
      phase: random(`${seed}-p-${i}`) * Math.PI * 2,
      speed: 0.4 + random(`${seed}-s-${i}`) * 0.8,
      depth,
      k: random(`${seed}-k-${i}`),
    };
  });

/** Movimiento de flotación suave (sin rebotes). */
export const floatPos = (p: Particle, t: number, amp = 26) => ({
  x: p.x + Math.sin(t * 0.7 * p.speed + p.phase) * amp,
  y: p.y + Math.cos(t * 0.5 * p.speed + p.phase * 1.3) * amp * 0.8 - t * 10 * p.speed,
});
