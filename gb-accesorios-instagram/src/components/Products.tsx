import React from 'react';
import {colors} from '../theme';

// Ilustraciones SEMIRREALISTAS de productos: degradés metálicos, vidrio, perlas, cuero acolchado,
// brillos especulares y sombras de apoyo. Reemplazables por fotos reales (ver README).
// Todas usan viewBox 0 0 200 200 y comparten las definiciones de <ProductDefs/>.

type P = {t?: number}; // t: frame para micro-animaciones (brillos, balanceo)

const HEART = 'M12 21.5s-8.2-5-10.2-10C.3 7.6 2.7 3.5 6.8 3.5c2.2 0 3.8 1.2 5.2 3.1 1.4-1.9 3-3.1 5.2-3.1 4.1 0 6.5 4.1 5 8-2 5-10.2 10-10.2 10z';
const heartAt = (x: number, y: number, s: number) => `translate(${x - 12 * s} ${y - 12 * s}) scale(${s})`;

// Gradientes compartidos (definiciones idénticas en cada svg → ids estables)
export const ProductDefs: React.FC = () => (
  <defs>
    <linearGradient id="pGold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#FFF6D2" />
      <stop offset="0.22" stopColor="#F2CF6B" />
      <stop offset="0.48" stopColor="#B8862A" />
      <stop offset="0.7" stopColor="#F7DA85" />
      <stop offset="1" stopColor="#8A621E" />
    </linearGradient>
    <radialGradient id="pGoldR" cx="0.5" cy="0.5" r="0.6" fx="0.35" fy="0.3">
      <stop offset="0" stopColor="#FFF8DC" />
      <stop offset="0.45" stopColor="#E9C25C" />
      <stop offset="1" stopColor="#8A621E" />
    </radialGradient>
    <linearGradient id="pRose" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#FFE1D6" />
      <stop offset="0.3" stopColor="#E9A48E" />
      <stop offset="0.55" stopColor="#B86A57" />
      <stop offset="0.75" stopColor="#F1B9A6" />
      <stop offset="1" stopColor="#8E4A3C" />
    </linearGradient>
    <radialGradient id="pGem" cx="0.5" cy="0.5" r="0.6" fx="0.35" fy="0.3">
      <stop offset="0" stopColor="#FFE6F3" />
      <stop offset="0.35" stopColor="#FF7FB9" />
      <stop offset="1" stopColor="#B0024E" />
    </radialGradient>
    <linearGradient id="pDiamond" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#FFFFFF" />
      <stop offset="0.45" stopColor="#E4EEFF" />
      <stop offset="0.7" stopColor="#FFFFFF" />
      <stop offset="1" stopColor="#A9BCDD" />
    </linearGradient>
    <radialGradient id="pPearl" cx="0.5" cy="0.5" r="0.6" fx="0.35" fy="0.3">
      <stop offset="0" stopColor="#FFFFFF" />
      <stop offset="0.4" stopColor="#FCF1F5" />
      <stop offset="0.8" stopColor="#E6CCD8" />
      <stop offset="1" stopColor="#B999AA" />
    </radialGradient>
    <linearGradient id="pLeather" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stopColor="#FFB8D9" />
      <stop offset="0.55" stopColor="#F06AA8" />
      <stop offset="1" stopColor="#B82A6C" />
    </linearGradient>
    <linearGradient id="pFrame" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FF9ACB" />
      <stop offset="0.5" stopColor="#F0388A" />
      <stop offset="1" stopColor="#B0024E" />
    </linearGradient>
    <linearGradient id="pLens" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#2E0A1D" />
      <stop offset="0.55" stopColor="#6E1A45" />
      <stop offset="1" stopColor="#F07DB4" />
    </linearGradient>
    <linearGradient id="pGlass" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#FFE3F0" stopOpacity="0.95" />
      <stop offset="0.3" stopColor="#FFFFFF" stopOpacity="0.55" />
      <stop offset="0.7" stopColor="#FFD0E6" stopOpacity="0.5" />
      <stop offset="1" stopColor="#F59BC6" stopOpacity="0.9" />
    </linearGradient>
    <linearGradient id="pLiquid" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#FFB3D6" />
      <stop offset="0.6" stopColor="#F2589A" />
      <stop offset="1" stopColor="#C2185B" />
    </linearGradient>
    <linearGradient id="pSatin" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#FFD3E8" />
      <stop offset="0.35" stopColor="#F98BBF" />
      <stop offset="0.6" stopColor="#FFC0DE" />
      <stop offset="1" stopColor="#D2477F" />
    </linearGradient>
    <linearGradient id="pPlastic" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#E8508F" />
      <stop offset="0.25" stopColor="#FF9CC8" />
      <stop offset="0.6" stopColor="#F46AA6" />
      <stop offset="1" stopColor="#C2185B" />
    </linearGradient>
    <linearGradient id="pWhite" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#E9DCE3" />
      <stop offset="0.35" stopColor="#FFFFFF" />
      <stop offset="1" stopColor="#CDB8C4" />
    </linearGradient>
    <linearGradient id="pSheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
      <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.75" />
      <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
    </linearGradient>
    <radialGradient id="pShadow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#7A0035" stopOpacity="0.35" />
      <stop offset="1" stopColor="#7A0035" stopOpacity="0" />
    </radialGradient>
  </defs>
);

