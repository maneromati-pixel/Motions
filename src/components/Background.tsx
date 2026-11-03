import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../theme";

/** Fondo papel con viñeta suave y cuadrícula fina (mismo lenguaje que el gancho). */
export const Background: React.FC<{ grid?: boolean; diagonals?: boolean }> = ({ grid = true, diagonals = false }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 80% 65% at 50% 42%, ${C.paper} 0%, ${C.paper} 35%, ${C.paperEdge} 100%)`,
    }}
  >
    {grid && (
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 150 + 15} y1={0} x2={i * 150 + 15} y2={1920} stroke={C.grid} strokeWidth={2} />
        ))}
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 150 + 60} x2={1080} y2={i * 150 + 60} stroke={C.grid} strokeWidth={2} />
        ))}
        {diagonals && (
          <>
            <line x1={-40} y1={560} x2={1120} y2={120} stroke={C.line} strokeWidth={2.5} />
            <line x1={330} y1={1640} x2={800} y2={-20} stroke={C.line} strokeWidth={2.5} />
            <line x1={120} y1={1520} x2={1120} y2={1040} stroke={C.line} strokeWidth={2.5} />
          </>
        )}
      </svg>
    )}
  </AbsoluteFill>
);
