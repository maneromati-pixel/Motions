import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, TEXTS } from "../config";
import { Title } from "../components/Text";
import { clamp01, easeInOut, prog } from "../components/anim";
import { MaterialDefs, Sphere } from "../components/Materials";

// geometría del corte esquemático del filtro de arena
const TX0 = 300;
const TX1 = 780;
const CX = (TX0 + TX1) / 2;
const TOP = 690;
const BOT = 1430;
const SAND_TOP = 960;
const GR = 19; // radio de grano
const GS = 48; // separación

const grains: { x: number; y: number; r: number }[] = [];
for (let row = 0; row * GS * 0.86 + SAND_TOP + GR < BOT - 24; row++) {
  const y = SAND_TOP + GR + row * GS * 0.86;
  const off = row % 2 === 0 ? 0 : GS / 2;
  for (let x = TX0 + 34 + off; x < TX1 - 30; x += GS) {
    grains.push({
      x: x + (random(`gx${row}${x}`) - 0.5) * 6,
      y: y + (random(`gy${row}${x}`) - 0.5) * 5,
      r: GR * (0.88 + random(`gr${row}${x}`) * 0.2),
    });
  }
}

const tankPath = `M${TX0},${TOP + 120} C${TX0},${TOP + 20} ${TX0 + 80},${TOP - 30} ${CX},${TOP - 30} C${TX1 - 80},${TOP - 30} ${TX1},${TOP + 20} ${TX1},${TOP + 120} L${TX1},${BOT - 50} Q${TX1},${BOT} ${TX1 - 50},${BOT} L${TX0 + 50},${BOT} Q${TX0},${BOT} ${TX0},${BOT - 50} Z`;

// partículas finas: se reparten a lo largo de toda la escena
const FINE = new Array(44).fill(0).map((_, i) => ({
  x: TX0 + 50 + random(`fx${i}`) * (TX1 - TX0 - 100),
  start: 0.6 + random(`fs${i}`) * 5.0,
  speed: 230 + random(`fv${i}`) * 70,
  ph: random(`fp${i}`) * Math.PI * 2,
  r: 4 + random(`fr${i}`) * 1.6,
}));
const BIG = new Array(10).fill(0).map((_, i) => ({
  x: TX0 + 55 + (i / 9) * (TX1 - TX0 - 110) + (random(`bx${i}`) - 0.5) * 20,
  start: 0.5 + random(`bs${i}`) * 2.6,
  r: 9 + random(`br${i}`) * 4,
}));

/** 2. Problema: el filtro retiene lo grande, pero lo fino pasa entre los granos. */
export const Problema: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const draw = prog(frame, 4, 44, easeInOut);
  const grainsIn = prog(frame, 20, 56);
  const line = { stroke: COLORS.crema, strokeOpacity: 0.75, fill: "none", strokeWidth: 3.5 };

  return (
    <AbsoluteFill>
      <Title y={410} size={74} inAt={6} maxWidth={860}>
        {TEXTS.problema}
      </Title>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <MaterialDefs />
        <clipPath id="tank-clip">
          <path d={tankPath} />
        </clipPath>
        {/* sombra proyectada del tanque */}
        <ellipse cx={CX + 20} cy={BOT + 18} rx={(TX1 - TX0) * 0.55} ry={26} fill="#1E0204" opacity={0.35 * draw} filter="url(#soft-blur)" />
        {/* cuerpo de vidrio con agua */}
        <path d={tankPath} fill="url(#water)" opacity={draw} />
        <path d={tankPath} fill="url(#glass)" opacity={draw} />
        {/* caños con volumen */}
        <rect x={CX - 9} y={TOP - 110} width={18} height={80} rx={4} fill="url(#glass)" opacity={draw} />
        <rect x={CX - 9} y={BOT} width={18} height={90} rx={4} fill="url(#glass)" opacity={draw} />
        <path d={`M${CX - 9},${TOP - 110} L${CX - 9},${TOP - 30} M${CX + 9},${TOP - 110} L${CX + 9},${TOP - 30}`} {...line} strokeWidth={2.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        <path d={`M${CX - 9},${BOT} L${CX - 9},${BOT + 90} M${CX + 9},${BOT} L${CX + 9},${BOT + 90}`} {...line} strokeWidth={2.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />

        <g clipPath="url(#tank-clip)">
          {/* lecho de arena con volumen (granos esféricos con sombra entre ellos) */}
          <rect x={TX0} y={SAND_TOP - 4} width={TX1 - TX0} height={BOT - SAND_TOP} fill="#2A0507" opacity={0.12 * grainsIn} />
          {grains.map((g, i) => (
            <g key={i} opacity={grainsIn}>
              <circle cx={g.x + 3} cy={g.y + 4} r={g.r * (0.6 + 0.4 * grainsIn)} fill="#1E0204" opacity={0.22} />
              <circle cx={g.x} cy={g.y} r={g.r * (0.6 + 0.4 * grainsIn)} fill="url(#sph-sand)" />
              <circle cx={g.x} cy={g.y} r={g.r * (0.6 + 0.4 * grainsIn)} fill="none" stroke={COLORS.crema} strokeOpacity={0.28} strokeWidth={1.5} />
            </g>
          ))}
          {/* partículas grandes: quedan retenidas sobre la arena */}
          {BIG.map((p, i) => {
            const tt = Math.max(0, t - p.start);
            const y = Math.min(TOP + 20 + tt * 180, SAND_TOP - p.r - 2);
            return <Sphere key={`b${i}`} cx={p.x} cy={y} r={p.r} kind="grey" opacity={0.95 * clamp01(tt * 3)} />;
          })}
          {/* partículas finas: atraviesan el lecho zigzagueando */}
          {FINE.map((p, i) => {
            const tt = t - p.start;
            if (tt < 0) return null;
            const y = TOP + 10 + tt * p.speed;
            let x = p.x;
            if (y > SAND_TOP) x += Math.sin(((y - SAND_TOP) / GS) * Math.PI + p.ph) * 14;
            if (y > BOT - 90) x = x + (CX - x) * clamp01((y - (BOT - 90)) / 90);
            return <Sphere key={`f${i}`} cx={x} cy={y} r={p.r} kind="cream" opacity={clamp01(tt * 4)} />;
          })}
        </g>
        {/* las finas salen por el caño inferior: el agua no queda limpia */}
        {FINE.map((p, i) => {
          const tt = t - p.start;
          const y = TOP + 10 + tt * p.speed;
          if (tt < 0 || y < BOT) return null;
          const o = 1 - clamp01((y - (BOT + 60)) / 40);
          return <Sphere key={`o${i}`} cx={CX + Math.sin(p.ph) * 3} cy={y} r={p.r * 0.9} kind="cream" opacity={o} />;
        })}
        {/* contorno del tanque y reflejo vertical del vidrio */}
        <path d={tankPath} {...line} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        <path
          d={`M${TX0 + 26},${TOP + 110} L${TX0 + 26},${BOT - 60}`}
          stroke="#FFFFFF"
          strokeOpacity={0.35 * draw}
          strokeWidth={6}
          strokeLinecap="round"
          filter="url(#soft-blur)"
        />
      </svg>
    </AbsoluteFill>
  );
};