const Shadow: React.FC<{y?: number; rx?: number}> = ({y = 182, rx = 70}) => <ellipse cx="100" cy={y} rx={rx} ry="9" fill="url(#pShadow)" />;

const Twinkle: React.FC<{x: number; y: number; s?: number; t?: number}> = ({x, y, s = 9, t = 0}) => {
  const k = 0.55 + 0.45 * Math.sin(t / 4 + x);
  return (
    <path
      transform={`translate(${x} ${y}) scale(${(s / 50) * k}) rotate(${t * 2})`}
      d="M0 -50 C 6 -10 10 -6 50 0 C 10 6 6 10 0 50 C -6 10 -10 6 -50 0 C -10 -6 -6 -10 0 -50 Z"
      fill="#fff"
    />
  );
};

// ---------- 1. AROS: argollas de oro con dije de corazón ----------
export const Aros: React.FC<P> = ({t = 0}) => {
  const sw = Math.sin(t / 6) * 5;
  return (
    <g>
      <Shadow rx={74} />
      {[62, 138].map((cx, i) => (
        <g key={cx} transform={`rotate(${i ? -sw : sw} ${cx} 36)`}>
          <circle cx={cx} cy="36" r="7" fill="url(#pGoldR)" />
          <path d={`M${cx} 42 L${cx} 52`} stroke="url(#pGold)" strokeWidth="3" />
          <circle cx={cx} cy="94" r="40" fill="none" stroke="#7A5418" strokeWidth="14" opacity="0.25" transform="translate(2 3)" />
          <circle cx={cx} cy="94" r="40" fill="none" stroke="url(#pGold)" strokeWidth="13" />
          <circle cx={cx} cy="94" r="34" fill="none" stroke="#7A5418" strokeWidth="1.5" opacity="0.45" />
          <path d={`M${cx - 38} 82 A 40 40 0 0 1 ${cx - 14} 57`} fill="none" stroke="#FFFBEA" strokeWidth="3.5" strokeLinecap="round" opacity="0.9" />
          <path d={`M${cx + 30} 120 A 40 40 0 0 1 ${cx + 12} 131`} fill="none" stroke="#FFFBEA" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          {/* dije */}
          <path d={`M${cx} 134 L${cx} 142`} stroke="url(#pGold)" strokeWidth="2.5" />
          <path d={HEART} transform={heartAt(cx, 154, 1.15)} fill="url(#pGem)" stroke="#E9C25C" strokeWidth="1" />
          <ellipse cx={cx - 5} cy="149" rx="3" ry="2" fill="#fff" opacity="0.85" />
        </g>
      ))}
      <Twinkle x={30} y={74} t={t} s={11} />
    </g>
  );
};

