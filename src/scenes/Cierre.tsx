import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, TEXTS, TIMING } from "../config";
import { clamp01, easeInOut, prog, softSpring } from "../components/anim";
import { floatPos, makeParticles } from "../components/particles";
import { MaterialDefs, Sphere } from "../components/Materials";
import { RealObject } from "../components/RealObject";
import type { ContactProps } from "../Video";

const T = TIMING.cierre;
const PARTS = makeParticles("cierre", 40, { x0: 40, x1: 1040, y0: 280, y1: 1600 }, 3, 9);

/** Línea de texto del cierre que entra con fade, subida y desenfoque. */
const Line: React.FC<{ y: number; p: number; size: number; weight?: 400 | 600; children: React.ReactNode; opacity?: number }> = ({
  y,
  p,
  size,
  weight = 600,
  children,
  opacity = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: 90,
      right: 90,
      top: y,
      transform: `translateY(-50%) translateY(${(1 - p) * 22}px)`,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 18,
      fontFamily: FONT,
      fontWeight: weight,
      fontSize: size,
      letterSpacing: -0.3,
      color: COLORS.crema,
      opacity: p * opacity,
      filter: `blur(${(1 - p) * 6}px)`,
      textShadow: "0 2px 24px rgba(40,4,6,0.4)",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

/** Ícono de línea de Instagram (genérico: cámara redondeada). */
const IgIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={COLORS.crema} strokeWidth={3.6}>
    <rect x={5} y={5} width={38} height={38} rx={11} />
    <circle cx={24} cy={24} r={9} />
    <circle cx={35} cy={13} r={1.6} fill={COLORS.crema} stroke="none" />
  </svg>
);

/** Ícono de línea de teléfono (auricular). */
const PhoneIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={COLORS.crema} strokeWidth={3.6} strokeLinejoin="round">
    <path d="M14 6 L20 6 L23 15 L18 19 Q22 27 29 30 L33 25 L42 28 L42 34 Q42 42 34 42 Q8 38 6 14 Q6 6 14 6 Z" />
  </svg>
);

/** 6. Cierre: haz de luz que limpia las últimas partículas, logo, eslogan, cápsula y contacto. */
export const Cierre: React.FC<ContactProps> = ({ telefono, instagram }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // haz de luz diagonal: coordenada u = x + 0.6·y recorre la pantalla
  const beam = prog(t, T.haz[0], T.haz[1], easeInOut);
  const uMax = 1080 + 0.6 * 1920;
  const beamU = interpolate(beam, [0, 1], [-500, uMax + 500]);

  const card = softSpring(frame, fps, T.tarjeta * fps, 30);
  const slogan = prog(frame, T.eslogan * fps, T.eslogan * fps + 18);
  const caps = softSpring(frame, fps, T.eslogan * fps + 6, 34);
  const [c1, c2, c3] = T.contacto.map((c) => prog(frame, c * fps, c * fps + 16));

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
          background: "radial-gradient(ellipse 80% 55% at 50% 40%, rgba(255,232,220,0.22) 0%, rgba(255,232,220,0) 70%)",
          opacity: beam,
        }}
      />

      {/* tarjeta crema con el logo PNG original de Alquimia, a todo color */}
      <div
        style={{
          position: "absolute",
          left: 80,
          width: 920,
          top: 300,
          padding: "50px 44px",
          borderRadius: 40,
          background: COLORS.crema,
          boxShadow: "0 30px 70px rgba(30,2,4,0.45)",
          opacity: card,
          transform: `translateY(${(1 - card) * 60}px) scale(${0.95 + 0.05 * card})`,
        }}
      >
        <Img src={staticFile("img/logo_color.png")} style={{ width: 832, display: "block" }} />
      </div>

      {/* eslogan */}
      <Line y={760} p={slogan} size={68}>
        {TEXTS.eslogan}
      </Line>

      {/* cápsula */}
      <RealObject
        kind="capsula"
        width={380}
        x={540}
        y={1000 + (1 - caps) * 70}
        opacity={caps}
        rotate={interpolate(caps, [0, 1], [-16, -6])}
        tiltX={interpolate(caps, [0, 1], [30, 10])}
        tiltY={-8 + Math.sin(frame / 30) * 3}
        sheen={prog(frame, T.eslogan * fps + 20, T.eslogan * fps + 60)}
      />

      {/* contacto */}
      <Line y={1225} p={c1} size={58}>
        <PhoneIcon size={52} />
        <span>
          <span style={{ fontWeight: 400 }}>{TEXTS.contactoLlamado} </span>
          {telefono}
        </span>
      </Line>
      <Line y={1305} p={c2} size={54} weight={400} opacity={0.9}>
        {TEXTS.contactoLocal}
      </Line>
      {/* punto rojo mínimo */}
      <div
        style={{
          position: "absolute",
          left: 540 - 7,
          top: 1366,
          width: 14,
          height: 14,
          borderRadius: 7,
          background: COLORS.rojo,
          opacity: c3,
        }}
      />
      <Line y={1450} p={c3} size={62}>
        <IgIcon size={58} />
        {instagram}
      </Line>
    </AbsoluteFill>
  );
};
