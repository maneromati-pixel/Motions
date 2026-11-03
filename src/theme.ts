export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 60;
export const DURATION_S = 63;
export const DURATION_FRAMES = DURATION_S * FPS; // 3780

export type Palette = {
  bgCenter: string;
  bg: string;
  bgEdge: string;
  text: string;
  text2: string;
  off: string;
  disclaimer: string;
  /** Acento = la plata que hizo el interés (dorado en color, blanco brillante en B/N). */
  gold: string;
  goldHi: string;
  goldDeep: string;
  /** RGB del glow del acento. */
  glow: string;
  /** Intensidad del glow (el blanco florece más que el dorado). */
  glowAmt: number;
  /** Lo que pusiste vos. */
  mine: string;
  /** Tramo bajo de la curva (antes de virar al acento). */
  curveLow: string;
  /** Cursor del buscador sobre la píldora blanca. */
  cursor: string;
};

const BASE = {
  bgCenter: '#141414',
  bg: '#0A0A0A',
  bgEdge: '#050505',
  text2: '#8A8A8A',
  off: '#3A3A3A',
  disclaimer: '#5A5A5A',
};

export const PALETTES: Record<'color' | 'bn', Palette> = {
  color: {
    ...BASE,
    text: '#F6F4EB',
    gold: '#E8B84B',
    goldHi: '#F5D07A',
    goldDeep: '#9B6D18',
    glow: '232,184,75',
    glowAmt: 1,
    mine: '#F6F4EB',
    curveLow: '#F6F4EB',
    cursor: '#9B6D18',
  },
  // Blanco y negro: lo que pusiste = gris; lo que hizo el interés = blanco brillante con glow.
  bn: {
    ...BASE,
    text: '#F4F4F4',
    gold: '#FFFFFF',
    goldHi: '#FFFFFF',
    goldDeep: '#BDBDBD',
    glow: '255,255,255',
    glowAmt: 0.5,
    mine: '#6E6E6E',
    curveLow: '#6E6E6E',
    cursor: '#0A0A0A',
  },
};

/** Paleta activa (la fija cada composición antes de renderizar a sus hijos). */
export const C: Palette = {...PALETTES.color};
export const setPalette = (mode: keyof typeof PALETTES) => Object.assign(C, PALETTES[mode]);

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
