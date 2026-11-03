import React from 'react';
import {colors} from '../theme';

// Ilustraciones vectoriales de productos (estilo flat, paleta rosa de la marca).
// Reemplazables por fotos reales: ver README.

type P = {t?: number}; // t: frame relativo para micro-animaciones (brillos, balanceo)

const G = colors.hot; // piezas principales
const GD = colors.hotDark;
const C = colors.ink; // piezas oscuras (carteras, lentes)
const RG = colors.heart;

const Shine: React.FC<{x: number; y: number; s?: number; t?: number}> = ({x, y, s = 10, t = 0}) => {
  const k = 0.6 + 0.4 * Math.sin(t / 4 + x);
  return (
    <path
      transform={`translate(${x} ${y}) scale(${(s / 50) * k})`}
      d="M0 -50 C 6 -10 10 -6 50 0 C 10 6 6 10 0 50 C -6 10 -10 6 -50 0 C -10 -6 -6 -10 0 -50 Z"
      fill="#fff"
      opacity={0.9}
    />
  );
};

export const Aros: React.FC<P> = ({t = 0}) => {
  const sw = Math.sin(t / 6) * 4;
  return (
    <g>
      {[62, 138].map((cx, i) => (
        <g key={cx} transform={`rotate(${i ? -sw : sw} ${cx} 50)`}>
          <circle cx={cx} cy="46" r="6" fill={G} />
          <line x1={cx} y1="50" x2={cx} y2="66" stroke={G} strokeWidth="4" />
          <circle cx={cx} cy="106" r="42" fill="none" stroke={G} strokeWidth="9" />
          <circle cx={cx} cy="106" r="42" fill="none" stroke="#FFD0E8" strokeWidth="2.5" strokeDasharray="30 240" strokeDashoffset={-20} />
        </g>
      ))}
      <Shine x={40} y={96} t={t} />
    </g>
  );
};

export const Collar: React.FC<P> = ({t = 0}) => (
  <g>
    <path d="M30 30 Q100 150 170 30" fill="none" stroke={G} strokeWidth="4" strokeDasharray="1 7" strokeLinecap="round" />
    <path d="M30 30 Q100 150 170 30" fill="none" stroke={G} strokeWidth="1.5" />
    <line x1="100" y1="90" x2="100" y2="104" stroke={G} strokeWidth="3" />
    <path d="M100 104 C 82 104 76 128 100 150 C 124 128 118 104 100 104 Z" fill={RG} />
    <path d="M100 112 C 90 114 88 126 98 138" fill="none" stroke="#fff" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
    <Shine x={118} y={118} t={t} s={9} />
  </g>
);

export const Cartera: React.FC<P> = ({t = 0}) => (
  <g>
    <path d="M62 78 C 62 30 138 30 138 78" fill="none" stroke={C} strokeWidth="8" strokeLinecap="round" />
    <rect x="32" y="74" width="136" height="98" rx="16" fill={C} />
    <path d="M32 96 L168 96" stroke="#a3285c" strokeWidth="2" />
    <path d="M32 90 Q100 132 168 90 L168 90 L168 86 Q100 126 32 86 Z" fill="#741035" />
    <rect x="88" y="104" width="24" height="18" rx="4" fill={G} />
    <rect x="94" y="109" width="12" height="7" rx="2" fill={GD} />
    <Shine x={150} y={150} t={t} s={8} />
  </g>
);

export const Lentes: React.FC<P> = ({t = 0}) => (
  <g>
    <path d="M18 82 L36 72" stroke={C} strokeWidth="6" strokeLinecap="round" />
    <path d="M182 82 L164 72" stroke={C} strokeWidth="6" strokeLinecap="round" />
    <path d="M86 92 Q100 80 114 92" fill="none" stroke={G} strokeWidth="6" />
    {[58, 142].map((cx) => (
      <g key={cx}>
        <path d={`M${cx - 36} 78 L${cx + 36} 78 Q${cx + 38} 128 ${cx} 132 Q${cx - 38} 128 ${cx - 36} 78 Z`} fill={C} stroke={G} strokeWidth="5" />
        <path d={`M${cx - 22} 90 L${cx - 6} 90 L${cx - 22} 112 Z`} fill="#fff" opacity="0.18" />
      </g>
    ))}
    <Shine x={160} y={92} t={t} s={9} />
  </g>
);

