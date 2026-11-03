import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Banknote } from "../components/Banknote";
import { Scene } from "../components/Scene";
import { ease, fontFamily } from "../theme";
import { BEATS, SCENES } from "../timing";

const B = BEATS.hook;

// Paleta "papel" exclusiva del gancho (estilo del clip de referencia)
const PAPER = {
  center: "#E6E5DC",
  edge: "#BDBCB2",
  grid: "rgba(40,40,30,0.07)",
  line: "rgba(70,70,60,0.45)",
  ink: "#3E3E3A",
  inkSoft: "#6E6E66",
};

const LEFT = 150;
const RIGHT = 930;

/** Entrada de palabra: desenfoque + escala + fade (efecto "motion blur"). */
const wordIn = (frame: number, start: number, dur = 8) => {
  if (start <= 0) return { opacity: 1, transform: "none", filter: "none" };
  const p = interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * 14}px) scale(${1.18 - 0.18 * p})`,
    filter: `blur(${(1 - p) * 12}px)`,
  };
};

const Word: React.FC<{ frame: number; start: number; children: string; style?: React.CSSProperties }> = ({ frame, start, children, style }) => (
  <span style={{ display: "inline-block", transformOrigin: "left bottom", ...wordIn(frame, start), ...style }}>{children}</span>
);

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  // leve zoom de cámara y deriva de los billetes (solo el entorno, no el texto)
  const zoom = 1 + 0.045 * (frame / SCENES.hook);
  const drift = frame / SCENES.hook;
  const w = B.titleWords;
  const s = B.titleStep;

  return (
    <Scene duration={SCENES.hook}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 65% at 50% 42%, ${PAPER.center} 0%, ${PAPER.center} 35%, ${PAPER.edge} 100%)`,
        }}
      />
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 150 + 15} y1={0} x2={i * 150 + 15} y2={1920} stroke={PAPER.grid} strokeWidth={2} />
          ))}
          {Array.from({ length: 13 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 150 + 60} x2={1080} y2={i * 150 + 60} stroke={PAPER.grid} strokeWidth={2} />
          ))}
          <line x1={-40} y1={560} x2={1120} y2={120} stroke={PAPER.line} strokeWidth={2.5} />
          <line x1={330} y1={1640} x2={800} y2={-20} stroke={PAPER.line} strokeWidth={2.5} />
          <line x1={120} y1={1520} x2={1120} y2={1040} stroke={PAPER.line} strokeWidth={2.5} />
        </svg>

        {/* fajo arriba a la derecha */}
        <Banknote x={930 + drift * 6} y={210 - drift * 10} width={520} rotate={-28 + drift * 2} shade={0.5} />
        <Banknote x={900 + drift * 10} y={190 - drift * 6} width={520} rotate={-20 + drift * 3} />
        {/* fajo abajo a la izquierda */}
        <Banknote x={190 - drift * 8} y={1450 + drift * 10} width={560} rotate={36 - drift * 2} shade={0.5} />
        <Banknote x={230 - drift * 12} y={1420 + drift * 8} width={560} rotate={28 - drift * 3} />
      </AbsoluteFill>

      {/* título: palabra por palabra (rápido), "Alguien" visible desde el frame 0 */}
      <div style={{ position: "absolute", left: LEFT, top: 600, width: RIGHT - LEFT, fontFamily, color: PAPER.ink }}>
        <div style={{ fontWeight: 500, fontSize: 66, letterSpacing: "-0.015em", lineHeight: 1.1, display: "flex", gap: "0.25em" }}>
          <Word frame={frame} start={w[0]}>Alguien</Word>
          <Word frame={frame} start={w[1]}>gana</Word>
          <Word frame={frame} start={w[2]}>con</Word>
        </div>
        <div
          style={{
            fontWeight: 800,
            fontSize: 140,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            marginTop: 4,
            display: "flex",
            gap: "0.22em",
            whiteSpace: "nowrap",
            textShadow: "0 6px 18px rgba(0,0,0,0.18)",
          }}
        >
          <Word frame={frame} start={w[3]}>TU</Word>
          <Word frame={frame} start={w[4]}>SUELDO</Word>
        </div>
      </div>

      {/* remate alineado a la derecha, a los 1,5 s */}
      <div
        style={{
          position: "absolute",
          right: 1080 - RIGHT,
          top: 850,
          fontFamily,
          fontWeight: 500,
          fontSize: 64,
          letterSpacing: "-0.015em",
          color: PAPER.inkSoft,
          display: "flex",
          gap: "0.25em",
        }}
      >
        {["y", "no", "eres", "tú."].map((word, i) => (
          <Word key={word} frame={frame} start={B.subtitle + i * s} style={i === 3 ? { color: PAPER.ink, fontWeight: 800 } : undefined}>
            {word}
          </Word>
        ))}
      </div>
    </Scene>
  );
};
