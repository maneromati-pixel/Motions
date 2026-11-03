import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FONT, HEIGHT, WIDTH} from '../theme';

/** Posiciona un elemento por su ancla (ax, ay ∈ 0..1) en coordenadas del frame. */
export const At: React.FC<{
  x: number;
  y: number;
  ax?: number;
  ay?: number;
  tf?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({x, y, ax = 0.5, ay = 0.5, tf = '', style, children}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      whiteSpace: 'nowrap',
      transform: `translate(${-ax * 100}%, ${-ay * 100}%) ${tf}`,
      transformOrigin: `${ax * 100}% ${ay * 100}%`,
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * Microetiqueta: Jakarta, mayúsculas, tracking amplio.
 * Compensa el tracking final para que el anclaje sea óptico.
 */
export const Micro: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  tracking?: number;
  weight?: number;
  align?: 'left' | 'center' | 'right';
  style?: React.CSSProperties;
}> = ({children, size = 22, color = C.text2, tracking = 0.3, weight = 600, align = 'center', style}) => (
  <span
    style={{
      display: 'inline-block',
      fontFamily: FONT.sans,
      fontWeight: weight,
      fontSize: size,
      letterSpacing: `${tracking}em`,
      textTransform: 'uppercase',
      color,
      lineHeight: 1,
      paddingLeft: align === 'center' ? `${tracking}em` : 0,
      marginRight: align === 'right' ? `-${tracking}em` : 0,
      ...style,
    }}
  >
    {children}
  </span>
);

/** Título de escena: Jakarta bold en mayúsculas. */
export const Headline: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  tracking?: number;
  weight?: number;
  style?: React.CSSProperties;
}> = ({children, size = 44, color = C.text, tracking = 0.08, weight = 700, style}) => (
  <span
    style={{
      display: 'inline-block',
      fontFamily: FONT.sans,
      fontWeight: weight,
      fontSize: size,
      letterSpacing: `${tracking}em`,
      paddingLeft: `${tracking}em`,
      textTransform: 'uppercase',
      color,
      lineHeight: 1.1,
      ...style,
    }}
  >
    {children}
  </span>
);

/** Cifra en mono. */
export const Mono: React.FC<{
  children: React.ReactNode;
  size: number;
  color?: string;
  weight?: number;
  style?: React.CSSProperties;
}> = ({children, size, color = C.text, weight = 500, style}) => (
  <span
    style={{
      display: 'inline-block',
      fontFamily: FONT.mono,
      fontWeight: weight,
      fontSize: size,
      color,
      lineHeight: 1,
      letterSpacing: '-0.02em',
      ...style,
    }}
  >
    {children}
  </span>
);

/**
 * Texto dorado "metal cálido": glow suave debajo, relleno con gradiente vertical
 * y, opcionalmente, un brillo especular (sheen 0..1) que lo recorre una vez.
 */
export const GoldText: React.FC<{
  children: React.ReactNode;
  glow?: number;
  sheen?: number;
  style?: React.CSSProperties;
}> = ({children, glow = 1, sheen = -1, style}) => {
  const clip: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    WebkitTextFillColor: 'transparent',
  };
  const pos = -30 + sheen * 160;
  const sheenAlpha = Math.sin(Math.min(1, Math.max(0, sheen)) * Math.PI);
  return (
    <span style={{position: 'relative', display: 'inline-block', ...style}}>
      <span
        style={{
          color: C.gold,
          textShadow:
            glow > 0
              ? `0 0 22px rgba(${C.glow},${0.34 * glow * C.glowAmt}), 0 0 70px rgba(${C.glow},${0.14 * glow * C.glowAmt})`
              : 'none',
        }}
      >
        {children}
      </span>
      <span
        aria-hidden
        style={{
          ...clip,
          backgroundImage: `linear-gradient(180deg, ${C.goldHi} 0%, ${C.gold} 52%, ${C.goldDeep} 130%)`,
        }}
      >
        {children}
      </span>
      {sheen > 0 && sheen < 1 ? (
        <span
          aria-hidden
          style={{
            ...clip,
            backgroundImage: `linear-gradient(104deg, rgba(255,248,226,0) ${pos - 9}%, rgba(255,248,226,${0.7 * sheenAlpha}) ${pos}%, rgba(255,248,226,0) ${pos + 9}%)`,
          }}
        >
          {children}
        </span>
      ) : null}
    </span>
  );
};

/** Persona: círculo + medio óvalo redondeado, línea fina. `draw` 0..1 dibuja el trazo. */
export const PersonIcon: React.FC<{
  height: number;
  color?: string;
  stroke?: number;
  draw?: number;
}> = ({height, color = C.text, stroke = 3, draw = 1}) => {
  const w = height * (100 / 120);
  const dash = {strokeDasharray: 1, strokeDashoffset: 1 - draw};
  return (
    <svg width={w} height={height} viewBox="0 0 100 120" style={{overflow: 'visible', display: 'block'}}>
      <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
        <circle
          cx={50}
          cy={30}
          r={19}
          pathLength={1}
          strokeWidth={(stroke * 120) / height}
          style={dash}
          transform="rotate(-90 50 30)"
        />
        <path
          d="M14 118 C14 84 30 64 50 64 C70 64 86 84 86 118 Z"
          pathLength={1}
          strokeWidth={(stroke * 120) / height}
          style={dash}
        />
      </g>
    </svg>
  );
};

/** Fondo: #0A0A0A con falloff radial sutil y grano estático para evitar banding. */
export const Background: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: C.bg}}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 78% 62% at 50% 42%, ${C.bgCenter} 0%, ${C.bg} 55%, ${C.bgEdge} 100%)`,
      }}
    />
    <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', inset: 0, opacity: 0.025}}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={7} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  </AbsoluteFill>
);
