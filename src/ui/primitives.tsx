import React from 'react';
import {BORDER, COLORS, FONT, GLOW, LABEL, NUMBER, RADIUS} from '../theme';

export const Label: React.FC<{children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties; glow?: boolean}> = ({
  children,
  color = COLORS.gray,
  size = LABEL.fontSize,
  style,
  glow,
}) => (
  <div
    style={{
      ...LABEL,
      fontSize: size,
      color,
      // compensa el espaciado final para que quede ópticamente centrado
      marginRight: '-0.35em',
      textShadow: glow ? GLOW.textSoft : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

export const BigText: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  glow?: 'none' | 'soft' | 'normal' | 'strong';
  style?: React.CSSProperties;
}> = ({children, size = 140, color = COLORS.white, glow = 'normal', style}) => (
  <div
    style={{
      ...NUMBER,
      fontSize: size,
      lineHeight: 1,
      color,
      textShadow: glow === 'none' ? undefined : glow === 'soft' ? GLOW.textSoft : glow === 'strong' ? GLOW.textStrong : GLOW.text,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Box: React.FC<{
  children: React.ReactNode;
  active?: boolean;
  dashed?: boolean;
  size?: number;
  style?: React.CSSProperties;
  padding?: string;
}> = ({children, active = true, dashed = false, size = 40, style, padding = '26px 44px'}) => (
  <div
    style={{
      border: `${BORDER}px ${dashed ? 'dashed' : 'solid'} ${active ? COLORS.white : COLORS.dark}`,
      borderRadius: RADIUS,
      padding,
      color: active ? COLORS.white : COLORS.dark,
      fontFamily: FONT,
      fontWeight: 600,
      fontSize: size,
      letterSpacing: '0.35em',
      textTransform: 'uppercase',
      boxShadow: active ? GLOW.box : 'none',
      textShadow: active ? GLOW.textSoft : 'none',
      whiteSpace: 'nowrap',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}
  >
    <span style={{marginRight: '-0.35em'}}>{children}</span>
  </div>
);

export const Person: React.FC<{size?: number; color?: string; glow?: boolean}> = ({size = 180, color = COLORS.white, glow = true}) => (
  <svg
    width={size}
    height={size * 1.25}
    viewBox="0 0 100 125"
    style={{filter: glow ? GLOW.drop : 'none', overflow: 'visible'}}
  >
    <circle cx={50} cy={30} r={22} fill={color} />
    <path d="M8 125 V100 C8 74 27 60 50 60 C73 60 92 74 92 100 V125 Z" fill={color} />
  </svg>
);

export const Coin: React.FC<{size?: number}> = ({size = 120}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{filter: GLOW.drop, overflow: 'visible'}}>
    <circle cx={50} cy={50} r={48} fill={COLORS.white} />
    <text x={50} y={69} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={56} fill={COLORS.black}>
      $
    </text>
  </svg>
);

export const ArrowDown: React.FC<{opacity?: number}> = ({opacity = 1}) => (
  <svg width={40} height={70} viewBox="0 0 40 70" style={{opacity}}>
    <path d="M20 4 V62 M8 50 L20 64 L32 50" stroke={COLORS.gray} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Línea que tacha un elemento, crece de izquierda a derecha.
export const Strike: React.FC<{p: number; color?: string}> = ({p, color = COLORS.gray}) => (
  <div
    style={{
      position: 'absolute',
      left: -16,
      top: '50%',
      height: 4,
      width: `calc(${p * 100}% + ${32 * p}px)`,
      background: color,
      borderRadius: 2,
      transform: 'translateY(-50%)',
    }}
  />
);

export const ProgressBar: React.FC<{p: number; width?: number; height?: number; strong?: boolean}> = ({
  p,
  width = 860,
  height = 56,
  strong,
}) => (
  <div
    style={{
      width,
      height,
      borderRadius: height,
      border: `${BORDER}px solid ${COLORS.white}`,
      padding: 6,
      boxSizing: 'border-box',
      boxShadow: strong ? GLOW.box : 'none',
    }}
  >
    <div
      style={{
        width: `${Math.max(0, Math.min(1, p)) * 100}%`,
        minWidth: p > 0.001 ? height - 12 : 0,
        height: '100%',
        borderRadius: height,
        background: COLORS.white,
        boxShadow: strong ? GLOW.boxStrong : GLOW.box,
      }}
    />
  </div>
);

export const Center: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: FONT,
      ...style,
    }}
  >
    {children}
  </div>
);
