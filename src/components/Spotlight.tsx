import React, { useId } from "react";

/** Haz de luz cónico desde arriba hasta el piso, con mancha elíptica en la base. */
export const Spotlight: React.FC<{
  cx: number;
  top: number;
  bottom: number;
  width?: number; // ancho en la base
  intensity?: number; // 0..1
}> = ({ cx, top, bottom, width = 280, intensity = 1 }) => {
  const id = "s" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const tw = 36;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", opacity: intensity }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.02} />
          <stop offset="100%" stopColor="#fff" stopOpacity={0.16} />
        </linearGradient>
        <radialGradient id={id + "e"}>
          <stop offset="0%" stopColor="#fff" stopOpacity={0.22} />
          <stop offset="100%" stopColor="#fff" stopOpacity={0} />
        </radialGradient>
      </defs>
      <path d={`M${cx - tw / 2},${top} L${cx + tw / 2},${top} L${cx + width / 2},${bottom} L${cx - width / 2},${bottom} Z`} fill={`url(#${id})`} />
      <ellipse cx={cx} cy={bottom} rx={width * 0.62} ry={26} fill={`url(#${id}e)`} />
    </svg>
  );
};
