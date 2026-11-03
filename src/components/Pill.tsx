import React from "react";
import { C, fontFamily, GLOW } from "../theme";

/** Etiqueta tipo burbuja: píldora blanca con texto negro en mayúsculas. */
export const Pill: React.FC<{ text: string; fontSize?: number; style?: React.CSSProperties }> = ({
  text,
  fontSize = 20,
  style,
}) => (
  <div
    style={{
      display: "inline-block",
      background: C.white,
      color: C.black,
      borderRadius: 999,
      padding: `${fontSize * 0.6}px ${fontSize * 1.1}px ${fontSize * 0.6}px ${fontSize * 1.1 + fontSize * 0.25}px`,
      fontFamily,
      fontWeight: 600,
      fontSize,
      letterSpacing: "0.25em",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      filter: GLOW,
      ...style,
    }}
  >
    {text}
  </div>
);
