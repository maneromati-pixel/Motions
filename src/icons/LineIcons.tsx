import React from "react";
import { COLORS } from "../config";
import { MaterialDefs } from "../components/Materials";

/**
 * Íconos de línea fina (crema semitransparente) con acento azul mínimo.
 * `draw` (0–1) dibuja el trazo; `anim` (0–1) dispara la acción propia del ícono; `frame` para loops.
 */
export type IconProps = { draw: number; anim: number; frame: number; size?: number };

const LINE = COLORS.crema;
const W = 7;

const Stroke: React.FC<{ d: string; draw: number; width?: number; opacity?: number }> = ({
  d,
  draw,
  width = W,
  opacity = 0.9,
}) => (
  <path
    d={d}
    fill="none"
    stroke={LINE}
    strokeOpacity={opacity}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    pathLength={1}
    strokeDasharray={1}
    strokeDashoffset={1 - draw}
  />
);

const Svg: React.FC<{ size?: number; children: React.ReactNode }> = ({ size = 380, children }) => (
  <svg width={size} height={size} viewBox="0 0 400 400" style={{ overflow: "visible" }}>
    <MaterialDefs />
    <g filter="url(#drop)">{children}</g>
  </svg>
);

const Glass: React.FC<{ d: string; draw: number }> = ({ d, draw }) => (
  <path d={d} fill="url(#glass)" opacity={draw} />
);

const TANK = "M120,140 C120,95 155,70 200,70 C245,70 280,95 280,140 L280,320 Q280,340 260,340 L140,340 Q120,340 120,320 Z";

const CircularArrow: React.FC<{ progress: number; rot?: number; r?: number; cx?: number; cy?: number; color?: string }> = ({
  progress,
  rot = 0,
  r = 175,
  cx = 200,
  cy = 205,
  color = LINE,
}) => {
  const a1 = (-90 + rot) * (Math.PI / 180);
  const sweep = Math.max(0.001, progress) * 330;
  const a2 = a1 + sweep * (Math.PI / 180);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  const x2 = cx + r * Math.cos(a2);
  const y2 = cy + r * Math.sin(a2);
  const large = sweep > 180 ? 1 : 0;
  // punta de flecha tangente
  const tx = -Math.sin(a2);
  const ty = Math.cos(a2);
  const nx = Math.cos(a2);
  const ny = Math.sin(a2);
  const h = 18;
  return (
    <g fill="none" stroke={color} strokeWidth={W - 1} strokeLinecap="round" strokeLinejoin="round" strokeOpacity={0.9}>
      <path d={`M${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2}`} />
      {progress > 0.05 && (
        <path
          d={`M${x2 - tx * h + nx * h * 0.8},${y2 - ty * h + ny * h * 0.8} L${x2},${y2} L${x2 - tx * h - nx * h * 0.8},${y2 - ty * h - ny * h * 0.8}`}
        />
      )}
    </g>
  );
};

/* ---------------- Beneficios ---------------- */

/** Filtro con capas de arena, cuarzo y antracita. */
export const IconFilterLayers: React.FC<IconProps> = ({ draw, anim, size }) => {
  const dots: React.ReactNode[] = [];
  const layers = [
    { y0: 170, y1: 225, r: 5, gap: 18 },
    { y0: 232, y1: 282, r: 8, gap: 26 },
    { y0: 290, y1: 332, r: 11, gap: 34 },
  ];
  layers.forEach((L, li) => {
    const show = Math.max(0, Math.min(1, anim * 3 - li));
    let row = 0;
    for (let y = L.y0 + L.r + 4; y < L.y1 - L.r; y += L.gap * 0.8, row++) {
      for (let x = 132 + L.r + (row % 2) * (L.gap / 2); x < 268 - L.r; x += L.gap) {
        dots.push(
          <circle
            key={`${li}-${x}-${y}`}
            cx={x}
            cy={y}
            r={L.r}
            fill={li === 0 ? "url(#sph-sand)" : li === 1 ? "url(#sph-cream)" : "url(#sph-grey)"}
            opacity={(li === 1 ? 0.75 : 0.95) * show}
          />,
        );
      }
    }
  });
  return (
    <Svg size={size}>
      <Glass d={TANK} draw={draw} />
      <Stroke d={TANK} draw={draw} />
      <Stroke d="M120,165 L280,165" draw={draw} width={4} opacity={0.6} />
      <Stroke d="M120,228 L280,228" draw={draw} width={3} opacity={0.45} />
      <Stroke d="M120,286 L280,286" draw={draw} width={3} opacity={0.45} />
      <Stroke d="M200,20 L200,70" draw={draw} />
      {dots}
      {/* flechas de potencia */}
      <g opacity={anim}>
        <Stroke d="M320,250 L320,150 M300,172 L320,150 L340,172" draw={anim} width={6} />
        <Stroke d="M80,250 L80,150 M60,172 L80,150 L100,172" draw={anim} width={6} />
      </g>
    </Svg>
  );
};

