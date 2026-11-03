import React from "react";
import { C, fontFamily, GLOW } from "../theme";

/** Barra de búsqueda tipo píldora blanca con lupa, texto tipeado y cursor. */
export const SearchPill: React.FC<{ text: string; cursor: boolean; width?: number; height?: number }> = ({
  text,
  cursor,
  width = 660,
  height = 116,
}) => (
  <div
    style={{
      width,
      height,
      borderRadius: height / 2,
      background: C.ink,
      filter: GLOW,
      display: "flex",
      alignItems: "center",
      paddingLeft: 44,
      boxSizing: "border-box",
      gap: 26,
    }}
  >
    <svg width={44} height={44} viewBox="0 0 44 44">
      <circle cx={18} cy={18} r={13} fill="none" stroke={C.paper} strokeWidth={4.5} />
      <line x1={28} y1={28} x2={40} y2={40} stroke={C.paper} strokeWidth={4.5} strokeLinecap="round" />
    </svg>
    <div style={{ fontFamily, fontWeight: 600, fontSize: 50, color: C.paper, display: "flex", alignItems: "center" }}>
      <span>{text}</span>
      <span style={{ width: 4, height: 56, background: C.paper, marginLeft: 6, opacity: cursor ? 1 : 0 }} />
    </div>
  </div>
);
