import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ars, ease, type } from "../theme";

/** Interpola un número a lo largo de keyframes (frames) con easing por tramo. */
export const countValue = (
  frame: number,
  frames: number[],
  values: number[],
  easing: (t: number) => number = ease,
) =>
  interpolate(frame, frames, values, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Número que cuenta animado. */
export const Counter: React.FC<{
  frames: number[];
  values: number[];
  format?: (n: number) => string;
  easing?: (t: number) => number;
  style?: React.CSSProperties;
}> = ({ frames, values, format = ars, easing, style }) => {
  const frame = useCurrentFrame();
  const v = countValue(frame, frames, values, easing);
  return (
    <span style={{ ...type.figure, fontVariantNumeric: "tabular-nums", ...style }}>
      {format(v)}
    </span>
  );
};
