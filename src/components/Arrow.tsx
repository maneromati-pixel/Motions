import React from "react";
import { C, GLOW } from "../theme";

/**
 * Flecha fina (2px). Por defecto vertical hacia abajo; `angle` en grados
 * (0 = abajo, -90 = derecha). `progress` dibuja la línea de 0 a 1.
 */
export const Arrow: React.FC<{
  length?: number;
  color?: string;
  glow?: boolean;
  progress?: number;
  angle?: number;
  style?: React.CSSProperties;
}> = ({ length = 70, color = C.ink, glow = false, progress = 1, angle = 0, style }) => {
  const l = Math.max(0, length * progress);
  const head = 10;
  return (
    <svg
      width={24}
      height={length}
      viewBox={`0 0 24 ${length}`}
      style={{
        display: "block",
        overflow: "visible",
        transform: angle ? `rotate(${angle}deg)` : undefined,
        transformOrigin: "12px 0px",
        filter: glow ? GLOW : undefined,
        ...style,
      }}
    >
      <line x1={12} y1={0} x2={12} y2={l} stroke={color} strokeWidth={2} strokeLinecap="round" />
      {progress > 0.6 && (
        <polyline
          points={`${12 - head * 0.8},${l - head} 12,${l} ${12 + head * 0.8},${l - head}`}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={Math.min(1, (progress - 0.6) / 0.3)}
        />
      )}
    </svg>
  );
};
