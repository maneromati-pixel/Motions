import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../theme";

export const Background: React.FC<{ variant?: "dark" | "night" }> = ({
  variant = "dark",
}) => {
  if (variant === "night") {
    return (
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${C.nightTop} 0%, ${C.nightBottom} 100%)`,
        }}
      />
    );
  }
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        backgroundImage: `radial-gradient(ellipse 75% 60% at 50% 42%, ${C.bgCenter} 0%, ${C.bg} 55%, ${C.bgEdge} 100%)`,
      }}
    />
  );
};
