import React from "react";
import { useCurrentFrame } from "remotion";
import { PersonIcon } from "../components/PersonIcon";
import { Pill } from "../components/Pill";
import { Scene } from "../components/Scene";
import { Text, Title } from "../components/Text";
import { C, enter, GLOW, pop, progress, type } from "../theme";
import { BEATS, SCENES } from "../timing";

const B = BEATS.gente;
const AXIS_Y = 1000;
const X0 = 250; // x del 0%
const PX_PER_PCT = 31; // 0..20% → 250..870
const DOT = 10;
const STEP = 25;
/** Distribución ilustrativa: cuántas personas ahorran cada % de su ingreso. */
const COUNTS: Record<number, number> = { 0: 13, 1: 10, 2: 8, 3: 6, 4: 4, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1, 12: 1, 15: 1, 20: 1 };
const YOU_PCT = 10;
const TICKS = [0, 5, 10, 15, 20];

const xOf = (pct: number) => X0 + pct * PX_PER_PCT;

// orden de aparición: de abajo hacia arriba, de izquierda a derecha
const DOTS = (() => {
  const list: { x: number; y: number; row: number }[] = [];
  const maxRows = Math.max(...Object.values(COUNTS));
  for (let row = 0; row < maxRows; row++) {
    for (const [pct, n] of Object.entries(COUNTS)) {
      if (row < n) list.push({ x: xOf(Number(pct)), y: AXIS_Y - 22 - row * STEP, row });
    }
  }
  return list;
})();

export const Scene06Gente: React.FC = () => {
  const frame = useCurrentFrame();
  const t = enter(frame, B.title);
  const axis = progress(frame, B.axis, B.axis + 16);
  const crowd = pop(frame, B.crowdPill);
  const you = pop(frame, B.you);
  const txt = enter(frame, B.text);
  const topY = AXIS_Y - 22 - (COUNTS[0] - 1) * STEP;

  return (
    <Scene duration={SCENES.gente}>
      <div style={{ opacity: t.opacity, transform: t.transform }}>
        <Title>{"CUÁNTO AHORRA\nLA GENTE"}</Title>
      </div>

      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <line x1={X0 - 30} y1={AXIS_Y} x2={X0 - 30 + 700 * axis} y2={AXIS_Y} stroke={C.gray} strokeWidth={2} />
        {TICKS.map((p) => (
          <line key={p} x1={xOf(p)} y1={AXIS_Y} x2={xOf(p)} y2={AXIS_Y + 10} stroke={C.gray} strokeWidth={2} opacity={axis} />
        ))}
        {DOTS.map((d, i) => {
          const s = B.dots + i * B.dotGap;
          const p = progress(frame, s, s + 8);
          if (p <= 0) return null;
          return <circle key={i} cx={d.x} cy={d.y + (1 - p) * 14} r={DOT} fill={C.gray} opacity={p} />;
        })}
        {/* tu punto: arriba del 10% */}
        {you.p > 0 && (
          <g style={{ filter: GLOW }} opacity={you.opacity}>
            <circle cx={xOf(YOU_PCT)} cy={AXIS_Y - 22} r={DOT + 4} fill={C.ink} />
            <circle cx={xOf(YOU_PCT)} cy={AXIS_Y - 22} r={DOT + 4 + 24 * (1 - you.p)} fill="none" stroke={C.ink} strokeWidth={2} opacity={1 - you.p} />
          </g>
        )}
      </svg>

      {TICKS.map((p) => (
        <div key={p} style={{ position: "absolute", left: xOf(p) - 50, width: 100, top: AXIS_Y + 22, textAlign: "center", ...type.micro, fontSize: 18, letterSpacing: "0.1em", opacity: axis }}>
          {p}%
        </div>
      ))}
      <Text variant="micro" y={AXIS_Y + 62} style={{ opacity: axis }}>
        AHORRO MENSUAL
      </Text>

      {/* "tú", parado al costado del eje */}
      <div style={{ position: "absolute", left: 128, top: AXIS_Y - 60 * 1.15, opacity: axis }}>
        <PersonIcon size={60} glow halo={0.5} />
      </div>

      <div style={{ position: "absolute", left: xOf(0), top: topY - 70, transform: `translateX(-30%) ${crowd.transform}`, opacity: crowd.opacity }}>
        <Pill text="LA MAYORÍA: 0%" fontSize={18} />
      </div>
      <div style={{ position: "absolute", left: xOf(YOU_PCT), top: AXIS_Y - 112, transform: `translateX(-50%) ${you.transform}`, opacity: you.opacity }}>
        <Pill text="TÚ: 10%" fontSize={18} />
      </div>

      <Text variant="label" y={AXIS_Y + 150} glow size={30} style={{ opacity: txt.opacity, transform: txt.transform }}>
        {"POCOS LLEGAN AL 10%"}
      </Text>
    </Scene>
  );
};
