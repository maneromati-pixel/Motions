import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CompanyIcon } from "../components/CompanyIcon";
import { PersonIcon } from "../components/PersonIcon";
import { Scene } from "../components/Scene";
import { Text, Title } from "../components/Text";
import { C, enter, pop, progress } from "../theme";
import { BEATS, SCENES, STAGGER } from "../timing";

const B = BEATS.plan;
const ICON = 96;
const GAP = 34;
const GROUP_X = 150; // 2 columnas × 3 filas
const GROUP_Y = 500;
const PERSON_X = 700;
const PERSON_SIZE = 120;
const PERSON_Y = 640;

export const Scene04Plan: React.FC = () => {
  const frame = useCurrentFrame();
  const t = enter(frame, B.title);
  const person = enter(frame, B.person);
  const t1 = enter(frame, B.text1);
  const t1Out = interpolate(frame, [B.text2 - 8, B.text2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t2 = pop(frame, B.text2);

  const icons = Array.from({ length: 6 }).map((_, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    return { x: GROUP_X + col * (ICON + GAP), y: GROUP_Y + row * (ICON + GAP), i };
  });

  const target = { x: PERSON_X + PERSON_SIZE / 2, y: PERSON_Y + PERSON_SIZE * 0.55 };

  return (
    <Scene duration={SCENES.plan}>
      <div style={{ opacity: t.opacity, transform: t.transform }}>
        <Title>{"ELLOS PLANEAN\nTU PLATA"}</Title>
      </div>

      {/* líneas: cada empresa "apunta" a la persona */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {icons.map(({ x, y, i }) => {
          const p = progress(frame, B.lines + i * 4, B.lines + i * 4 + 16);
          const x1 = x + ICON + 8;
          const y1 = y + ICON / 2;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x1 + (target.x - 70 - x1) * p}
              y2={y1 + (target.y - y1) * p}
              stroke={C.gray}
              strokeWidth={2}
              strokeDasharray="6 10"
              opacity={0.8 * Math.min(1, p * 3)}
            />
          );
        })}
      </svg>

      {icons.map(({ x, y, i }) => {
        const e = pop(frame, B.companies + i * STAGGER);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, opacity: e.opacity, transform: e.transform }}>
            <CompanyIcon size={ICON} />
          </div>
        );
      })}
      <Text variant="micro" y={GROUP_Y + 3 * (ICON + GAP) + 6} width={2 * ICON + GAP + 60} style={{ left: GROUP_X - 30, opacity: enter(frame, B.companies + 40).opacity }}>
        ELLOS
      </Text>

      <div style={{ position: "absolute", left: PERSON_X, top: PERSON_Y, opacity: person.opacity, transform: person.transform }}>
        <PersonIcon size={PERSON_SIZE} color={C.gray} />
      </div>
      <Text variant="micro" y={GROUP_Y + 3 * (ICON + GAP) + 6} width={220} style={{ left: PERSON_X + PERSON_SIZE / 2 - 110, opacity: person.opacity }}>
        VOS
      </Text>

      <Text variant="label" y={1060} glow style={{ opacity: t1.opacity * t1Out, transform: t1.transform }}>
        {"ELLOS SABEN CUÁNTO\nVAS A GASTAR"}
      </Text>
      <Text variant="figure" y={1050} size={110} glow style={{ opacity: t2.opacity, transform: t2.transform }}>
        VOS NO
      </Text>
    </Scene>
  );
};
