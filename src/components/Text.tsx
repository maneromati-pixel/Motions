import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT } from "../config";
import { prog } from "./anim";

type Props = {
  children: React.ReactNode;
  /** centro vertical del bloque de texto (px) */
  y: number;
  size?: number;
  weight?: 400 | 600;
  color?: string;
  /** frame de entrada y salida (relativos a la escena) */
  inAt?: number;
  outAt?: number;
  maxWidth?: number;
  opacity?: number;
  lineHeight?: number;
  letterSpacing?: number;
};

/** Texto centrado (margen lateral 90 px), entra subiendo con fade y sale con fade. */
export const Title: React.FC<Props> = ({
  children,
  y,
  size = 88,
  weight = 600,
  color = COLORS.crema,
  inAt = 0,
  outAt,
  maxWidth = 900,
  opacity = 1,
  lineHeight = 1.15,
  letterSpacing = -0.5,
}) => {
  const frame = useCurrentFrame();
  const pIn = prog(frame, inAt, inAt + 18);
  const pOut = outAt === undefined ? 0 : prog(frame, outAt, outAt + 12);
  const o = pIn * (1 - pOut) * opacity;
  const dy = (1 - pIn) * 28 - pOut * 16;
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        top: y,
        transform: `translateY(calc(-50% + ${dy}px))`,
        display: "flex",
        justifyContent: "center",
        opacity: o,
        filter: `blur(${(1 - pIn) * 6}px)`,
      }}
    >
      <div
        style={{
          maxWidth,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: weight,
          fontSize: size,
          lineHeight,
          letterSpacing,
          color,
          textWrap: "balance",
          textShadow: "0 2px 24px rgba(40,4,6,0.35)",
        }}
      >
        {children}
      </div>
    </div>
  );
};
