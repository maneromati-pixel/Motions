import React from "react";
import { C, GLOW, type } from "../theme";

/**
 * Ejes en L con flechas + curva exponencial con glow y punto brillante en la punta.
 * `progress` 0..1 dibuja la curva; `axes` 0..1 dibuja los ejes.
 */
export const Chart: React.FC<{
  x: number; // origen (esquina inferior izquierda) en px absolutos
  y: number;
  width: number;
  height: number;
  progress: number;
  axes?: number;
  xLabel?: string;
  yLabel?: string;
  labelsOpacity?: number;
}> = ({ x, y, width, height, progress, axes = 1, xLabel = "TIEMPO", yLabel = "INGRESO", labelsOpacity = 1 }) => {
  const k = 5.2;
  const f = (t: number) => (Math.exp(k * t) - 1) / (Math.exp(k) - 1);
  const cw = width - 60;
  const ch = height - 70;
  const N = 120;
  const n = Math.max(1, Math.round(N * progress));
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / N) * 1;
    pts.push([x + 14 + t * cw, y - 14 - f(t) * ch]);
  }
  if (progress > 0) {
    // punto final exacto
    const t = progress;
    pts[pts.length - 1] = [x + 14 + t * cw, y - 14 - f(t) * ch];
  }
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const tip = pts[pts.length - 1];
  const ax = axes;
  return (
    <>
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      >
        <g stroke={C.gray} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <line x1={x} y1={y} x2={x} y2={y - height * ax} />
          <line x1={x} y1={y} x2={x + width * ax} y2={y} />
          {ax > 0.95 && (
            <>
              <polyline points={`${x - 12},${y - height + 16} ${x},${y - height} ${x + 12},${y - height + 16}`} />
              <polyline points={`${x + width - 16},${y - 12} ${x + width},${y} ${x + width - 16},${y + 12}`} />
            </>
          )}
        </g>
        {progress > 0 && (
          <g style={{ filter: GLOW }}>
            <path d={d} stroke={C.ink} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={tip[0]} cy={tip[1]} r={13} fill={C.ink} />
            <circle cx={tip[0]} cy={tip[1]} r={26} fill={C.ink} opacity={0.18} />
          </g>
        )}
      </svg>
      <div
        style={{
          position: "absolute",
          left: x - 10,
          top: y - height - 50,
          ...type.micro,
          opacity: labelsOpacity,
        }}
      >
        {yLabel}
      </div>
      <div
        style={{
          position: "absolute",
          left: x + width - 200,
          width: 200,
          textAlign: "right",
          top: y + 28,
          ...type.micro,
          opacity: labelsOpacity,
        }}
      >
        {xLabel}
      </div>
    </>
  );
};
