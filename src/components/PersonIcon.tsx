import React from "react";
import { C, GLOW } from "../theme";

/** Cabeza (círculo) + cuerpo (medio óvalo redondeado). */
export const PersonIcon: React.FC<{
  size?: number;
  color?: string;
  glow?: boolean;
  style?: React.CSSProperties;
}> = ({ size = 100, color = C.white, glow = false, style }) => (
  <svg
    width={size}
    height={size * 1.15}
    viewBox="0 0 100 115"
    style={{ display: "block", overflow: "visible", filter: glow ? GLOW : undefined, ...style }}
  >
    <circle cx={50} cy={26} r={22} fill={color} />
    <path d="M8 113 C8 76 26 56 50 56 C74 56 92 76 92 113 Z" fill={color} />
  </svg>
);
