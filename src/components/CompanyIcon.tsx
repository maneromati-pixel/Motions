import React from "react";
import { C, GLOW } from "../theme";

/** Edificio simple (empresa): bloque con ventanas. */
export const CompanyIcon: React.FC<{ size?: number; color?: string; glow?: boolean }> = ({
  size = 90,
  color = C.white,
  glow = true,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible", filter: glow ? GLOW : undefined }}>
    <path d="M14 96 V30 L50 10 L86 30 V96 Z" fill={color} />
    {[0, 1, 2].map((r) =>
      [0, 1, 2].map((c) => (
        <rect key={`${r}${c}`} x={28 + c * 17} y={40 + r * 17} width={10} height={10} rx={2} fill={C.bg} />
      )),
    )}
  </svg>
);
