import React from "react";
import { C, GLOW, type } from "../theme";

export type BoxVariant = "normal" | "active" | "dim";

export const OutlineBox: React.FC<{
  label: string;
  variant?: BoxVariant;
  width?: number;
  height?: number;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({ label, variant = "normal", width = 440, height = 90, fontSize = 30, style }) => {
  const dim = variant === "dim";
  const color = dim ? C.dim : C.white;
  const ls = type.label.letterSpacing;
  return (
    <div
      style={{
        width,
        height,
        boxSizing: "border-box",
        border: `3px ${dim ? "dashed" : "solid"} ${color}`,
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color,
        ...type.label,
        fontSize,
        paddingLeft: ls,
        filter: variant === "active" ? GLOW : undefined,
        background: variant === "active" ? "rgba(255,255,255,0.04)" : "transparent",
        ...style,
      }}
    >
      {label}
    </div>
  );
};
