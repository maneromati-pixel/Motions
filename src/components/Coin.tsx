import React from "react";
import { C, fontFamily } from "../theme";

/** Moneda: círculo blanco con "$" negro. Se posiciona por su centro. */
export const Coin: React.FC<{
  x: number;
  y: number;
  r?: number;
  rotate?: number;
}> = ({ x, y, r = 32, rotate = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
    <circle r={r} fill={C.white} />
    <circle r={r - 6} fill="none" stroke={C.black} strokeOpacity={0.18} strokeWidth={2} />
    <text
      textAnchor="middle"
      dominantBaseline="central"
      fontFamily={fontFamily}
      fontWeight={800}
      fontSize={r * 1.15}
      fill={C.black}
      y={1}
    >
      $
    </text>
  </g>
);