// ---------- 2. CARTERA: rosa acolchada con cadena dorada ----------
export const Cartera: React.FC<P> = ({t = 0}) => {
  const links = Array.from({length: 22}).map((_, i) => {
    const a = Math.PI - (i / 21) * Math.PI;
    const x = 100 + 46 * Math.cos(a);
    const y = 84 - 64 * Math.sin(a);
    const ang = (Math.atan2(-64 * Math.cos(a), -46 * Math.sin(a)) * 180) / Math.PI;
    return <ellipse key={i} cx={x} cy={y} rx="5" ry="3.2" fill="none" stroke="url(#pGold)" strokeWidth="2.4" transform={`rotate(${ang + (i % 2 ? 90 : 0)} ${x} ${y})`} />;
  });
  const body = 'M42 84 Q42 78 48 78 L152 78 Q158 78 158 84 L166 164 Q166 174 156 174 L44 174 Q34 174 34 164 Z';
  return (
    <g>
      <Shadow rx={76} y={184} />
      {links}
      <clipPath id="pBagClip">
        <path d={body} />
      </clipPath>
      <path d={body} fill="url(#pLeather)" />
      <g clipPath="url(#pBagClip)">
        {Array.from({length: 12}).map((_, i) => (
          <g key={i}>
            <line x1={-40 + i * 22} y1="70" x2={60 + i * 22} y2="190" stroke="#9E1E5C" strokeWidth="1.6" opacity="0.35" />
            <line x1={-38 + i * 22} y1="70" x2={62 + i * 22} y2="190" stroke="#fff" strokeWidth="1" opacity="0.25" />
            <line x1={240 - i * 22} y1="70" x2={140 - i * 22} y2="190" stroke="#9E1E5C" strokeWidth="1.6" opacity="0.35" />
            <line x1={242 - i * 22} y1="70" x2={142 - i * 22} y2="190" stroke="#fff" strokeWidth="1" opacity="0.25" />
          </g>
        ))}
        <rect x="34" y="78" width="40" height="100" fill="url(#pSheen)" opacity="0.5" />
      </g>
      {/* solapa */}
      <path d="M40 84 Q40 80 46 80 L154 80 Q160 80 160 84 L162 116 Q100 140 38 116 Z" fill="url(#pLeather)" />
      <path d="M38 116 Q100 140 162 116" fill="none" stroke="#9E1E5C" strokeWidth="2" opacity="0.5" />
      <path d="M46 84 L154 84" stroke="#fff" strokeWidth="1.5" opacity="0.5" />
      {/* broche */}
      <rect x="86" y="112" width="28" height="20" rx="5" fill="url(#pGold)" />
      <path d={HEART} transform={heartAt(100, 122, 0.55)} fill="#B8862A" />
      <rect x="88" y="113" width="24" height="3" rx="1.5" fill="#FFF6D2" opacity="0.8" />
      <Twinkle x={150} y={150} t={t} s={9} />
    </g>
  );
};

// ---------- 3. COLLAR: cadena de bolitas doradas con corazón facetado ----------
export const Collar: React.FC<P> = ({t = 0}) => {
  const beads = Array.from({length: 46}).map((_, i) => {
    const u = i / 45;
    const x = (1 - u) * (1 - u) * 26 + 2 * (1 - u) * u * 100 + u * u * 174;
    const y = (1 - u) * (1 - u) * 26 + 2 * (1 - u) * u * 150 + u * u * 26;
    return <circle key={i} cx={x} cy={y} r="2.7" fill="url(#pGoldR)" />;
  });
  return (
    <g>
      <Shadow rx={40} y={180} />
      <path d="M26 26 Q100 150 174 26" fill="none" stroke="#B8862A" strokeWidth="1.2" />
      {beads}
      <circle cx="100" cy="94" r="5" fill="none" stroke="url(#pGold)" strokeWidth="2.8" />
      <g>
        <path d={HEART} transform={heartAt(100, 128, 2.7)} fill="url(#pGem)" stroke="url(#pGold)" strokeWidth="0.9" />
        {/* facetas */}
        <g stroke="#fff" strokeWidth="1" opacity="0.35">
          <line x1="100" y1="126" x2="74" y2="110" />
          <line x1="100" y1="126" x2="126" y2="110" />
          <line x1="100" y1="126" x2="100" y2="104" />
          <line x1="100" y1="126" x2="84" y2="146" />
          <line x1="100" y1="126" x2="116" y2="146" />
        </g>
        <ellipse cx="84" cy="114" rx="7" ry="4.5" fill="#fff" opacity="0.8" transform="rotate(-30 84 114)" />
      </g>
      <Twinkle x={122} y={112} t={t} s={12} />
    </g>
  );
};

