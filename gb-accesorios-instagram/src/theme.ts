// Identidad visual de GB Accesorios & Moda (inferida — ver BRAND.md).
// Todo el video toma los colores y fuentes de acá: cambiar un valor actualiza todas las placas.
export const colors = {
  carbon: '#1B1717', // negro cálido (texto, fondos oscuros)
  ivory: '#F7F1EB', // crema (fondo principal)
  nude: '#EBD5CB', // nude rosado
  blush: '#D9A9A1', // rosa empolvado
  roseGold: '#B9776E', // rose gold (acentos)
  gold: '#C8A165', // dorado champagne (logo, botones)
  goldDark: '#9C7A43', // dorado profundo (sombras de logo)
  white: '#FFFFFF',
};

export const goldGradient = `linear-gradient(135deg, #E6CC94 0%, ${colors.gold} 45%, ${colors.goldDark} 100%)`;

export const fonts = {
  serif: '"Playfair Display", Georgia, serif',
  sans: '"Montserrat", Helvetica, Arial, sans-serif',
};

export const HANDLE = 'gb.accesorios_moda';
