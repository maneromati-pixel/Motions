import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, TEXTS } from "../config";
import { Title } from "../components/Text";
import { floatPos, makeParticles } from "../components/particles";
import { prog } from "../components/anim";

const PARTS = makeParticles("gancho", 70, { x0: 30, x1: 1050, y0: 260, y1: 1620 }, 3, 13);

/** 1. Gancho: partículas grises flotando + "¿Agua turbia aunque filtrás?" */
export const Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <filter id="g-blur">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        </defs>
        {PARTS.map((p, i) => {
          const { x, y } = floatPos(p, t + 3);
          const appear = prog(frame, (p.k * 18) | 0, ((p.k * 18) | 0) + 20);
          // las partículas cerca del texto se atenúan un poco para no competir con él
          const nearText = Math.max(0, 1 - Math.abs(y - 960) / 220) * 0.45;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={p.r}
              fill={COLORS.gris}
              opacity={(0.35 + 0.45 * p.depth) * appear * (1 - nearText)}
              filter={p.depth < 0.35 ? "url(#g-blur)" : undefined}
            />
          );
        })}
      </svg>
      <Title y={960} size={96} inAt={8}>
        {TEXTS.gancho}
      </Title>
    </AbsoluteFill>
  );
};
