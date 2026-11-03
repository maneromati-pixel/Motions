import React from "react";
import { C, GLOW, SAFE, type } from "../theme";

type Variant = keyof typeof type;

/**
 * Texto centrado en x=540 (zona segura). Compensa el letter-spacing final
 * para que el bloque quede ópticamente centrado.
 */
export const Text: React.FC<{
  children: React.ReactNode;
  variant?: Variant;
  y: number;
  color?: string;
  glow?: boolean;
  size?: number;
  width?: number;
  lineHeight?: number;
  style?: React.CSSProperties;
}> = ({
  children,
  variant = "title",
  y,
  color = C.ink,
  glow = false,
  size,
  width = SAFE.maxCenteredWidth,
  lineHeight = 1.45,
  style,
}) => {
  const base = type[variant];
  const ls = base.letterSpacing;
  return (
    <div
      style={{
        position: "absolute",
        left: 540 - width / 2,
        top: y,
        width,
        textAlign: "center",
        color,
        lineHeight,
        ...base,
        ...(size ? { fontSize: size } : {}),
        ...(color ? { color } : {}),
        // compensa el espacio que deja el letter-spacing después de la última letra
        paddingLeft: ls === "normal" ? 0 : ls,
        boxSizing: "border-box",
        filter: glow ? GLOW : undefined,
        whiteSpace: "pre-line",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Título de escena: arriba (~y=230), centrado. */
export const Title: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  size?: number;
}> = ({ children, style, size }) => (
  <Text variant="title" y={SAFE.titleY - 25} glow size={size} style={style}>
    {children}
  </Text>
);
