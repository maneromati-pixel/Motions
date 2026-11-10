import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, TEXTS, TIMING } from "../config";
import { Title } from "../components/Text";
import { prog } from "../components/anim";
import { IconFilterLayers, IconNoAgota, IconProps } from "../icons/LineIcons";

const ICONS: React.FC<IconProps>[] = [IconFilterLayers, IconNoAgota];

/** Beneficios: íconos con volumen, uno por vez. */
export const Beneficios: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const per = Math.round(TIMING.beneficios.porItem * fps);
  const t0 = Math.round(TIMING.beneficios.inicio * fps);
  return (
    <AbsoluteFill>
      {TEXTS.beneficios.map((txt, i) => {
        const start = t0 + i * per;
        const end = t0 + (i + 1) * per;
        const last = i === TEXTS.beneficios.length - 1;
        const local = frame - start;
        if (frame < start - 8 || (!last && frame > end + 4)) return null;
        const inP = prog(frame, start - 6, start + 12);
        const outP = last ? 0 : prog(frame, end - 8, end + 3);
        const Icon = ICONS[i];
        return (
          <AbsoluteFill key={i}>
            <div
              style={{
                position: "absolute",
                left: 540 - 260,
                top: 500,
                width: 520,
                height: 520,
                opacity: inP * (1 - outP),
                transform: `translateY(${(1 - inP) * 30 - outP * 20}px) scale(${0.94 + 0.06 * inP})`,
              }}
            >
              <Icon draw={prog(frame, start, start + TIMING.iconos.dibujo * fps)} anim={prog(frame, start + TIMING.iconos.accion[0] * fps, start + TIMING.iconos.accion[1] * fps)} frame={local} size={520} />
            </div>
            <Title y={1200} size={70} inAt={start} outAt={last ? undefined : end - 10} maxWidth={860}>
              {txt}
            </Title>
          </AbsoluteFill>
        );
      })}
      {/* indicador 1/3 — el activo en rojo (detalle mínimo) */}
      <div style={{ position: "absolute", top: 1420, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 22, opacity: prog(frame, t0, t0 + 14) }}>
        {TEXTS.beneficios.map((_, i) => {
          const active = frame >= t0 + i * per && (frame < t0 + (i + 1) * per || i === TEXTS.beneficios.length - 1);
          return (
            <div
              key={i}
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                background: active ? COLORS.rojo : "rgba(250,244,235,0.35)",
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
