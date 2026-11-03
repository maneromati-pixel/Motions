import type React from 'react';

// Identidad visual de GB Accesorios & Moda, tomada del logo oficial (brand/logo-original.png).
// Todo el video toma los colores y fuentes de acá.
export const colors = {
  hot: '#E30364', // magenta del contorno del logo
  hotDark: '#B0024E', // sombra / volumen del magenta
  ink: '#8A0A42', // texto oscuro (frambuesa profunda, derivado del magenta)
  heart: '#FB81C4', // rosa del corazón chico
  bubble: '#FBAEDB', // relleno de las letras globo
  blush: '#FBD3EE', // cuadros oscuros del fondo
  cream: '#FDECF5', // cuadros claros del fondo
  white: '#FFFFFF', // brillos
};

export const hotGradient = `linear-gradient(135deg, #FF6FB1 0%, ${colors.hot} 60%, ${colors.hotDark} 100%)`;

export const fonts = {
  display: '"Titan One", "Arial Rounded MT Bold", sans-serif', // letras globo
  round: '"Fredoka", "Arial Rounded MT Bold", sans-serif', // textos redondeados
};

// Texto "globo" como el logo: relleno rosa, contorno magenta grueso y volumen abajo.
export const bubbleText = (
  stroke: number,
  fill: string = colors.bubble,
  outline: string = colors.hot,
  depth: string = colors.hotDark,
): React.CSSProperties => ({
  fontFamily: fonts.display,
  color: fill,
  WebkitTextStroke: `${stroke}px ${outline}`,
  paintOrder: 'stroke fill',
  textShadow: `0 ${stroke * 0.6}px 0 ${depth}`,
});

export const HANDLE = 'gb.accesorios_moda';
