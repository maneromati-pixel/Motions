import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, TEXTS, TIMING } from "../config";
import { Title } from "../components/Text";
import { prog } from "../components/anim";
import { IconFiltradoCompleto, IconFiltroEnMarcha, IconProps } from "../icons/LineIcons";
import { StepDestapar, StepSkimmer } from "../icons/PhotoSteps";

// pasos 2 y 3 con las fotos reales del producto
const ICONS: React.FC<IconProps>[] = [IconFiltroEnMarcha, StepDestapar, StepSkimmer, IconFiltradoCompleto];
const IC = TIMING.iconos;
const T = TIMING.comoSeUsa;

/** 6. Cómo se usa: 4 pasos numerados, uno por vez, con dosis y nota al pie. */
export const ComoSeUsa: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const starts = T.pasos.map((x) => Math.round(x * fps));
  const current = starts.reduce((acc, st, i) => (frame >= st ? i : acc), 0);
  const [dosisA, dosisB] = TEXTS.dosis.split(" · ");

  return (
    <AbsoluteFill>
      {/* indicador de pasos numerados */}
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 34,
          opacity: prog(frame, starts[0], starts[0] + 14),
        }}
      >
        {TEXTS.pasos.map((_, i) => {
          const on = prog(frame, starts[i], starts[i] + 10);
          const active = i === current;
          return (
            <div
              key={i}
              style={{
                width: 68,
                height: 68,
                borderRadius: 34,
                border: `3px solid rgba(250,244,235,${0.35 + 0.65 * on})`,
                background: active ? `rgba(250,244,235,${on})` : "transparent",
                color: active ? COLORS.bordo : `rgba(250,244,235,${0.45 + 0.55 * on})`,
                fontFamily: FONT,
                fontWeight: 600,
                fontSize: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {i + 1}
            </div>
          );
        })}
      </div>

      {TEXTS.pasos.map((txt, i) => {
        const start = starts[i];
        const end = i < starts.length - 1 ? starts[i + 1] : Infinity;
        if (frame < start - 8 || frame > end + 4) return null;
        const inP = prog(frame, start - 6, start + 10);
        const outP = end === Infinity ? 0 : prog(frame, end - 8, end + 3);
        const Icon = ICONS[i];
        return (
          <AbsoluteFill key={i}>
            <div
              style={{
                position: "absolute",
                left: 540 - 240,
                top: 400,
                width: 480,
                height: 480,
                opacity: inP * (1 - outP),
                transform: `translateY(${(1 - inP) * 26 - outP * 18}px)`,
              }}
            >
              <Icon draw={prog(frame, start, start + IC.dibujo * fps)} anim={prog(frame, start + IC.accion[0] * fps, start + IC.accion[1] * fps)} frame={frame - start} size={480} />
            </div>
            <Title y={995} size={72} inAt={start} outAt={end === Infinity ? undefined : end - 10} maxWidth={860}>
              {txt}
            </Title>
          </AbsoluteFill>
        );
      })}

      {/* filete separador */}
      <div
        style={{
          position: "absolute",
          top: 1125,
          left: 540 - 70,
          width: 140,
          height: 3,
          borderRadius: 2,
          background: COLORS.azulGel,
          opacity: prog(frame, T.dosis * fps, T.dosis * fps + 14),
        }}
      />
      <Title y={1240} size={54} weight={600} inAt={T.dosis * fps} maxWidth={900} lineHeight={1.3}>
        {dosisA}
        <br />
        <span style={{ fontWeight: 400 }}>{dosisB}</span>
      </Title>
      <Title y={1450} size={50} weight={400} inAt={T.nota * fps} opacity={0.75} maxWidth={860} letterSpacing={0} lineHeight={1.3}>
        {TEXTS.notaAlternativa}
      </Title>
    </AbsoluteFill>
  );
};