// ---------- 4. LENTES: cat-eye rosa brillante con cristales degradé ----------
export const Lentes: React.FC<P> = ({t = 0}) => {
  const lens = 'M22 84 Q30 74 54 77 L88 82 Q93 85 91 97 Q87 124 62 126 Q34 126 27 105 Q22 95 22 84 Z';
  return (
    <g>
      <Shadow rx={80} y={160} />
      <path d="M24 84 L6 72" stroke="url(#pFrame)" strokeWidth="6" strokeLinecap="round" />
      <path d="M176 84 L194 72" stroke="url(#pFrame)" strokeWidth="6" strokeLinecap="round" />
      <path d="M88 88 Q100 78 112 88" fill="none" stroke="url(#pFrame)" strokeWidth="6" />
      {[false, true].map((mirror) => (
        <g key={String(mirror)} transform={mirror ? 'translate(200 0) scale(-1 1)' : undefined}>
          <clipPath id={`pLensClip${mirror ? 'R' : 'L'}`}>
            <path d={lens} />
          </clipPath>
          <path d={lens} fill="url(#pLens)" />
          <g clipPath={`url(#pLensClip${mirror ? 'R' : 'L'})`}>
            <polygon points="30,70 52,70 22,130 0,130" fill="#fff" opacity="0.22" />
            <polygon points="58,70 66,70 36,130 28,130" fill="#fff" opacity="0.15" />
          </g>
          <path d={lens} fill="none" stroke="url(#pFrame)" strokeWidth="7" strokeLinejoin="round" />
          <path d="M28 80 Q36 74 54 77 L86 82" fill="none" stroke="#fff" strokeWidth="1.8" opacity="0.7" strokeLinecap="round" />
          <circle cx="24" cy="82" r="3.2" fill="url(#pGoldR)" />
        </g>
      ))}
      <Twinkle x={154} y={92} t={t} s={10} />
    </g>
  );
};

// ---------- 5. PERFUME: frasco de vidrio con líquido rosa y tapa de cristal ----------
export const Perfume: React.FC<P> = ({t = 0}) => (
  <g>
    <Shadow rx={56} y={180} />
    {/* tapa */}
    <rect x="72" y="20" width="56" height="40" rx="10" fill="url(#pGem)" />
    <rect x="78" y="24" width="10" height="32" rx="5" fill="#fff" opacity="0.55" />
    <rect x="84" y="58" width="32" height="14" rx="2" fill="url(#pGold)" />
    <rect x="84" y="60" width="32" height="2.5" fill="#FFF6D2" opacity="0.8" />
    {/* frasco */}
    <rect x="44" y="70" width="112" height="106" rx="20" fill="url(#pGlass)" stroke="#fff" strokeWidth="2.5" />
    <rect x="52" y="98" width="96" height="70" rx="14" fill="url(#pLiquid)" />
    <ellipse cx="100" cy="99" rx="46" ry="4" fill="#FFC9E2" />
    <rect x="56" y="78" width="88" height="92" rx="14" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.5" />
    {/* emblema */}
    <path d={HEART} transform={heartAt(100, 132, 1.5)} fill="url(#pGold)" />
    {/* reflejos del vidrio */}
    <rect x="52" y="78" width="9" height="88" rx="4.5" fill="#fff" opacity="0.7" />
    <rect x="66" y="80" width="4" height="40" rx="2" fill="#fff" opacity="0.45" />
    <rect x="140" y="88" width="5" height="64" rx="2.5" fill="#fff" opacity="0.35" />
    <Twinkle x={142} y={80} t={t} s={11} />
  </g>
);

