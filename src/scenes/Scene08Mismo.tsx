import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { Arrow } from "../components/Arrow";
import { OutlineBox } from "../components/OutlineBox";
import { Ground } from "../components/Ground";
import { PersonIcon } from "../components/PersonIcon";
import { Spotlight } from "../components/Spotlight";
import { Scene } from "../components/Scene";
import { Title } from "../components/Text";
import { C, enter, GLOW, pop, progress, type } from "../theme";
import { BEATS, SCENES, STAGGER } from "../timing";

const B = BEATS.mismo;
const LEFT_X = 300;
const RIGHT_X = 700;
const LINE_Y = 640;
const W = 260;
const H = 64;

const Flow: React.FC<{ cx: number; steps: string[]; dim: number; frame: number }> = ({ cx, steps, dim, frame }) => {
  const color = interpolateColors(dim, [0, 1], [C.white, C.dim]);
  return (
    <>
      {steps.map((s, i) => {
        const e = enter(frame, B.flows + i * STAGGER);
        const top = LINE_Y + 70 + i * (H + 56);
        return (
          <React.Fragment key={s}>
            <div
              style={{
                position: "absolute",
                left: cx - W / 2,
                top,
                opacity: e.opacity,
                transform: e.transform,
              }}
            >
              <OutlineBox
                label={s}
                width={W}
                height={H}
                fontSize={20}
                variant={dim > 0.5 ? "dim" : i === 1 && steps[1] === "AHORRO" ? "active" : "normal"}
                style={{ borderColor: color, color, filter: dim > 0.5 ? undefined : i === 1 && steps[1] === "AHORRO" ? GLOW : undefined }}
              />
            </div>
            {i < steps.length - 1 && (
              <div style={{ position: "absolute", left: cx - 12, top: top + H + 8 }}>
                <Arrow length={40} color={color} progress={progress(frame, B.flows + i * STAGGER + 6, B.flows + i * STAGGER + 14)} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export const Scene08Mismo: React.FC = () => {
  const frame = useCurrentFrame();
  const t = enter(frame, B.title);
  const line = progress(frame, B.line, B.line + 14);
  const dim = progress(frame, B.dimLeft, B.dimLeft + 14);
  const pl = pop(frame, B.people);
  const pr = pop(frame, B.people + STAGGER);
  const leftColor = interpolateColors(dim, [0, 1], [C.white, C.dim]);
  return (
    <Scene duration={SCENES.mismo}>
      <div style={{ opacity: t.opacity, transform: t.transform }}>
        <Title>MISMO SUELDO</Title>
      </div>

      {/* después, la luz queda solo sobre el de la derecha */}
      <Spotlight cx={LEFT_X} top={330} bottom={LINE_Y} width={240} intensity={0.8 * pl.opacity * (1 - dim)} />
      <Spotlight cx={RIGHT_X} top={330} bottom={LINE_Y} width={240} intensity={pr.opacity * (0.8 + 0.2 * dim)} />
      <Ground y={LINE_Y} x1={160} x2={920} progress={line} />

      <div style={{ position: "absolute", left: LEFT_X - 55, top: LINE_Y - 126.5, opacity: pl.opacity, transform: pl.transform }}>
        <PersonIcon size={110} color={leftColor} glow={dim < 0.5} halo={0.6 * (1 - dim)} />
      </div>
      <div style={{ position: "absolute", left: RIGHT_X - 55, top: LINE_Y - 126.5, opacity: pr.opacity, transform: pr.transform }}>
        <PersonIcon size={110} glow halo={0.6 + 0.4 * dim} />
      </div>

      <Flow cx={LEFT_X} steps={["INGRESO", "GASTOS", "AHORRO"]} dim={dim} frame={frame} />
      <Flow cx={RIGHT_X} steps={["INGRESO", "AHORRO", "GASTOS"]} dim={0} frame={frame} />

      <div
        style={{
          position: "absolute",
          top: LINE_Y + 70 + 3 * (H + 56) - 10,
          left: 0,
          width: 1080,
          ...type.micro,
          opacity: progress(frame, B.dimLeft + 10, B.dimLeft + 22),
        }}
      >
        <div style={{ position: "absolute", left: LEFT_X - 150, width: 300, textAlign: "center", color: C.dim }}>NO QUEDA NADA</div>
        <div style={{ position: "absolute", left: RIGHT_X - 150, width: 300, textAlign: "center", color: C.white, filter: GLOW }}>
          SIEMPRE QUEDA
        </div>
      </div>
    </Scene>
  );
};
