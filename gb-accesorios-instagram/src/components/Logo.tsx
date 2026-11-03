import React from 'react';
import {colors, fonts} from '../theme';

// Monograma "GB" recreado en SVG (Playfair Display + aro doble dorado + texto curvo).
// Todas las props de progreso van de 0 a 1 para poder animarlo por partes.
export const Logo: React.FC<{
  size: number;
  ring?: number; // trazo del aro
  g?: number; // entrada de la G
  b?: number; // entrada de la B
  tagline?: number; // texto curvo "ACCESORIOS & MODA"
  shine?: number; // barrido de brillo sobre las letras (0..1, -1 = apagado)
  onDark?: boolean;
  id?: string;
}> = ({size, ring = 1, g = 1, b = 1, tagline = 1, shine = -1, onDark = false, id = 'logo'}) => {
  const R1 = 280;
  const R2 = 262;
  const c1 = 2 * Math.PI * R1;
  const c2 = 2 * Math.PI * R2;
  const textColor = onDark ? colors.ivory : colors.carbon;
  return (
    <svg width={size} height={size} viewBox="0 0 600 600" style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EAD39E" />
          <stop offset="45%" stopColor={colors.gold} />
          <stop offset="100%" stopColor={colors.goldDark} />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(20)">
          <stop offset={Math.max(0, shine - 0.12)} stopColor="#fff" stopOpacity="0" />
          <stop offset={Math.max(0, shine)} stopColor="#fff" stopOpacity="0.85" />
          <stop offset={Math.min(1, shine + 0.12)} stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <path id={`${id}-arc`} d="M 90 300 A 210 210 0 0 0 510 300" />
        <clipPath id={`${id}-letters`}>
          <text x="300" y="352" dx="12" textAnchor="end" fontFamily={fonts.serif} fontWeight={700} fontSize="230">G</text>
          <text x="300" y="352" dx="-4" textAnchor="start" fontFamily={fonts.serif} fontWeight={700} fontStyle="italic" fontSize="230">B</text>
        </clipPath>
      </defs>

      {/* aro doble */}
      <circle
        cx="300" cy="300" r={R1} fill="none" stroke={`url(#${id}-gold)`} strokeWidth="6"
        strokeDasharray={c1} strokeDashoffset={c1 * (1 - ring)} transform="rotate(-90 300 300)" strokeLinecap="round"
      />
      <circle
        cx="300" cy="300" r={R2} fill="none" stroke={`url(#${id}-gold)`} strokeWidth="1.6" opacity={0.8}
        strokeDasharray={c2} strokeDashoffset={-c2 * (1 - ring)} transform="rotate(-90 300 300)"
      />

      {/* G y B */}
      <g fontFamily={fonts.serif} fontWeight={700} fontSize="230" fill={`url(#${id}-gold)`}>
        <text
          x="300" y="352" textAnchor="end" dx="12"
          opacity={g} transform={`translate(${(1 - g) * -60} 0)`}
          style={{filter: g < 1 ? `blur(${(1 - g) * 10}px)` : undefined}}
        >
          G
        </text>
        <text
          x="300" y="352" textAnchor="start" dx="-4"
          opacity={b} transform={`translate(${(1 - b) * 60} 0)`}
          style={{filter: b < 1 ? `blur(${(1 - b) * 10}px)` : undefined}}
          fontStyle="italic"
        >
          B
        </text>
      </g>

      {/* detalle: línea fina + rombo bajo el monograma */}
      <g opacity={tagline}>
        <line x1={300 - 70 * tagline} y1="392" x2={300 - 12} y2="392" stroke={`url(#${id}-gold)`} strokeWidth="2" />
        <line x1={300 + 12} y1="392" x2={300 + 70 * tagline} y2="392" stroke={`url(#${id}-gold)`} strokeWidth="2" />
        <rect x="294" y="386" width="12" height="12" transform="rotate(45 300 392)" fill={`url(#${id}-gold)`} />
      </g>

      {/* texto curvo */}
      <text
        fontFamily={fonts.sans} fontWeight={600} fontSize="30" fill={textColor}
        letterSpacing={9 + (1 - tagline) * 5} opacity={tagline}
      >
        <textPath href={`#${id}-arc`} startOffset="50%" textAnchor="middle">
          ACCESORIOS &amp; MODA
        </textPath>
      </text>

      {/* brillo que recorre las letras */}
      {shine >= 0 && shine <= 1.2 ? (
        <rect x="0" y="0" width="600" height="600" fill={`url(#${id}-shine)`} clipPath={`url(#${id}-letters)`} />
      ) : null}
    </svg>
  );
};