// ---------- 6. ANILLOS: solitario de oro y alianza rose gold ----------
export const Anillos: React.FC<P> = ({t = 0}) => (
  <g>
    <Shadow rx={74} y={176} />
    <ellipse cx="124" cy="126" rx="38" ry="32" fill="none" stroke="#7A3A2C" strokeWidth="11" opacity="0.2" transform="translate(2 3)" />
    <ellipse cx="124" cy="126" rx="38" ry="32" fill="none" stroke="url(#pRose)" strokeWidth="10" />
    <path d="M90 116 A 38 32 0 0 1 112 96" fill="none" stroke="#FFF0EA" strokeWidth="2.5" opacity="0.8" strokeLinecap="round" />
    <ellipse cx="78" cy="122" rx="38" ry="36" fill="none" stroke="#7A5418" strokeWidth="12" opacity="0.2" transform="translate(2 3)" />
    <ellipse cx="78" cy="122" rx="38" ry="36" fill="none" stroke="url(#pGold)" strokeWidth="11" />
    <path d="M42 112 A 38 36 0 0 1 60 92" fill="none" stroke="#FFFBEA" strokeWidth="3" opacity="0.9" strokeLinecap="round" />
    {/* engarce */}
    <path d="M68 90 L72 76 L84 76 L88 90 Z" fill="url(#pGold)" />
    {/* diamante */}
    <path d="M58 60 L98 60 L108 72 L78 98 L48 72 Z" fill="url(#pDiamond)" stroke="#9FB2D6" strokeWidth="1" />
    <g stroke="#9FB2D6" strokeWidth="1" fill="none" opacity="0.9">
      <path d="M48 72 L108 72" />
      <path d="M58 60 L66 72 L78 98 L90 72 L98 60" />
      <path d="M66 72 L78 60 L90 72" />
    </g>
    <polygon points="60,62 70,62 64,70" fill="#fff" />
    <Twinkle x={102} y={56} t={t} s={14} />
  </g>
);

// ---------- 7. PULSERA: perlas en perspectiva con cierre dorado ----------
export const Pulsera: React.FC<P> = ({t = 0}) => {
  const n = 20;
  const pearls = Array.from({length: n}).map((_, i) => {
    const a = (i / n) * Math.PI * 2;
    const depth = (Math.sin(a) + 1) / 2; // 0 atrás, 1 adelante
    return {x: 100 + 70 * Math.cos(a), y: 108 + 34 * Math.sin(a), r: 7.5 + 4 * depth, depth, i};
  });
  pearls.sort((a, b) => a.y - b.y);
  return (
    <g>
      <Shadow rx={80} y={162} />
      <ellipse cx="100" cy="108" rx="70" ry="34" fill="none" stroke="#C9A9B8" strokeWidth="1.2" />
      {pearls.map((p) =>
        p.i === 5 ? (
          <g key={p.i}>
            <rect x={p.x - 9} y={p.y - 7} width="18" height="14" rx="4" fill="url(#pGold)" />
            <rect x={p.x - 7} y={p.y - 6} width="14" height="2.5" rx="1" fill="#FFF6D2" opacity="0.8" />
          </g>
        ) : (
          <g key={p.i} opacity={0.75 + 0.25 * p.depth}>
            <circle cx={p.x} cy={p.y} r={p.r} fill="url(#pPearl)" />
            <circle cx={p.x - p.r * 0.35} cy={p.y - p.r * 0.4} r={p.r * 0.22} fill="#fff" />
          </g>
        ),
      )}
      <Twinkle x={160} y={96} t={t} s={10} />
    </g>
  );
};

