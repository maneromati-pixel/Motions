import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { MaterialDefs, Sphere } from "../components/Materials";
import { RealObject } from "../components/RealObject";
import { COLORS, TEXTS, TIMING } from "../config";
import { Title } from "../components/Text";
import { clamp01, easeInOut, easeOut, lerp, prog } from "../components/anim";
import { floatPos, makeParticles } from "../components/particles";

const T = TIMING.comoActua;
const GEL = { x: 540, y: 860 };
const FIELD = { x0: 140, x1: 940, y0: 600, y1: 1180 };
const FILTER = { x0: 200, x1: 880, top: 1330, bot: 1480 };

// centros de los flóculos
const CLUSTERS = [
  { x: 270, y: 700 },
  { x: 560, y: 650 },
  { x: 820, y: 740 },
  { x: 400, y: 900 },
  { x: 700, y: 950 },
  { x: 250, y: 1100 },
  { x: 540, y: 1130 },
  { x: 830, y: 1110 },
];
const nearest = (x: number, y: number) => {
  let best = 0;
  let bd = Infinity;
  CLUSTERS.forEach((c, i) => {
    const d = (c.x - x) ** 2 + (c.y - y) ** 2;
    if (d < bd) {
      bd = d;
      best = i;
    }
  });
  return best;
};

const GREY = makeParticles("actua-g", 72, FIELD, 4, 11).map((p) => ({ ...p, c: nearest(p.x, p.y), blue: false, emit: 0, sx: 0, sy: 0 }));
const BLUE = makeParticles("actua-b", 56, FIELD, 4, 9).map((p, i) => ({
  ...p,
  c: nearest(p.x, p.y),
  blue: true,
  emit: T.disolucion[0] + random(`emit${i}`) * (T.disolucion[1] - T.disolucion[0] - 0.4),
  // punto de salida dentro del disco
  sx: GEL.x + Math.cos(i * 2.4) * 120 * Math.sqrt(random(`sx${i}`)),
  sy: GEL.y + Math.sin(i * 2.4) * 120 * Math.sqrt(random(`sx${i}`)),
}));
const ALL = [...GREY, ...BLUE];

// granos del lecho filtrante (línea fina)
const GRAINS: { x: number; y: number }[] = [];
for (let row = 0; row < 3; row++) {
  for (let x = FILTER.x0 + 30 + (row % 2) * 22; x < FILTER.x1 - 20; x += 44) {
    GRAINS.push({ x, y: FILTER.top + 34 + row * 38 });
  }
}

