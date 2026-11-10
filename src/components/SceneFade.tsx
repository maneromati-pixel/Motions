import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { prog } from "./anim";

/** Fundido de entrada/salida de una escena (la Sequence ya incluye el solapamiento). */
export const SceneFade: React.FC<{
  children: React.ReactNode;
  fadeIn: number;
  fadeOut: number;
}> = ({ children, fadeIn, fadeOut }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const o =
    (fadeIn > 0 ? prog(frame, 0, fadeIn) : 1) *
    (fadeOut > 0 ? 1 - prog(frame, durationInFrames - fadeOut, durationInFrames) : 1);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
