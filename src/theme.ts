/**
 * theme.ts — Sistema visual de la pieza.
 * Colores, curvas de animación, duraciones y tamaños. Cambiar acá cambia todo el video.
 */
import {Easing} from 'remotion';

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

export const COLORS = {
  bg: '#0A0A0A',
  vignetteCenter: '#161616',
  white: '#FFFFFF',
  line: '#F4F4F2', // blanco de línea (apenas cálido para que no sea "digital")
  grey: '#8A8A8A',
  greyDim: '#3A3A3A',
  accent: '#C8102E', // rojo apagado — usarlo SOLO en 2-3 momentos
  night: '#0D0F1F', // fondo del cierre
} as const;

/** Curvas propias. Prohibido el movimiento lineal. */
export const EASE = {
  /** entrada: expo out */
  in: Easing.bezier(0.16, 1, 0.3, 1),
  /** salida: expo in */
  out: Easing.bezier(0.7, 0, 0.84, 0),
  /** trazos de línea */
  stroke: Easing.bezier(0.65, 0, 0.35, 1),
  /** movimientos de cámara muy suaves */
  camera: Easing.bezier(0.45, 0, 0.55, 1),
} as const;

/** Springs: damping alto, sin rebote exagerado. */
export const SPRING = {
  soft: {damping: 22, stiffness: 120, mass: 0.9},
  settle: {damping: 14, stiffness: 160, mass: 0.7}, // leve overshoot que se asienta
  pendulum: {damping: 5, stiffness: 40, mass: 1.4}, // balanza
} as const;

/** Duraciones estándar (frames @30fps). */
export const DUR = {
  stagger: 4, // entre elementos de un grupo (3–5)
  glowDelay: 5, // el glow "se enciende" después del trazo (4–6)
  wordRise: 9, // subida de cada palabra del subtítulo
  captionOut: 8,
  labelIn: 18,
  transition: 14, // solape entre escenas
  breathePeriod: 96, // loop de respiración de los elementos en reposo
} as const;

/** Tipografía y layout (px, sobre 1080x1920). */
export const TYPE = {
  family: 'Inter',
  label: {size: 27, weight: 700, tracking: '0.35em', opacity: 0.85, y: 0.15},
  caption: {size: 44, weight: 600, y: 0.62, maxWidth: 820, restOpacity: 0.75},
  big: {size: 165, weight: 700},
  bigLabel: {size: 20, tracking: '0.4em', opacity: 0.6},
} as const;

export const STROKE = {
  width: 3.5,
  thin: 3,
  glowNear: {blur: 4, opacity: 0.7},
  glowFar: {blur: 18, opacity: 0.25},
} as const;

/**
 * Zonas seguras de TikTok. Nada importante fuera de este rectángulo.
 * Superior 8%, inferior 12%, franja derecha de botones (~130px).
 */
export const SAFE = {
  top: VIDEO.height * 0.08,
  bottom: VIDEO.height * (1 - 0.12),
  left: 90,
  right: VIDEO.width - 130,
  centerX: 520, // centro óptico, corrido 20px a la izquierda por los botones
  stageY: 830, // centro de la zona de ilustración
} as const;
