import React from "react";
import { C, type } from "../theme";

/** Línea de piso punteada (escenario) con microetiqueta opcional debajo. */
export const Ground: React.FC<{
  y: number;
  x1?: number;
  x2?: number;
  progress?: number; // 0..1, crece desde el centro
  caption?: string;
  captionOpacity?: number;
}> = ({ y, x1 = 130, x2 = 950, progress = 1, caption, captionOpacity = 1 }) => {
  const cx = (x1 + x2) / 2;
  const half = ((x2 - x1) / 2) * progress;
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        <line x1={cx - half} y1={y} x2={cx + half} y2={y} stroke={C.gray} strokeOpacity={0.7} strokeWidth={2} strokeDasharray="5 9" />
      </svg>
      {caption && (
        <div
          style={{
            position: "absolute",
            left: x1,
            width: x2 - x1,
            top: y + 26,
            textAlign: "center",
            ...type.micro,
            paddingLeft: "0.3em",
            boxSizing: "border-box",
            opacity: captionOpacity,
          }}
        >
          {caption}
        </div>
      )}
    </>
  );
};
