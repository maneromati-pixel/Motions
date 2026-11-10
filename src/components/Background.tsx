import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * Fondo institucional: fondo.jpg en modo cover (alto 1920, centrado, recorta costados).
 * Zoom lento 1.00 → 1.06 y haces de luz que se desplazan levemente. Nada más se mueve.
 */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const t = frame / durationInFrames;
  const zoom = interpolate(t, [0, 1], [1, 1.06]);
  // fondo.jpg es 1122×1402 → alto 1920 = ancho 1536.6
  const imgW = (1122 / 1402) * height;
  // haces: deriva diagonal suave (como sol que entra por una ventana)
  const drift = Math.sin(t * Math.PI * 1.2) * 40 + t * 50;
  const breathe = 0.85 + 0.15 * Math.sin(t * Math.PI * 2.4);

  return (
    <AbsoluteFill style={{ backgroundColor: "#6B1D20", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "50% 50%" }}>
        <Img
          src={staticFile("img/fondo.jpg")}
          style={{
            position: "absolute",
            height,
            width: imgW,
            left: (width - imgW) / 2,
            top: 0,
          }}
        />
      </AbsoluteFill>
      {/* haces de luz en movimiento: bandas diagonales en "screen" de baja opacidad */}
      <AbsoluteFill
        style={{
          mixBlendMode: "screen",
          opacity: 0.22 * breathe,
          transform: `translate(${drift}px, ${drift * 0.9}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -400,
            background:
              "repeating-linear-gradient(125deg, rgba(255,150,130,0) 0px, rgba(255,150,130,0) 120px, rgba(255,160,140,0.55) 190px, rgba(255,150,130,0) 270px, rgba(255,150,130,0) 420px)",
            filter: "blur(28px)",
            maskImage:
              "radial-gradient(ellipse 90% 70% at 15% 10%, black 0%, rgba(0,0,0,0.5) 45%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 70% at 15% 10%, black 0%, rgba(0,0,0,0.5) 45%, transparent 85%)",
          }}
        />
      </AbsoluteFill>
      {/* viñeta estática para contraste de textos */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 50%, rgba(0,0,0,0) 40%, rgba(40,4,6,0.45) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
