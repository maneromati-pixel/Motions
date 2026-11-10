import React from "react";
import { random } from "remotion";
import { COLORS } from "../config";

/**
 * Pileta con agua cristalina, vista en perspectiva desde arriba.
 * `p` (0–1) controla la entrada; `frame` anima las cáusticas y los destellos.
 * Se dibuja en coordenadas de pantalla (1080 de ancho), centrada en `cy`.
 */
export const Pool: React.FC<{ p: number; frame: number; cy: number }> = ({ p, frame, cy }) => {
  // trapecio en perspectiva: borde lejano más angosto
  const top = cy - 190;
  const bot = cy + 190;
  const outer = { tl: 290, tr: 790, bl: 150, br: 930 };
  const inset = 26;
  const water = {
    tl: outer.tl + inset * 0.8,
    tr: outer.tr - inset * 0.8,
    bl: outer.bl + inset * 1.2,
    br: outer.br - inset * 1.2,
    top: top + inset * 0.8,
    bot: bot - inset * 1.2,
  };
  // pared interna del lado lejano (se ve por la perspectiva)
  const wallH = 64;
  const waterPath = `M${water.tl},${water.top} L${water.tr},${water.top} L${water.br},${water.bot} L${water.bl},${water.bot} Z`;
  const outerPath = `M${outer.tl},${top} L${outer.tr},${top} L${outer.br},${bot} L${outer.bl},${bot} Z`;
  const lerpX = (a: number, b: number, t: number) => a + (b - a) * t;
  // cáusticas: el patrón se desplaza lentamente
  const drift = frame * 0.6;

  return (
    <svg
      width={1080}
      height={1920}
      style={{
        position: "absolute",
        inset: 0,
        opacity: p,
        transform: `translateY(${(1 - p) * 60}px)`,
      }}
    >
      <defs>
        <linearGradient id="pool-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A79B0" />
          <stop offset="35%" stopColor="#1C9FD6" />
          <stop offset="100%" stopColor="#6FD3F4" />
        </linearGradient>
        <linearGradient id="pool-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0B5E8A" />
          <stop offset="100%" stopColor="#1C9FD6" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="pool-coping" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor={COLORS.crema} />
          <stop offset="100%" stopColor="#D9CDBF" />
        </linearGradient>
        <linearGradient id="pool-sun" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0} />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity={0.32} />
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity={0.32} />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
        </linearGradient>
        <clipPath id="pool-clip">
          <path d={waterPath} />
        </clipPath>
        {/* red de luz cáustica del fondo de la pileta */}
        <filter id="caustics" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.022 0.04" numOctaves={2} seed={7} />
          {/* alfa = ruido; luego solo se ven las curvas de nivel finas (red de luz) */}
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1 0 0 0 0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0 0 0 0 0.9 0 0 0 0.9 0 0 0 0 0" />
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="0.8" />
        </filter>
        <filter id="pool-shadow" x="-20%" y="-20%" width="140%" height="160%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      {/* sombra del borde sobre el fondo */}
      <path d={outerPath} fill="#1E0204" opacity={0.5} filter="url(#pool-shadow)" transform="translate(10 26)" />
      {/* espesor del borde (cara frontal en sombra) */}
      <path d={`M${outer.bl},${bot} L${outer.br},${bot} L${outer.br - 6},${bot + 20} L${outer.bl + 6},${bot + 20} Z`} fill="#B5A493" />
      {/* borde (coronamiento) de piedra clara */}
      <path d={outerPath} fill="url(#pool-coping)" stroke="#FFFFFF" strokeOpacity={0.6} strokeWidth={2} strokeLinejoin="round" />
      {/* juntas de las baldosas del borde */}
      {[0.2, 0.4, 0.6, 0.8].map((k) => (
        <g key={k} stroke="#B9A999" strokeOpacity={0.5} strokeWidth={1.5}>
          <line x1={lerpX(outer.tl, outer.tr, k)} y1={top} x2={lerpX(water.tl, water.tr, k)} y2={water.top} />
          <line x1={lerpX(outer.bl, outer.br, k)} y1={bot} x2={lerpX(water.bl, water.br, k)} y2={water.bot} />
        </g>
      ))}

      {/* agua */}
      <path d={waterPath} fill="url(#pool-water)" />
      <g clipPath="url(#pool-clip)">
        {/* pared lejana en sombra */}
        <rect x={water.bl} y={water.top} width={water.br - water.bl} height={wallH} fill="url(#pool-wall)" opacity={0.95} />
        {/* línea de flotación con brillo sobre la pared lejana */}
        <line x1={water.bl} y1={water.top + 10} x2={water.br} y2={water.top + 10} stroke="#BFEFFF" strokeOpacity={0.5} strokeWidth={2} />
        {/* cáusticas en movimiento */}
        <g opacity={0.6} style={{ mixBlendMode: "screen" }}>
          <rect
            x={-200 + (drift % 200)}
            y={water.top - 200 + ((drift * 0.6) % 200)}
            width={1500}
            height={900}
            filter="url(#caustics)"
          />
        </g>
        {/* reflejo del sol sobre la superficie */}
        <rect
          x={water.bl}
          y={water.top}
          width={water.br - water.bl}
          height={water.bot - water.top}
          fill="url(#pool-sun)"
          opacity={0.7 + Math.sin(frame / 18) * 0.15}
          transform={`skewX(-28) translate(${300 + Math.sin(frame / 40) * 30} 0)`}
        />
        {/* destellos que titilan */}
        {new Array(14).fill(0).map((_, i) => {
          const sx = lerpX(water.bl + 40, water.br - 40, random(`sp-x-${i}`));
          const sy = lerpX(water.top + 60, water.bot - 20, random(`sp-y-${i}`));
          const tw = Math.max(0, Math.sin(frame / 7 + random(`sp-p-${i}`) * 6.28));
          return <circle key={i} cx={sx} cy={sy} r={2 + tw * 3} fill="#FFFFFF" opacity={tw * 0.85} />;
        })}
      </g>
      {/* borde interno con brillo */}
      <path d={waterPath} fill="none" stroke="#FFFFFF" strokeOpacity={0.55} strokeWidth={3} strokeLinejoin="round" />

    </svg>
  );
};
