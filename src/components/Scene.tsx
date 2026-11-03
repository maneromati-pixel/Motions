import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SCENE_FADE } from "../timing";
import { Background } from "./Background";

/**
 * Contenedor de escena: fondo + contenido, con fundido a blanco (papel) de SCENE_FADE frames
 * al final. `fadeIn` opcional (nunca en la escena 1: el gancho se ve desde el frame 0).
 */
export const Scene: React.FC<{
  duration: number;
  children: React.ReactNode;
  /** el gancho dibuja su propio fondo con diagonales y billetes */
  diagonals?: boolean;
  fadeIn?: boolean;
  fadeOut?: boolean;
}> = ({ duration, children, diagonals = false, fadeIn = false, fadeOut = true }) => {
  const frame = useCurrentFrame();
  let opacity = 1;
  if (fadeOut) {
    opacity *= interpolate(frame, [duration - SCENE_FADE, duration], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }
  if (fadeIn) {
    opacity *= interpolate(frame, [0, SCENE_FADE], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }
  return (
    <AbsoluteFill style={{ opacity }}>
      <Background diagonals={diagonals} />
      {children}
    </AbsoluteFill>
  );
};