export const Reloj: React.FC<P> = ({t = 0}) => {
  const a = (t * 6) % 360;
  return (
    <g>
      <rect x="78" y="14" width="44" height="54" rx="8" fill={RG} />
      <rect x="78" y="132" width="44" height="54" rx="8" fill={RG} />
      <circle cx="100" cy="100" r="46" fill={G} />
      <circle cx="100" cy="100" r="37" fill={colors.cream} />
      {[0, 90, 180, 270].map((d) => (
        <rect key={d} x="98.5" y="68" width="3" height="8" fill={C} transform={`rotate(${d} 100 100)`} />
      ))}
      <line x1="100" y1="100" x2="100" y2="78" stroke={C} strokeWidth="3.5" strokeLinecap="round" transform={`rotate(${a / 12 + 300} 100 100)`} />
      <line x1="100" y1="100" x2="100" y2="72" stroke={C} strokeWidth="2.2" strokeLinecap="round" transform={`rotate(${a} 100 100)`} />
      <circle cx="100" cy="100" r="3.5" fill={GD} />
      <rect x="146" y="95" width="8" height="10" rx="2" fill={GD} />
    </g>
  );
};

export const Anillos: React.FC<P> = ({t = 0}) => (
  <g>
    <ellipse cx="78" cy="122" rx="40" ry="40" fill="none" stroke={G} strokeWidth="10" />
    <ellipse cx="128" cy="118" rx="38" ry="38" fill="none" stroke={RG} strokeWidth="8" />
    <path d="M128 66 L140 80 L128 94 L116 80 Z" fill="#fff" stroke={GD} strokeWidth="3" />
    <path d="M116 80 L140 80" stroke={GD} strokeWidth="2" />
    <Shine x={142} y={66} t={t} s={11} />
  </g>
);

export const Pulsera: React.FC<P> = ({t = 0}) => (
  <g>
    <ellipse cx="100" cy="110" rx="70" ry="40" fill="none" stroke={G} strokeWidth="5" />
    {Array.from({length: 14}).map((_, i) => {
      const ang = (i / 14) * Math.PI * 2;
      return <circle key={i} cx={100 + 70 * Math.cos(ang)} cy={110 + 40 * Math.sin(ang)} r={i % 2 ? 7 : 9} fill={i % 2 ? RG : G} />;
    })}
    <Shine x={160} y={84} t={t} s={9} />
  </g>
);

export const Hebillas: React.FC<P> = ({t = 0}) => (
  <g>
    <rect x="34" y="60" width="132" height="22" rx="11" fill={G} />
    <rect x="44" y="66" width="100" height="10" rx="5" fill="#FFC2E0" />
    <rect x="34" y="112" width="132" height="22" rx="11" fill={RG} />
    <circle cx="60" cy="123" r="5" fill="#fff" />
    <circle cx="82" cy="123" r="5" fill="#fff" />
    <circle cx="104" cy="123" r="5" fill="#fff" />
    <rect x="34" y="150" width="132" height="18" rx="9" fill={C} />
    <circle cx="150" cy="159" r="6" fill={G} />
    <Shine x={160} y={58} t={t} s={9} />
  </g>
);

export const Perfume: React.FC<P> = ({t = 0}) => (
  <g>
    <rect x="86" y="30" width="28" height="22" rx="4" fill={G} />
    <rect x="92" y="52" width="16" height="12" fill={GD} />
    <rect x="50" y="62" width="100" height="112" rx="22" fill={colors.bubble} opacity="0.9" stroke={G} strokeWidth="4" />
    <rect x="72" y="100" width="56" height="34" rx="4" fill={colors.cream} />
    <text x="100" y="124" textAnchor="middle" fontFamily="Titan One" fontSize="20" fill={GD}>GB</text>
    <path d="M62 80 L62 150" stroke="#fff" strokeWidth="5" opacity="0.4" strokeLinecap="round" />
    <Shine x={136} y={78} t={t} s={9} />
  </g>
);

export type ProductDef = {name: string; bg: string; El: React.FC<P>};

export const PRODUCTS: ProductDef[] = [
  {name: 'Aros', bg: '#FFE3F1', El: Aros},
  {name: 'Carteras', bg: '#FDD5EA', El: Cartera},
  {name: 'Collares', bg: '#FFEAF5', El: Collar},
  {name: 'Lentes', bg: '#FBCFE6', El: Lentes},
  {name: 'Relojes', bg: '#FFE0F0', El: Reloj},
  {name: 'Anillos', bg: '#FDDCEE', El: Anillos},
  {name: 'Pulseras', bg: '#FFE8F4', El: Pulsera},
  {name: 'Hebillas', bg: '#FBD3EA', El: Hebillas},
  {name: 'Perfumes', bg: '#FFE4F2', El: Perfume},
];

export const ProductArt: React.FC<{index: number; size: number; t?: number; rounded?: number; style?: React.CSSProperties}> = ({
  index,
  size,
  t = 0,
  rounded = 0,
  style,
}) => {
  const p = PRODUCTS[index % PRODUCTS.length];
  return (
    <div
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 30%, #ffffff88 0%, transparent 60%), ${p.bg}`,
        borderRadius: rounded,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <svg width={size * 0.78} height={size * 0.78} viewBox="0 0 200 200" style={{overflow: 'visible'}}>
        <p.El t={t} />
      </svg>
    </div>
  );
};
