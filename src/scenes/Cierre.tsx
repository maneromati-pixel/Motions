import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, TEXTS, TIMING } from "../config";
import { clamp01, easeInOut, prog, softSpring } from "../components/anim";
import { floatPos, makeParticles } from "../components/particles";

const T = TIMING.cierre;
const PARTS = makeParticles("cierre", 40, { x0: 40, x1: 1040, y0: 280, y1: 1600 }, 3, 9);

/** 7. Cierre: las partículas desaparecen con un haz de luz, título, tarjeta con logo + cápsula y contacto. */
export const Cierre: React.FC<{ contacto: string }> = ({ contacto }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // haz de luz diagonal: coordenada u = x + 0.6·y recorre la pantalla
  const beam = prog(t, T.haz[0], T.haz[1], easeInOut);
  const uMax = 1080 + 0.6 * 1920;
  const beamU = interpolate(beam, [0, 1], [-500, uMax + 500]);

  const titleIn = prog(frame, T.titulo * fps, T.titulo * fps + 18);
  const toTop = softSpring(frame, fps, T.tarjeta * fps, 30);
  const titleY = interpolate(toTop, [0, 1], [960, 380]);
  const titleScale = interpolate(toTop, [0, 1], [1, 0.74]);

  const card = softSpring(frame, fps, T.tarjeta * fps + 6, 30);
  const caps = softSpring(frame, fps, T.tarjeta * fps + 14, 34);
  const contact = prog(frame, T.tarjeta * fps + 24, T.tarjeta * fps + 42);

  return (
    <AbsoluteFill>
      {/* partículas residuales que se desvanecen al paso del haz */}
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {PARTS.map((p, i) => {
          const { x, y } = floatPos(p, t + 5);
          const u = x + 0.6 * y;
          const gone = clamp01((beamU - u + 60) / 220);
          return (
            <circle key={i} cx={x} cy={y} r={p.r * (1 - gone * 0.7)} fill={COLORS.gris} opacity={(0.25 + 0.3 * p.depth) * (1 - gone) * prog(frame, 0, 8)} />
          );
        })}
      </svg>

      {/* haz de luz que cruza la pantalla */}
      <AbsoluteFill style={{ mixBlendMode: "screen", opacity: Math.sin(beam * Math.PI) * 0.9 }}>
        <div
          style={{
            position: "absolute",
            left: -1200,
            top: -400,
            width: 3600,
            height: 2800,
            background:
              "linear-gradient(120deg, rgba(255,230,215,0) 40%, rgba(255,230,215,0.45) 48%, rgba(255,245,235,0.7) 50%, rgba(255,230,215,0.45) 52%, rgba(255,230,215,0) 60%)",
            transform: `translateX(${interpolate(beam, [0, 1], [-1400, 1400])}px)`,
            filter: "blur(30px)",
          }}
        />
      </AbsoluteFill>
      {/* luminosidad general tras el haz */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 80% 55% at 50% 45%, rgba(255,232,220,0.22) 0%, rgba(255,232,220,0) 70%)",
          opacity: beam,
        }}
      />

      {/* título */}
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: titleY,
          transform: `translateY(-50%) translateY(${(1 - titleIn) * 28}px) scale(${titleScale})`,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 96,
          lineHeight: 1.12,
          letterSpacing: -0.5,
          color: COLORS.crema,
          opacity: titleIn,
          filter: `blur(${(1 - titleIn) * 6}px)`,
          textWrap: "balance",
          textShadow: "0 2px 24px rgba(40,4,6,0.35)",
        }}
      >
        {TEXTS.cierre}
      </div>

      {/* tarjeta crema con el logo a todo color */}
      <div
        style={{
          position: "absolute",
          left: 100,
          width: 880,
          top: 560,
          padding: "56px 50px",
          borderRadius: 40,
          background: COLORS.crema,
          boxShadow: "0 30px 70px rgba(30,2,4,0.45)",
          opacity: card,
          transform: `translateY(${(1 - card) * 60}px) scale(${0.95 + 0.05 * card})`,
        }}
      >
        <Img src={staticFile("img/logo_color.png")} style={{ width: 780, display: "block" }} />
      </div>

      {/* cápsula al lado (debajo de la tarjeta en formato vertical) */}
      <Img
        src={staticFile("img/capsula.png")}
        style={{
          position: "absolute",
          width: 460,
          left: 540 - 230,
          top: 1150 - 228,
          opacity: caps,
          transform: `translateY(${(1 - caps) * 80}px) rotate(${interpolate(caps, [0, 1], [-16, -6])}deg)`,
        }}
      />

      {/* contacto (editable) */}
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 1440,
          transform: `translateY(-50%) translateY(${(1 - contact) * 20}px)`,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 58,
          letterSpacing: 0.5,
          color: COLORS.crema,
          opacity: contact,
        }}
      >
        {contacto}
      </div>
    </AbsoluteFill>
  );
};