// ---------- 8. HEBILLAS: moño de satén rosa + hebilla de perlas ----------
export const Hebillas: React.FC<P> = ({t = 0}) => (
  <g>
    <Shadow rx={70} y={182} />
    {/* hebilla de perlas */}
    <rect x="40" y="150" width="120" height="12" rx="6" fill="url(#pGold)" />
    {Array.from({length: 7}).map((_, i) => (
      <g key={i}>
        <circle cx={52 + i * 16} cy="152" r="7" fill="url(#pPearl)" />
        <circle cx={50 + i * 16} cy="149.5" r="1.8" fill="#fff" />
      </g>
    ))}
    {/* moño */}
    <g transform="translate(0 -12)">
      <path d="M96 102 L72 156 L86 148 L94 162 L106 108 Z" fill="url(#pSatin)" />
      <path d="M104 102 L128 156 L114 148 L106 162 L94 108 Z" fill="url(#pSatin)" />
      <path d="M100 92 C 70 54 24 58 28 92 C 32 124 74 118 100 102 Z" fill="url(#pSatin)" />
      <path d="M100 92 C 130 54 176 58 172 92 C 168 124 126 118 100 102 Z" fill="url(#pSatin)" />
      {/* pliegues */}
      <path d="M98 96 C 76 78 50 76 40 90" fill="none" stroke="#C2185B" strokeWidth="2" opacity="0.3" />
      <path d="M102 96 C 124 78 150 76 160 90" fill="none" stroke="#C2185B" strokeWidth="2" opacity="0.3" />
      <path d="M44 76 C 56 66 74 68 88 80" fill="none" stroke="#fff" strokeWidth="3" opacity="0.65" strokeLinecap="round" />
      <path d="M156 76 C 144 66 126 68 112 80" fill="none" stroke="#fff" strokeWidth="2" opacity="0.45" strokeLinecap="round" />
      <rect x="88" y="84" width="24" height="26" rx="9" fill="#E05C98" />
      <rect x="92" y="87" width="6" height="18" rx="3" fill="#fff" opacity="0.45" />
    </g>
    <Twinkle x={160} y={60} t={t} s={10} />
  </g>
);

// ---------- 9. BODY SPLASH: botella con spray ----------
export const BodySplash: React.FC<P> = ({t = 0}) => (
  <g>
    <Shadow rx={46} y={184} />
    {/* spray */}
    <rect x="78" y="20" width="44" height="34" rx="8" fill="url(#pWhite)" />
    <rect x="118" y="30" width="14" height="7" rx="3" fill="url(#pWhite)" />
    <rect x="82" y="52" width="36" height="12" rx="3" fill="url(#pGold)" />
    {/* botella */}
    <path d="M70 76 Q70 64 84 64 L116 64 Q130 64 130 76 L134 168 Q134 180 120 180 L80 180 Q66 180 66 168 Z" fill="url(#pPlastic)" />
    {/* etiqueta */}
    <rect x="74" y="104" width="52" height="52" rx="10" fill="#FFF0F7" />
    <path d={HEART} transform={heartAt(100, 124, 1.1)} fill="url(#pGem)" />
    <rect x="84" y="142" width="32" height="3" rx="1.5" fill="#F2589A" opacity="0.7" />
    <rect x="89" y="148" width="22" height="3" rx="1.5" fill="#F2589A" opacity="0.5" />
    <rect x="74" y="70" width="7" height="104" rx="3.5" fill="#fff" opacity="0.5" />
    <Twinkle x={124} y={84} t={t} s={10} />
  </g>
);

export type ProductDef = {name: string; bg: string; El: React.FC<P>};

export const PRODUCTS: ProductDef[] = [
  {name: 'Aros', bg: '#FFE3F1', El: Aros},
  {name: 'Carteras', bg: '#FDD5EA', El: Cartera},
  {name: 'Collares', bg: '#FFEAF5', El: Collar},
  {name: 'Lentes', bg: '#FBCFE6', El: Lentes},
  {name: 'Perfumes', bg: '#FFE0F0', El: Perfume},
  {name: 'Anillos', bg: '#FDDCEE', El: Anillos},
  {name: 'Pulseras', bg: '#FFE8F4', El: Pulsera},
  {name: 'Hebillas', bg: '#FBD3EA', El: Hebillas},
  {name: 'Body splash', bg: '#FFE4F2', El: BodySplash},
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
        // fondo de estudio: luz arriba, piso más oscuro
        background: `radial-gradient(ellipse at 50% 30%, #FFFFFF 0%, #FFFFFF00 65%), linear-gradient(180deg, ${p.bg} 0%, ${p.bg} 70%, ${colors.blush} 100%)`,
        borderRadius: rounded,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <svg width={size * 0.94} height={size * 0.94} viewBox="0 0 200 200" style={{overflow: 'visible'}}>
        <ProductDefs />
        <p.El t={t} />
      </svg>
    </div>
  );
};
