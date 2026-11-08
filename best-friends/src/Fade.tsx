import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { T } from "./timing";

export const Fade: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        pointerEvents: "none",
        opacity: interpolate(frame, [T.fadeIn[0], T.fadeIn[1], T.fadeOut[0], T.fadeOut[1]], [1, 0, 0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    />
  );
};
