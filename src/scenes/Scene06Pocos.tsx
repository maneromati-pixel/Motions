import React from "react";
import { useCurrentFrame } from "remotion";
import { Arrow } from "../components/Arrow";
import { OutlineBox } from "../components/OutlineBox";
import { Scene } from "../components/Scene";
import { Text, Title } from "../components/Text";
import { C, enter, pop, progress } from "../theme";
import { BEATS, SCENES, STAGGER } from "../timing";

const B = BEATS.pocos;
const GASTOS = ["SUSCRIPCIONES", "CUOTAS", "DELIVERY", "BANCO"];
const SMALL_W = 320;
const SMALL_H = 70;

export const Scene06Pocos: React.FC = () => {
  const frame = useCurrentFrame();
  const t = enter(frame, B.title);
  const cobro = enter(frame, B.cobro);
  const ahorro = pop(frame, B.ahorro, 14);
  const note = enter(frame, B.ahorro + 14);
  return (
    <Scene duration={SCENES.pocos}>
      <div style={{ opacity: t.opacity, transform: t.transform }}>
        <Title>LO QUE HACEN POCOS</Title>
      </div>

      <div style={{ position: "absolute", left: 540 - 220, top: 400, opacity: cobro.opacity, transform: cobro.transform }}>
        <OutlineBox label="COBRO" />
      </div>
      <div style={{ position: "absolute", left: 540 - 12, top: 510 }}>
        <Arrow length={80} progress={progress(frame, B.arrow1, B.arrow1 + 10)} />
      </div>
      <div style={{ position: "absolute", left: 540 - 220, top: 610, opacity: ahorro.opacity, transform: ahorro.transform }}>
        <OutlineBox label="AHORRO" variant="active" />
      </div>
      <Text variant="micro" y={718} style={{ opacity: note.opacity }}>
        PRIMERO
      </Text>
      <div style={{ position: "absolute", left: 540 - 12, top: 770 }}>
        <Arrow length={80} color={C.dim} progress={progress(frame, B.arrow2, B.arrow2 + 10)} />
      </div>

      {GASTOS.map((g, i) => {
        const e = enter(frame, B.gastos + i * STAGGER);
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <div
            key={g}
            style={{
              position: "absolute",
              left: 540 - SMALL_W - 12 + col * (SMALL_W + 24),
              top: 870 + row * (SMALL_H + 24),
              opacity: e.opacity,
              transform: e.transform,
            }}
          >
            <OutlineBox label={g} variant="dim" width={SMALL_W} height={SMALL_H} fontSize={g.length > 10 ? 19 : 22} />
          </div>
        );
      })}
      <Text variant="micro" y={870 + 2 * (SMALL_H + 24) + 14} color={C.dim} style={{ opacity: enter(frame, B.gastos + 4 * STAGGER).opacity }}>
        DESPUÉS, LO QUE QUEDA
      </Text>
    </Scene>
  );
};
