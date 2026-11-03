import React from "react";
import { C, GLOW } from "../theme";

/** Barra vertical con contorno y relleno blanco (de abajo hacia arriba). */
export const BarMeter: React.FC<{
  level: number; // 0..1
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}> = ({ level, width = 110, height = 460, style }) => {
  const pad = 8;
  const inner = height - pad * 2 - 6;
  const h = Math.max(0, Math.min(1, level)) * inner;
  return (
    <div
      style={{
        width,
        height,
        boxSizing: "border-box",
        border: `3px solid ${C.ink}`,
        borderRadius: 14,
        position: "relative",
        filter: GLOW,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: pad,
          right: pad,
          bottom: pad,
          height: h,
          background: C.ink,
          borderRadius: 6,
        }}
      />
    </div>
  );
};
