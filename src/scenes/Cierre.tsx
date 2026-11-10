import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, TEXTS, TIMING } from "../config";
import { clamp01, easeInOut, prog, softSpring } from "../components/anim";
import { floatPos, makeParticles } from "../components/particles";
import { MaterialDefs, Sphere } from "../components/Materials";
import { RealObject } from "../components/RealObject";

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
  const titleY = interpolate(toTop, [0, 1], [960, 330]);
  const titleScale = interpolate(toTop, [0, 1], [1, 0.7]);

  const card = softSpring(frame, fps, T.tarjeta * fps + 6, 30);
  const caps = softSpring(frame, fps, T.eslogan * fps + 6, 34);
  const contact = prog(frame, T.contacto * fps, T.contacto * fps + 18);
  const slogan = prog(frame, T.eslogan * fps, T.eslogan * fps + 18);

  return (
    <AbsoluteFill>
      {/* partículas residuales que se desvanecen al paso del haz */}
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <MaterialDefs />
        {PARTS.map((p, i) => {
          const { x, y } = floatPos(p, t + 5);
          const u = x + 0.6 * y;
          const gone = clamp01((beamU - u + 60) / 220);
          return (
            <Sphere key={i} cx={x} cy={y} r={p.r * (1 - gone * 0.7)} kind="grey" opacity={(0.35 + 0.35 * p.depth) * (1 - gone) * prog(frame, 0, 8)} />
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
          left: 80,
          width: 920,
          top: 450,
          padding: "50px 44px",
          borderRadius: 40,
          background: COLORS.crema,
          boxShadow: "0 30px 70px rgba(30,2,4,0.45)",
          opacity: card,
          transform: `translateY(${(1 - card) * 60}px) scale(${0.95 + 0.05 * card})`,
        }}
      >
        {/* logo PNG original de Alquimia, a todo color */}
        <Img src={staticFile("img/logo_color.png")} style={{ width: 832, display: "block" }} />
      </div>

      {/* eslogan de Alquimia */}
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 905,
          transform: `translateY(-50%) translateY(${(1 - slogan) * 24}px)`,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 66,
          letterSpacing: -0.5,
          color: COLORS.crema,
          opacity: slogan,
          filter: `blur(${(1 - slogan) * 6}px)`,
          textShadow: "0 2px 24px rgba(40,4,6,0.4)",
        }}
      >
        {TEXTS.eslogan}
      </div>

      {/* cápsula al lado (debajo de la tarjeta en formato vertical) */}
      <RealObject
        kind="capsula"
        width={440}
        x={540}
        y={1170 + (1 - caps) * 80}
        opacity={caps}
        rotate={interpolate(caps, [0, 1], [-16, -6])}
        tiltX={interpolate(caps, [0, 1], [30, 10])}
        tiltY={-8 + Math.sin(frame / 30) * 3}
        sheen={prog(frame, T.eslogan * fps + 20, T.eslogan * fps + 60)}
      />

      {/* contacto (editable) */}
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 1445,
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
