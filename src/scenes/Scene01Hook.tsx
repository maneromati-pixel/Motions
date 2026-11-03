import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { PersonIcon } from "../components/PersonIcon";
import { Scene } from "../components/Scene";
import { C, ease, fontFamily, GLOW } from "../theme";
import { BEATS, SCENES } from "../timing";

const B = BEATS.hook;
const COLS = 10;
const CELL = 62;
const ICON = 40;
const GRID_W = COLS * CELL;
const GRID_TOP = 560;
// bloque tipográfico: alineado a la izquierda dentro de la zona segura (x 140–940)
const LEFT = 150;
const RIGHT = 930;

/** Estado (blanco/gris) de cada persona: titila con fase pseudoaleatoria determinística. */
const isLit = (i: number, frame: number) => {
  const period = B.twinklePeriod + Math.floor(random(`p${i}`) * 22);
  const phase = Math.floor(random(`o${i}`) * period);
  const duty = 0.35 + random(`d${i}`) * 0.3;
  return ((frame + phase) % period) / period < duty;
};

/** Cuadrícula fina + dos diagonales de fondo (estáticas, muy tenues). */
const Paper: React.FC = () => (
  <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
    {Array.from({ length: 10 }).map((_, i) => (
      <line key={`v${i}`} x1={i * 120 + 60} y1={0} x2={i * 120 + 60} y2={1920} stroke="#fff" strokeOpacity={0.035} strokeWidth={1.5} />
    ))}
    {Array.from({ length: 17 }).map((_, i) => (
      <line key={`h${i}`} x1={0} y1={i * 120 + 20} x2={1080} y2={i * 120 + 20} stroke="#fff" strokeOpacity={0.035} strokeWidth={1.5} />
    ))}
    <line x1={-40} y1={700} x2={1120} y2={40} stroke={C.gray} strokeOpacity={0.22} strokeWidth={2} />
    <line x1={250} y1={1500} x2={720} y2={-20} stroke={C.gray} strokeOpacity={0.22} strokeWidth={2} />
  </svg>
);

const SUB_WORDS = ["y", "no", "eres", "tú."];

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={SCENES.hook}>
      <Paper />

      {/* REGLA 1: el título es estático y opaco desde el frame 0 (sin entrada). */}
      <div style={{ position: "absolute", left: LEFT, top: 168, width: RIGHT - LEFT, fontFamily }}>
        <div style={{ fontWeight: 500, fontSize: 58, letterSpacing: "-0.01em", lineHeight: 1.1, color: C.white, opacity: 0.92 }}>
          Alguien gana con
        </div>
        <div
          style={{
            fontWeight: 800,
            fontSize: 132,
            letterSpacing: "-0.025em",
            lineHeight: 1.0,
            marginTop: 6,
            color: C.white,
            filter: GLOW,
            whiteSpace: "nowrap",
          }}
        >
          TU SUELDO
        </div>
      </div>

      {/* subtítulo palabra por palabra, con desenfoque de entrada (estilo kinetic type) */}
      <div
        style={{
          position: "absolute",
          right: 1080 - RIGHT,
          top: 408,
          fontFamily,
          fontWeight: 500,
          fontSize: 60,
          letterSpacing: "-0.01em",
          color: C.gray,
          display: "flex",
          gap: "0.28em",
        }}
      >
        {SUB_WORDS.map((w, i) => {
          const s = B.subtitle + i * 5;
          const p = interpolate(frame, [s, s + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
          const last = i === SUB_WORDS.length - 1;
          return (
            <span
              key={w}
              style={{
                opacity: p,
                transform: `translateY(${(1 - p) * 18}px) scale(${1.15 - 0.15 * p})`,
                filter: `blur(${(1 - p) * 10}px)${last && p > 0.5 ? " " + GLOW : ""}`,
                color: last ? C.white : C.gray,
                display: "inline-block",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 540 - GRID_W / 2,
          top: GRID_TOP,
          width: GRID_W,
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
          gridAutoRows: `${CELL}px`,
        }}
      >
        {Array.from({ length: 100 }).map((_, i) => {
          const lit = isLit(i, frame);
          return (
            <div key={i} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <PersonIcon size={ICON} color={lit ? C.white : C.dim} glow={lit} />
            </div>
          );
        })}
      </div>
    </Scene>
  );
};
