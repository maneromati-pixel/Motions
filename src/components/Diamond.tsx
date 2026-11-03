import React from "react";
import { C, GLOW, type } from "../theme";

/** Rombo de decisión con contorno y texto centrado. Se posiciona por su centro. */
export const Diamond: React.FC<{
  cx: number;
  cy: number;
  width?: number;
  height?: number;
  label: string;
  fontSize?: number;
  opacity?: number;
  scale?: number;
}> = ({ cx, cy, width = 340, height = 170, label, fontSize = 22, opacity = 1, scale = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: cx - width / 2,
      top: cy - height / 2,
      width,
      height,
      opacity,
      transform: `scale(${scale})`,
    }}
  >
    <svg width={width} height={height} style={{ position: "absolute", overflow: "visible", filter: GLOW }}>
      <polygon
        points={`${width / 2},2 ${width - 2},${height / 2} ${width / 2},${height - 2} 2,${height / 2}`}
        fill="rgba(0,0,0,0.03)"
        stroke={C.ink}
        strokeWidth={3}
        strokeLinejoin="round"
      />
    </svg>
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...type.label,
        fontSize,
        letterSpacing: "0.2em",
        paddingLeft: "0.2em",
        color: C.ink,
      }}
    >
      {label}
    </div>
  </div>
);
