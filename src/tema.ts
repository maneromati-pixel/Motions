// Paleta y medidas compartidas por todas las escenas.
export const ANCHO = 1080;
export const ALTO = 1920;

export const COLOR = {
  fondo: '#0A0A0A',
  fondoCentro: '#1A1A1A',
  blanco: '#FFFFFF',
  texto: '#E8E8E8',
  gris: '#555555',
  grisMedio: '#8A8A8A',
  fondoCierre: '#0F1020',
  fondoCierreCentro: '#1A1C36',
};

export const FUENTE = 'Inter, "Helvetica Neue", Arial, sans-serif';

// Brillo suave (activo) y fuerte (destacado)
export const GLOW = 'drop-shadow(0 0 8px rgba(255,255,255,0.75))';
export const glowIntenso = (b: number) =>
  `drop-shadow(0 0 ${8 + 10 * b}px rgba(255,255,255,${0.75 + 0.25 * b})) drop-shadow(0 0 ${18 + 22 * b}px rgba(255,255,255,${0.25 + 0.35 * b}))`;

// Zona segura: TikTok tapa abajo (~350px), el lateral derecho (íconos) y un poco arriba.
export const ZONA_SEGURA = {arriba: 170, abajo: 350, izquierda: 60, derecha: 160};
export const ANCHO_UTIL = ANCHO - ZONA_SEGURA.izquierda - ZONA_SEGURA.derecha; // 860

export const SUAVE = {damping: 200};
