import React from "react";
import { C, GLOW, type } from "../theme";

export type Blip = { label: string; angle: number; r: number; seen: number };

const pt = (cx: number, cy: number, deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
};

/**
 * Radar: anillos concéntricos, barrido con estela y puntos detectados.
 * `seen` de cada blip: 0..1 (aparición tras el paso del barrido).
 */
export const Radar: React.FC<{
  cx: number;
  cy: number;
  r: number;
  sweep: number; // ángulo actual en grados
  sweepOpacity?: number;
  draw?: number; // 0..1 aparición de anillos
  blips: Blip[];
}> = ({ cx, cy, r, sweep, sweepOpacity = 1, draw = 1, blips }) => {
  const trail = 48;
  const slices = 16;
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <g stroke={C.gray} fill="none" strokeWidth={2} opacity={draw}>
          {[1, 2 / 3, 1 / 3].map((k) => (
            <circle key={k} cx={cx} cy={cy} r={r * k * (0.85 + 0.15 * draw)} strokeOpacity={k === 1 ? 0.8 : 0.45} />
          ))}
          <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} strokeOpacity={0.25} />
          <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} strokeOpacity={0.25} />
        </g>
        {/* estela del barrido */}
        <g opacity={sweepOpacity}>
          {Array.from({ length: slices }).map((_, i) => {
            const a1 = sweep - (trail * (i + 1)) / slices;
            const a2 = sweep - (trail * i) / slices;
            const [x1, y1] = pt(cx, cy, a1, r);
            const [x2, y2] = pt(cx, cy, a2, r);
            return (
              <path
                key={i}
                d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 0 1 ${x2},${y2} Z`}
                fill={C.white}
                opacity={0.16 * (1 - i / slices)}
              />
            );
          })}
          {(() => {
            const [x, y] = pt(cx, cy, sweep, r);
            return <line x1={cx} y1={cy} x2={x} y2={y} stroke={C.white} strokeWidth={3} style={{ filter: GLOW }} />;
          })()}
        </g>
        {blips.map((b) => {
          if (b.seen <= 0) return null;
          const [x, y] = pt(cx, cy, b.angle, b.r);
          return (
            <g key={b.label} opacity={b.seen} style={{ filter: GLOW }}>
              <circle cx={x} cy={y} r={8} fill={C.white} />
              <circle cx={x} cy={y} r={8 + 22 * (1 - b.seen)} fill="none" stroke={C.white} strokeOpacity={1 - b.seen} strokeWidth={2} />
            </g>
          );
        })}
      </svg>
      {blips.map((b) => {
        if (b.seen <= 0) return null;
        const [x, y] = pt(cx, cy, b.angle, b.r);
        const right = true; // siempre a la derecha: no choca con el borde izquierdo
        return (
          <div
            key={b.label}
            style={{
              position: "absolute",
              top: y - 12,
              left: right ? x + 18 : undefined,
              right: right ? undefined : 1080 - x + 18,
              ...type.micro,
              fontSize: 18,
              letterSpacing: "0.22em",
              color: C.white,
              fontWeight: 600,
              whiteSpace: "nowrap",
              opacity: b.seen,
            }}
          >
            {b.label}
          </div>
        );
      })}
    </>
  );
};
