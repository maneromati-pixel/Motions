export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 60;
export const DURATION_S = 62;
export const DURATION_FRAMES = DURATION_S * FPS; // 3720

export const C = {
  bgCenter: '#141414',
  bg: '#0A0A0A',
  bgEdge: '#050505',
  text: '#F6F4EB',
  text2: '#8A8A8A',
  off: '#3A3A3A',
  disclaimer: '#5A5A5A',
  gold: '#E8B84B',
  goldHi: '#F5D07A',
  goldDeep: '#9B6D18',
} as const;

export const FONT = {
  sans: '"Plus Jakarta Sans", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
} as const;

/** JetBrains Mono: avance fijo de 0.6em. */
export const MONO_ADV = 0.6;

/**
 * Zonas seguras TikTok: libre la franja inferior (~420px) y el borde derecho (~150px).
 * Columna de contenido: x 90 → 930 (centro óptico 510), y < 1500.
 */
export const SAFE = {
  left: 90,
  right: 930,
  bottom: 1500,
  cx: 510,
  width: 840,
} as const;
