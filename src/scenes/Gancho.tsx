import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, TEXTS, TIMING } from "../config";
import { floatPos, makeParticles } from "../components/particles";
import { easeOut, lerp, prog } from "../components/anim";
import { MaterialDefs, Sphere } from "../components/Materials";

const T = TIMING.gancho;
const PARTS = makeParticles("gancho", 90, { x0: 30, x1: 1050, y0: 260, y1: 1620 }, 3, 14);

/** Una palabra que sube desde una máscara, con desenfoque que se aclara. */
const Word: React.FC<{ children: string; at: number; style?: React.CSSProperties }> = ({ children, at, style }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, at + 14, easeOut);
  return (
    <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", padding: "0 0.12em 0.12em" }}>
      <span
        style={{
          display: "inline-block",
          transform: `translateY(${(1 - p) * 110}%)`,
          opacity: p,
          filter: `blur(${(1 - p) * 8}px)`,
          ...style,
        }}
      >
        {children}
      </span>
    </span>
  );
};

/** 1. Hook: estallido de partículas + "¿El agua de tu pileta está turbia?" palabra por palabra. */
export const Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // estallido inicial: las partículas salen del centro y luego flotan
  const burst = prog(t, T.estallido[0], T.estallido[1], easeOut);
  // golpe de énfasis: leve zoom del texto y oscurecimiento del agua
  const punch = prog(frame, T.golpe * fps, T.golpe * fps + 10) * (1 - prog(frame, T.golpe * fps + 10, T.golpe * fps + 40));
  const zoom = interpolate(frame, [0, 4 * fps], [1, 1.05]) + punch * 0.04;

  // ondulación tipo agua para la palabra destacada
  const wave = 10 + Math.sin(frame / 5) * 4;

  const [l1, l2] = TEXTS.gancho;
  const words1 = l1.split(" ");
  const words2 = l2.split(" ");
  const start = T.palabras * fps;
  const step = T.entrePalabras * fps;
  const lastAt = start + (words1.length + words2.length - 1) * step;

  return (
    <AbsoluteFill>
      {/* filtro SVG de agua turbia (ondulación) usado por la palabra destacada */}
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id="agua-turbia" x="-10%" y="-20%" width="120%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.045" numOctaves={2} seed={Math.floor(frame / 2) % 50} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={wave} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* velo turbio que se aclara un poco al entrar el texto */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 80% 55% at 50% 50%, rgba(180,165,160,0.16) 0%, rgba(180,165,160,0) 70%)",
          opacity: 0.6 + punch * 0.4,
        }}
      />

      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <MaterialDefs />
        {PARTS.map((p, i) => {
          const f = floatPos(p, t + 3);
          // desde el centro hacia su posición
          const x = lerp(540 + (p.x - 540) * 0.08, f.x, burst);
          const y = lerp(960 + (p.y - 960) * 0.08, f.y, burst);
          const nearText = Math.max(0, 1 - Math.abs(y - 960) / 260) * 0.5;
          return (
            <Sphere
              key={i}
              cx={x}
              cy={y}
              r={p.r * (0.5 + 0.5 * burst)}
              kind="grey"
              opacity={(0.5 + 0.5 * p.depth) * (1 - nearText) * prog(frame, 0, 3)}
              blur={p.depth < 0.35 || burst < 0.6}
            />
          );
        })}
      </svg>

      {/* ondas de agua que se expanden cuando aparece "turbia?" */}
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {[0, 1, 2].map((k) => {
          const r = prog(frame, lastAt + 4 + k * 7, lastAt + 46 + k * 7, easeOut);
          return (
            <ellipse
              key={k}
              cx={540}
              cy={1000}
              rx={140 + r * 480}
              ry={40 + r * 140}
              fill="none"
              stroke={COLORS.crema}
              strokeWidth={3 - k * 0.6}
              opacity={r > 0 ? (1 - r) * 0.5 : 0}
            />
          );
        })}
      </svg>

      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 960,
          transform: `translateY(-50%) scale(${zoom})`,
          textAlign: "center",
          fontFamily: FONT,
          color: COLORS.crema,
          textShadow: "0 4px 30px rgba(40,4,6,0.55)",
        }}
      >
        <div style={{ fontSize: 76, fontWeight: 400, lineHeight: 1.1, letterSpacing: -0.5 }}>
          {words1.map((w, i) => (
            <Word key={i} at={start + i * step}>
              {w}
            </Word>
          ))}
        </div>
        <div style={{ fontSize: 132, fontWeight: 600, lineHeight: 1.05, letterSpacing: -2, marginTop: 6 }}>
          {words2.map((w, i) => {
            const at = start + (words1.length + i) * step;
            const hot = w === TEXTS.ganchoDestacada;
            return (
              <Word
                key={i}
                at={at}
                style={
                  hot
                    ? {
                        filter: "url(#agua-turbia)",
                        // "turbia": crema veteada de gris, como agua sucia
                        backgroundImage: `linear-gradient(${100 + Math.sin(frame / 12) * 20}deg, ${COLORS.crema} 0%, #CFC3BE 35%, ${COLORS.crema} 55%, #B8ACA8 85%)`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        textShadow: "none",
                      }
                    : undefined
                }
              >
                {w}
              </Word>
            );
          })}
        </div>
        {/* subrayado rojo mínimo bajo la palabra clave */}
        <div
          style={{
            margin: "18px auto 0",
            width: 120 * prog(frame, lastAt + 8, lastAt + 24),
            height: 6,
            borderRadius: 3,
            background: COLORS.rojo,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
