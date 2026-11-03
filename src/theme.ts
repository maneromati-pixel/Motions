// Sistema visual: monocromo. Todas las escenas usan SOLO estas constantes.
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const COLORS = {
  white: '#FFFFFF',
  gray: '#9A9A9A',
  dark: '#4A4A4A',
  black: '#0A0A0A',
  vignetteCenter: '#1A1A1A',
  // Solo para la escena final
  navyCenter: '#1B1F3B',
  navyEdge: '#0A0A14',
} as const;

export const FONT = "Montserrat, Inter, 'Helvetica Neue', Arial, sans-serif";

export const GLOW = {
  text: '0 0 18px rgba(255,255,255,0.55), 0 0 42px rgba(255,255,255,0.25)',
  textSoft: '0 0 14px rgba(255,255,255,0.35)',
  textStrong: '0 0 24px rgba(255,255,255,0.8), 0 0 70px rgba(255,255,255,0.45), 0 0 120px rgba(255,255,255,0.2)',
  box: '0 0 20px rgba(255,255,255,0.35), 0 0 50px rgba(255,255,255,0.12)',
  boxStrong: '0 0 26px rgba(255,255,255,0.6), 0 0 70px rgba(255,255,255,0.25)',
  drop: 'drop-shadow(0 0 14px rgba(255,255,255,0.5)) drop-shadow(0 0 34px rgba(255,255,255,0.2))',
} as const;

export const LABEL = {
  fontFamily: FONT,
  fontWeight: 600,
  fontSize: 34,
  letterSpacing: '0.35em',
  textTransform: 'uppercase' as const,
};

export const NUMBER = {
  fontFamily: FONT,
  fontWeight: 900,
  letterSpacing: '-0.02em',
};

export const BORDER = 2;
export const RADIUS = 24;

// Animación: spring suave, sin rebote exagerado; fades de 6-10 frames.
export const SPRING = {damping: 200, stiffness: 120, mass: 0.8};
export const FADE = 8;

export const money = (v: number) => '$' + Math.round(v).toLocaleString('de-DE');
