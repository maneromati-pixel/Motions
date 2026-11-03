import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Ground } from "../components/Ground";
import { PersonIcon } from "../components/PersonIcon";
import { Pill } from "../components/Pill";
import { Scene } from "../components/Scene";
import { Text, Title } from "../components/Text";
import { C, enter, pop, progress } from "../theme";
import { BEATS, SCENES, STAGGER } from "../timing";

const B = BEATS.plan;
const GROUND_Y = 960;
const PERSON = 130;
const HEAD = { x: 540, y: GROUND_Y - PERSON * 1.15 + 20 };

/** Lo que te dicen las empresas: cada mensaje es un plan para tu plata. */
const PILLS: { text: string; x: number; y: number }[] = [
  { text: "12 MESES SIN INTERESES", x: 540, y: 400 },
  { text: "ENVÍO GRATIS", x: 330, y: 482 },
  { text: "PRE-APROBADO", x: 730, y: 482 },
  { text: "RENOVACIÓN AUTOMÁTICA", x: 540, y: 564 },
  { text: "SOLO POR HOY", x: 330, y: 646 },
  { text: "ÚLTIMAS UNIDADES", x: 720, y: 646 },
];

export const Scene05Plan: React.FC = () => {
  const frame = useCurrentFrame();
  const t = enter(frame, B.title);
  const person = enter(frame, B.person - 30);
  const ground = progress(frame, 0, 14);
  const t1 = enter(frame, B.text1);
  const t1Out = interpolate(frame, [B.text2 - 8, B.text2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t2 = pop(frame, B.text2);

  return (
    <Scene duration={SCENES.plan}>
      <div style={{ opacity: t.opacity, transform: t.transform }}>
        <Title>{"ELLOS PLANEAN\nTU DINERO"}</Title>
      </div>

      <Ground y={GROUND_Y} progress={ground} caption="TÚ" captionOpacity={person.opacity} />

      {/* hilos finos desde cada mensaje hasta la cabeza */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {PILLS.map((p, i) => {
          const k = progress(frame, B.lines + i * 4, B.lines + i * 4 + 14);
          return (
            <line
              key={i}
              x1={p.x}
              y1={p.y + 22}
              x2={p.x + (HEAD.x - p.x) * k}
              y2={p.y + 22 + (HEAD.y - p.y - 22) * k}
              stroke={C.gray}
              strokeWidth={1.5}
              strokeDasharray="3 7"
              opacity={0.7}
            />
          );
        })}
      </svg>

      <div style={{ position: "absolute", left: 540 - PERSON / 2, top: GROUND_Y - PERSON * 1.15, opacity: person.opacity, transform: person.transform }}>
        <PersonIcon size={PERSON} color={C.gray} halo={0.35} />
      </div>

      {PILLS.map((p, i) => {
        const e = pop(frame, B.companies + i * STAGGER);
        return (
          <div
            key={p.text}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              transform: `translateX(-50%) ${e.transform}`,
              opacity: e.opacity,
            }}
          >
            <Pill text={p.text} fontSize={19} />
          </div>
        );
      })}

      <Text variant="label" y={1080} glow style={{ opacity: t1.opacity * t1Out, transform: t1.transform }}>
        {"ELLOS SABEN CUÁNTO\nVAS A GASTAR"}
      </Text>
      <Text variant="figure" y={1070} size={110} glow style={{ opacity: t2.opacity, transform: t2.transform }}>
        TÚ NO
      </Text>
    </Scene>
  );
};
