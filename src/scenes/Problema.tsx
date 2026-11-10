import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, TEXTS } from "../config";
import { Title } from "../components/Text";
import { clamp01, easeInOut, prog } from "../components/anim";

// geometría del corte esquemático del filtro de arena
const TX0 = 300;
const TX1 = 780;
const CX = (TX0 + TX1) / 2;
const TOP = 690;
const BOT = 1430;
const SAND_TOP = 960;
const GR = 19; // radio de grano
const GS = 48; // separación

const grains: { x: number; y: number }[] = [];
for (let row = 0; row * GS * 0.86 + SAND_TOP + GR < BOT - 24; row++) {
  const y = SAND_TOP + GR + row * GS * 0.86;
  const off = row % 2 === 0 ? 0 : GS / 2;
  for (let x = TX0 + 34 + off; x < TX1 - 30; x += GS) {
    grains.push({ x: x + (random(`gx${row}${x}`) - 0.5) * 6, y: y + (random(`gy${row}${x}`) - 0.5) * 5 });
  }
}

const tankPath = `M${TX0},${TOP + 120} C${TX0},${TOP + 20} ${TX0 + 80},${TOP - 30} ${CX},${TOP - 30} C${TX1 - 80},${TOP - 30} ${TX1},${TOP + 20} ${TX1},${TOP + 120} L${TX1},${BOT - 50} Q${TX1},${BOT} ${TX1 - 50},${BOT} L${TX0 + 50},${BOT} Q${TX0},${BOT} ${TX0},${BOT - 50} Z`;

const FINE = new Array(26).fill(0).map((_, i) => ({
  x: TX0 + 50 + random(`fx${i}`) * (TX1 - TX0 - 100),
  start: 0.5 + random(`fs${i}`) * 2.6,
  speed: 300 + random(`fv${i}`) * 90,
  ph: random(`fp${i}`) * Math.PI * 2,
  r: 3.5 + random(`fr${i}`) * 1.5,
}));
const BIG = new Array(9).fill(0).map((_, i) => ({
  x: TX0 + 60 + (i / 8) * (TX1 - TX0 - 120) + (random(`bx${i}`) - 0.5) * 20,
  start: 0.4 + random(`bs${i}`) * 1.6,
  r: 8 + random(`br${i}`) * 4,
}));

/** 2. Problema: el filtro retiene lo grande, pero lo fino pasa entre los granos. */
export const Problema: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const draw = prog(frame, 4, 40, easeInOut);
  const grainsIn = prog(frame, 18, 50);
  const line = { stroke: COLORS.crema, strokeOpacity: 0.7, fill: "none", strokeWidth: 3.5 };

  return (
    <AbsoluteFill>
      <Title y={410} size={74} inAt={6} maxWidth={860}>
        {TEXTS.problema}
      </Title>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {/* caño de entrada y salida */}
        <path d={`M${CX},${TOP - 110} L${CX},${TOP - 30}`} {...line} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        <path d={`M${CX},${BOT} L${CX},${BOT + 90}`} {...line} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        <path d={tankPath} {...line} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        {/* superficie del lecho filtrante */}
        <path
          d={`M${TX0 + 6},${SAND_TOP - 6} L${TX1 - 6},${SAND_TOP - 6}`}
          stroke={COLORS.crema}
          strokeOpacity={0.35 * grainsIn}
          strokeWidth={2}
          strokeDasharray="10 12"
        />
        {grains.map((g, i) => (
          <circle
            key={i}
            cx={g.x}
            cy={g.y}
            r={GR * (0.6 + 0.4 * grainsIn)}
            fill={COLORS.crema}
            fillOpacity={0.06 * grainsIn}
            stroke={COLORS.crema}
            strokeOpacity={0.45 * grainsIn}
            strokeWidth={2.5}
          />
        ))}
        {/* partículas grandes: quedan retenidas sobre la arena */}
        {BIG.map((p, i) => {
          const tt = Math.max(0, t - p.start);
          const y = Math.min(TOP + 20 + tt * 220, SAND_TOP - p.r - 4);
          const o = clamp01(tt * 3);
          return <circle key={`b${i}`} cx={p.x} cy={y} r={p.r} fill={COLORS.gris} opacity={0.8 * o} />;
        })}
        {/* partículas finas: atraviesan el lecho zigzagueando y salen por abajo */}
        {FINE.map((p, i) => {
          const tt = t - p.start;
          if (tt < 0) return null;
          const y = TOP + 10 + tt * p.speed;
          let x = p.x;
          if (y > SAND_TOP) {
            x += Math.sin(((y - SAND_TOP) / GS) * Math.PI + p.ph) * 14;
          }
          if (y > BOT - 90) {
            const k = clamp01((y - (BOT - 90)) / 90);
            x = x + (CX - x) * k;
          }
          const o = clamp01(tt * 4) * (1 - clamp01((y - (BOT + 60)) / 40));
          return (
            <circle key={`f${i}`} cx={x} cy={y} r={p.r} fill={COLORS.crema} opacity={0.85 * o} />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
