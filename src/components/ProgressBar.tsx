import React from "react";
import { C, GLOW } from "../theme";

/** Barra horizontal con contorno y relleno animado. */
export const ProgressBar: React.FC<{
  value: number; // 0..1
  width?: number;
  height?: number;
  color?: string;
  glow?: boolean;
  style?: React.CSSProperties;
}> = ({ value, width = 640, height = 34, color = C.ink, glow = true, style }) => {
  const pad = 6;
  const inner = width - pad * 2 - 6;
  return (
    <div
      style={{
        width,
        height,
        boxSizing: "border-box",
        border: `3px solid ${color}`,
        borderRadius: height / 2,
        position: "relative",
        filter: glow ? GLOW : undefined,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: pad,
          top: pad,
          bottom: pad,
          width: Math.max(0, Math.min(1, value)) * inner,
          background: color,
          borderRadius: height,
        }}
      />
    </div>
  );
};