/** 4. Cómo actúa: el gel se disuelve, las partículas se agrupan y el filtro las retiene. */
export const ComoActua: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const f = (sec: number) => sec * fps;

  const gelIn = prog(frame, 0, 14);
  const dissolve = prog(frame, f(T.disolucion[0]), f(T.disolucion[1]), easeInOut);
  const floc = prog(frame, f(T.floculacion[0]), f(T.floculacion[1]), easeInOut);
  const filterIn = prog(frame, f(T.retencion[0] - 0.8), f(T.retencion[0]));
  const filterGlow = prog(frame, f(T.retencion[1] - 0.6), f(T.retencion[1])) * (1 - prog(frame, f(T.retencion[1] + 0.2), f(T.retencion[1] + 1.2)));
  const clean = prog(frame, f(T.retencion[1]), f(T.retencion[1] + 1.2));
  const filterOut = prog(frame, f(T.retencion[1] + 0.4), f(T.retencion[1] + 1.4));

  return (
    <AbsoluteFill>
      {/* luz limpia y luminosa al final */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 70% 45% at 50% 50%, rgba(255,232,220,0.30) 0%, rgba(255,232,220,0) 70%)",
          opacity: clean,
        }}
      />
      {/* disco de gel azul */}
      <RealObject
        kind="gel"
        width={400}
        x={GEL.x}
        y={GEL.y}
        opacity={gelIn * (1 - dissolve)}
        scale={(0.9 + 0.1 * gelIn) * (1 - dissolve * 0.75)}
        rotate={dissolve * 25}
        tiltX={18 + Math.sin(frame / 26) * 4}
        tiltY={-10 + Math.cos(frame / 30) * 5}
        sheen={prog(frame, 4, 40)}
        contact={1 - dissolve}
        style={{ filter: `blur(${dissolve * 10}px)` }}
      />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <MaterialDefs />
        {/* filtro: carcasa de vidrio con lecho de arena */}
        <g opacity={filterIn * (1 - filterOut * 0.85)}>
          <rect
            x={FILTER.x0}
            y={FILTER.top}
            width={FILTER.x1 - FILTER.x0}
            height={FILTER.bot - FILTER.top}
            rx={28}
            fill="url(#glass)"
            stroke={COLORS.crema}
            strokeOpacity={0.6}
            strokeWidth={3}
          />
          <rect x={FILTER.x0} y={FILTER.top} width={FILTER.x1 - FILTER.x0} height={FILTER.bot - FILTER.top} rx={28} fill="#FFF1E6" opacity={filterGlow * 0.18} />
          {GRAINS.map((g, i) => (
            <g key={i}>
              <circle cx={g.x + 2} cy={g.y + 3} r={14} fill="#1E0204" opacity={0.3} />
              <circle cx={g.x} cy={g.y} r={14} fill="url(#sph-sand)" />
            </g>
          ))}
        </g>
        {/* halo gelatinoso de cada flóculo mientras se forma */}
        {CLUSTERS.map((c, i) => {
          const delay = (i % 4) * 0.18 + Math.floor(i / 4) * 0.1;
          const fall = prog(t, T.retencion[0] + delay, T.retencion[1] - 0.5 + delay * 0.4, easeInOut);
          const hx = lerp(c.x, lerp(FILTER.x0 + 70, FILTER.x1 - 70, (c.x - 250) / 580), fall);
          const hy = lerp(c.y, FILTER.top - 8, fall);
          const absorbed = prog(t, T.retencion[1] - 0.3, T.retencion[1] + 0.7);
          return <circle key={`h${i}`} cx={hx} cy={hy} r={70 * floc * (1 - fall * 0.4)} fill="url(#floc-halo)" opacity={floc * (1 - absorbed)} />;
        })}
        {ALL.map((p, i) => {
          // 1) posición flotante
          const fp = floatPos(p, t + 2, 22);
          let x = fp.x;
          let y = fp.y;
          let o = p.blue ? 0 : interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
          // 2) las azules salen del disco
          if (p.blue) {
            const e = clamp01((t - p.emit) / 0.9);
            const ee = easeOut(e);
            x = lerp(p.sx, x, ee);
            y = lerp(p.sy, y, ee);
            o = clamp01((t - p.emit) * 5);
          }
          // 3) floculación: se agrupan alrededor de su centro
          const c = CLUSTERS[p.c];
          const ang = p.k * Math.PI * 2;
          const rad = 8 + Math.sqrt(p.phase / (Math.PI * 2)) * 44;
          const cx = c.x + Math.cos(ang) * rad;
          const cy = c.y + Math.sin(ang) * rad;
          x = lerp(x, cx, floc);
          y = lerp(y, cy, floc);
          // 4) retención: cada flóculo baja hasta el filtro y queda atrapado
          const delay = (p.c % 4) * 0.18 + Math.floor(p.c / 4) * 0.1;
          const fall = prog(t, T.retencion[0] + delay, T.retencion[1] - 0.5 + delay * 0.4, easeInOut);
          const targetX = lerp(FILTER.x0 + 70, FILTER.x1 - 70, ((c.x - 250) / 580)) + (x - c.x) * 0.9;
          const targetY = FILTER.top + 10 + (y - c.y) * 0.35 - 6;
          x = lerp(x, targetX, fall);
          y = lerp(y, Math.min(targetY, FILTER.top - 4), fall);
          const absorbed = prog(t, T.retencion[1] - 0.3, T.retencion[1] + 0.7);
          const r = p.r * (1 + floc * 0.25) * (1 - absorbed * 0.6);
          return (
            <Sphere
              key={i}
              cx={x}
              cy={y}
              r={r}
              kind={p.blue ? "blue" : "grey"}
              opacity={o * (p.blue ? 0.95 : 0.7 + 0.3 * p.depth) * (1 - absorbed)}
              blur={p.depth < 0.2 && floc < 0.5}
            />
          );
        })}
      </svg>
      <Title y={400} size={96} inAt={f(T.textos[0])} outAt={f(T.textos[1]) - 8}>
        {TEXTS.comoActua[0]}
      </Title>
      <Title y={400} size={96} inAt={f(T.textos[1])} outAt={f(T.textos[2]) - 8}>
        {TEXTS.comoActua[1]}
      </Title>
      <Title y={940} size={100} inAt={f(T.textos[2])}>
        {TEXTS.comoActua[2]}
      </Title>
    </AbsoluteFill>
  );
};