/** Reloj con ciclo completo y tilde: no agota el filtro antes de tiempo. */
export const IconNoAgota: React.FC<IconProps> = ({ draw, anim, frame, size }) => {
  const hand = frame * 3;
  return (
    <Svg size={size}>
      <circle cx={200} cy={200} r={140} fill="url(#glass)" opacity={draw} />
      <circle cx={200} cy={200} r={128} fill="none" stroke={LINE} strokeOpacity={0.18 * draw} strokeWidth={10} />
      <Stroke d="M200,60 A140,140 0 1 1 199.9,60" draw={draw} />
      {[0, 90, 180, 270].map((a) => {
        const rad = (a * Math.PI) / 180;
        return (
          <Stroke
            key={a}
            d={`M${200 + Math.cos(rad) * 118},${200 + Math.sin(rad) * 118} L${200 + Math.cos(rad) * 104},${200 + Math.sin(rad) * 104}`}
            draw={draw}
            width={5}
            opacity={0.6}
          />
        );
      })}
      <g opacity={draw}>
        <line x1={200} y1={200} x2={200 + Math.cos(((hand - 90) * Math.PI) / 180) * 80} y2={200 + Math.sin(((hand - 90) * Math.PI) / 180) * 80} stroke={LINE} strokeWidth={W} strokeLinecap="round" strokeOpacity={0.9} />
        <line x1={200} y1={200} x2={200 + Math.cos(((hand / 12 - 30) * Math.PI) / 180) * 55} y2={200 + Math.sin(((hand / 12 - 30) * Math.PI) / 180) * 55} stroke={LINE} strokeWidth={W} strokeLinecap="round" strokeOpacity={0.9} />
        <circle cx={200} cy={200} r={8} fill={LINE} />
      </g>
      {/* sello con tilde */}
      <g opacity={anim}>
        <circle cx={310} cy={310} r={52 * anim} fill="url(#sph-blue)" />
        <Stroke d="M287,312 L303,328 L335,294" draw={anim} width={8} opacity={1} />
      </g>
    </Svg>
  );
};

/* ---------------- Pasos de uso ---------------- */

/** ① Filtro limpio y en marcha. */
export const IconFiltroEnMarcha: React.FC<IconProps> = ({ draw, anim, frame, size }) => (
  <Svg size={size}>
    <g transform="translate(200 205) scale(0.72) translate(-200 -205)">
      <Glass d={TANK} draw={draw} />
      <Stroke d={TANK} draw={draw} />
      <Stroke d="M200,20 L200,70" draw={draw} />
      <Stroke d="M120,200 L280,200" draw={draw} width={4} opacity={0.5} />
      {/* brillo: limpio */}
      <g opacity={anim}>
        <Stroke d="M175,270 L175,300 M160,285 L190,285" draw={anim} width={5} />
        <Stroke d="M228,240 L228,260 M218,250 L238,250" draw={anim} width={4} opacity={0.7} />
      </g>
    </g>
    <g opacity={draw}>
      <CircularArrow progress={draw} rot={frame * 3 * anim} />
    </g>
  </Svg>
);

const Cup: React.FC<{ x: number; y: number; draw: number; lidOpen: number }> = ({ x, y, draw, lidOpen }) => (
  <g transform={`translate(${x} ${y})`}>
    {/* gel azul (único acento frío) */}
    <path d="M-62,-36 L62,-36 L50,30 Q48,40 38,40 L-38,40 Q-48,40 -50,30 Z" fill={COLORS.azulGel} opacity={0.85 * draw} />
    <Stroke d="M-80,-40 L80,-40 M-68,-40 L-52,32 Q-50,44 -38,44 L38,44 Q50,44 52,32 L68,-40" draw={draw} />
    {/* tapa que se despega desde la izquierda */}
    <g transform={`rotate(${-lidOpen * 62} -84 -46) translate(${-lidOpen * 6} ${-lidOpen * 10})`}>
      <Stroke d="M-84,-48 L84,-48 L96,-60" draw={draw} width={W} />
    </g>
  </g>
);

/** ② Destapá la cápsula: la tapa se despega. */
export const IconDestapar: React.FC<IconProps> = ({ draw, anim, size }) => (
  <Svg size={size}>
    <Cup x={200} y={240} draw={draw} lidOpen={anim} />
  </Svg>
);

/** ③ Al canasto del skimmer: la cápsula cae en la canasta. */
export const IconSkimmer: React.FC<IconProps> = ({ draw, anim, size }) => {
  const cupY = 70 + anim * 225;
  return (
    <Svg size={size}>
      {/* cápsula abierta cayendo (sin tapa), detrás de la rejilla */}
      <g opacity={draw} transform={`translate(200 ${cupY}) scale(0.7) rotate(${(1 - anim) * -14})`}>
        <path d="M-62,-36 L62,-36 L50,30 Q48,40 38,40 L-38,40 Q-48,40 -50,30 Z" fill={COLORS.azulGel} opacity={0.85} />
        <Stroke d="M-80,-40 L80,-40 M-68,-40 L-52,32 Q-50,44 -38,44 L38,44 Q50,44 52,32 L68,-40" draw={1} />
      </g>
      {/* canasta: aro + cuerpo con rejilla */}
      <Stroke d="M70,215 L330,215" draw={draw} />
      <Stroke d="M95,215 L120,355 Q122,365 132,365 L268,365 Q278,365 280,355 L305,215" draw={draw} />
      {[150, 200, 250].map((x) => (
        <Stroke key={x} d={`M${x},230 L${x + (x - 200) * 0.1},355`} draw={draw} width={3} opacity={0.4} />
      ))}
      <Stroke d="M106,275 L294,275 M115,320 L285,320" draw={draw} width={3} opacity={0.4} />
    </Svg>
  );
};

/** ④ Filtrado completo: ciclo de 360° y tilde. */
export const IconFiltradoCompleto: React.FC<IconProps> = ({ draw, anim, size }) => (
  <Svg size={size}>
    <g transform="translate(200 205) scale(0.72) translate(-200 -205)">
      <Glass d={TANK} draw={draw} />
      <Stroke d={TANK} draw={draw} />
      <Stroke d="M200,20 L200,70" draw={draw} />
    </g>
    <CircularArrow progress={anim} />
    <g opacity={Math.max(0, anim * 3 - 2)}>
      <Stroke d="M160,210 L190,240 L245,180" draw={Math.max(0, anim * 3 - 2)} width={9} opacity={1} />
    </g>
  </Svg>
);
