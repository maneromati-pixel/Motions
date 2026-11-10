import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, TEXTS } from "../config";
import { Title } from "../components/Text";
import { prog, softSpring } from "../components/anim";

/** 3. Presentación: entra la cápsula con un leve giro y su sombra. */
export const Presentacion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = softSpring(frame, fps, 6, 40);
  const rot = interpolate(enter, [0, 1], [-18, -5]);
  const ty = interpolate(enter, [0, 1], [140, 0]);
  const sc = interpolate(enter, [0, 1], [0.86, 1]);
  const float = Math.sin(frame / 22) * 6;
  const glow = prog(frame, 16, 50);
  const size = 720; // capsula.png (635×627) incluye sombra
  const lineP = prog(frame, 34, 56);

  return (
    <AbsoluteFill>
      {/* halo tenue detrás del producto */}
      <div
        style={{
          position: "absolute",
          left: 540 - 380,
          top: 800 - 380,
          width: 760,
          height: 760,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,214,200,0.22) 0%, rgba(255,214,200,0) 65%)`,
          opacity: glow,
        }}
      />
      <Img
        src={staticFile("img/capsula.png")}
        style={{
          position: "absolute",
          width: size,
          left: 540 - size / 2,
          top: 800 - (size * 627) / 635 / 2 + ty + float,
          transform: `rotate(${rot}deg) scale(${sc})`,
          opacity: enter,
        }}
      />
      <Title y={1225} size={92} inAt={26} lineHeight={1.08}>
        {TEXTS.producto}
      </Title>
      {/* filete azul + subtítulo */}
      <div
        style={{
          position: "absolute",
          left: 540 - 60 * lineP,
          top: 1352,
          width: 120 * lineP,
          height: 4,
          borderRadius: 2,
          background: COLORS.azulGel,
        }}
      />
      <Title y={1420} size={58} weight={400} inAt={36} opacity={0.92}>
        {TEXTS.productoSub}
      </Title>
    </AbsoluteFill>
  );
};
