import React from "react";
import { fontFamily } from "../theme";

/**
 * Billete genérico dibujado (no reproduce ningún diseño real): papel verde grisáceo,
 * marco, guilloché simple, medallón central con "$" y denominación en las esquinas.
 * Se posiciona por su centro.
 */
export const Banknote: React.FC<{
  x: number;
  y: number;
  width?: number;
  rotate?: number;
  shade?: number; // 0..1 oscurece levemente (billetes de abajo del fajo)
}> = ({ x, y, width = 520, rotate = 0, shade = 0 }) => {
  const w = width;
  const h = width * 0.43;
  const ink = "#5E6454";
  const paper = shade ? `rgb(${196 - shade * 30},${200 - shade * 30},${183 - shade * 30})` : "#C4C8B7";
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        transform: `rotate(${rotate}deg)`,
        filter: "drop-shadow(0 26px 34px rgba(0,0,0,0.38)) drop-shadow(0 4px 6px rgba(0,0,0,0.25))",
      }}
    >
      <svg width={w} height={h} viewBox="0 0 520 224" style={{ display: "block" }}>
        <rect x={0} y={0} width={520} height={224} rx={6} fill={paper} />
        <rect x={12} y={12} width={496} height={200} rx={4} fill="none" stroke={ink} strokeOpacity={0.55} strokeWidth={3} />
        <rect x={20} y={20} width={480} height={184} rx={3} fill="none" stroke={ink} strokeOpacity={0.3} strokeWidth={1.5} />
        {/* guilloché */}
        {Array.from({ length: 9 }).map((_, i) => (
          <path
            key={i}
            d={`M30 ${40 + i * 18} C 130 ${20 + i * 18}, 200 ${70 + i * 18}, 260 ${40 + i * 18} S 400 ${20 + i * 18}, 490 ${40 + i * 18}`}
            fill="none"
            stroke={ink}
            strokeOpacity={0.12}
            strokeWidth={1.2}
          />
        ))}
        {/* medallón */}
        <ellipse cx={260} cy={112} rx={62} ry={74} fill={paper} stroke={ink} strokeOpacity={0.6} strokeWidth={3} />
        <ellipse cx={260} cy={112} rx={52} ry={64} fill="none" stroke={ink} strokeOpacity={0.3} strokeWidth={1.5} />
        <text x={260} y={114} textAnchor="middle" dominantBaseline="central" fontFamily={fontFamily} fontWeight={800} fontSize={78} fill={ink} fillOpacity={0.75}>
          $
        </text>
        {/* denominación */}
        {[
          [62, 58],
          [458, 58],
          [62, 172],
          [458, 172],
        ].map(([cx, cy], i) => (
          <text key={i} x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontFamily={fontFamily} fontWeight={800} fontSize={34} fill={ink} fillOpacity={0.7}>
            100
          </text>
        ))}
        <text x={150} y={112} textAnchor="middle" dominantBaseline="central" fontFamily={fontFamily} fontWeight={600} fontSize={13} letterSpacing={3} fill={ink} fillOpacity={0.55}>
          AB 2045 7781 C
        </text>
        <text x={370} y={112} textAnchor="middle" dominantBaseline="central" fontFamily={fontFamily} fontWeight={600} fontSize={13} letterSpacing={3} fill={ink} fillOpacity={0.55}>
          CIEN · 100
        </text>
      </svg>
    </div>
  );
};
