import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { getLength } from "@remotion/paths";
import { COLORS } from "../config";
import { M_PATHS, M_VIEWBOX } from "../mPath";
import { easeInOut, easeOut, prog } from "./anim";

// centros de los puntos rojos del logo (coordenadas del viewBox de la M)
const DOTS = [
  { cx: 161.7, cy: 159.4, r: 50 },
  { cx: 663.6, cy: 160.6, r: 51 },
];

/**
 * Cortina entre escenas: el trazo de la "M" del logo se dibuja (stroke-dashoffset)
 * cruzando la pantalla, se rellena en azul y se retira. El corte de escena ocurre en el medio.
 * Se monta dentro de una <Sequence> cuya duración es la de la transición.
 */
export const MTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames: d, width, height } = useVideoConfig();
  const len = useMemo(() => getLength(M_PATHS.join(" ")), []);

  const draw = prog(frame, 0, d * 0.5, easeInOut);
  const fill = prog(frame, d * 0.28, d * 0.5);
  const out = prog(frame, d * 0.55, d, easeOut);
  const dots = prog(frame, d * 0.38, d * 0.55);

  const w = 1650;
  const scale = w / M_VIEWBOX.w;
  const h = M_VIEWBOX.h * scale;
  // cruza la pantalla de derecha a izquierda, levemente en diagonal
  const x = interpolate(frame, [0, d], [380, -420]);
  const y = interpolate(frame, [0, d], [60, -60]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", inset: 0, opacity: 1 - out }}
      >
        <g
          transform={`translate(${(width - w) / 2 + x} ${(height - h) / 2 + y}) rotate(-6 ${w / 2} ${h / 2}) scale(${scale * (1 + out * 0.08)})`}
        >
          {M_PATHS.map((p, i) => (
            <path
              key={i}
              d={p}
              fill={COLORS.azulLogo}
              fillOpacity={fill * 0.95}
              stroke={COLORS.azulLogo}
              strokeWidth={5}
              strokeLinejoin="round"
              strokeDasharray={len}
              strokeDashoffset={len * (1 - draw)}
            />
          ))}
          {DOTS.map((dot, i) => (
            <circle
              key={i}
              cx={dot.cx}
              cy={dot.cy}
              r={dot.r * dots}
              fill={COLORS.rojo}
            />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
