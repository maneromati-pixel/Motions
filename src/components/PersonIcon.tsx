import React, { useId } from "react";
import { C, GLOW } from "../theme";

/**
 * Cabeza (círculo) + cuerpo (medio óvalo de hombros redondeados).
 * `halo` agrega un resplandor radial suave detrás (estilo "escenario").
 */
export const PersonIcon: React.FC<{
  size?: number;
  color?: string;
  glow?: boolean;
  halo?: number; // 0..1 intensidad del halo
  style?: React.CSSProperties;
}> = ({ size = 100, color = C.ink, glow = false, halo = 0, style }) => {
  const id = "h" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 100 115"
      style={{ display: "block", overflow: "visible", ...style }}
    >
      {halo > 0 && (
        <>
          <defs>
            <radialGradient id={id}>
              <stop offset="0%" stopColor="#000" stopOpacity={0.10 * halo} />
              <stop offset="45%" stopColor="#000" stopOpacity={0.035 * halo} />
              <stop offset="100%" stopColor="#000" stopOpacity={0} />
            </radialGradient>
          </defs>
          <ellipse cx={50} cy={70} rx={130} ry={110} fill={`url(#${id})`} />
        </>
      )}
      <g style={{ filter: glow ? GLOW : undefined }}>
        <circle cx={50} cy={25} r={21} fill={color} />
        <path
          d="M10 113 V86 C10 67 25 54 44 54 H56 C75 54 90 67 90 86 V113 Z"
          fill={color}
        />
      </g>
    </svg>
  );
};
