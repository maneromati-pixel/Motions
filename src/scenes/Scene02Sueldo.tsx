import React from "react";
import { useCurrentFrame } from "remotion";
import { BarMeter } from "../components/BarMeter";
import { countValue } from "../components/Counter";
import { PersonIcon } from "../components/PersonIcon";
import { Scene } from "../components/Scene";
import { Text, Title } from "../components/Text";
import { Easing } from "remotion";
import { enter, pop, progress, type } from "../theme";
import { BEATS, SCENES } from "../timing";

const B = BEATS.sueldo;
const fillEase = Easing.inOut(Easing.cubic);

export const Scene02Sueldo: React.FC = () => {
  const frame = useCurrentFrame();
  const t = enter(frame, B.title);
  const bar = pop(frame, B.person - 4);
  const person = enter(frame, B.person);
  const level = progress(frame, B.fillStart, B.fillEnd, fillEase);
  const pct = countValue(frame, [B.fillStart, B.fillEnd], [0, 100], fillEase);
  const cnt = enter(frame, B.fillStart - 6);
  const done = progress(frame, B.fillEnd, B.fillEnd + 10);
  return (
    <Scene duration={SCENES.sueldo}>
      <div style={{ opacity: t.opacity, transform: t.transform }}>
        <Title>TU SUELDO</Title>
      </div>

      <div
        style={{
          position: "absolute",
          left: 540 - 60,
          top: 380,
          opacity: bar.opacity,
          transform: bar.transform,
        }}
      >
        <BarMeter level={level} width={120} height={500} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 540 - 65,
          top: 920,
          opacity: person.opacity,
          transform: person.transform,
        }}
      >
        <PersonIcon size={130} glow />
      </div>

      <Text
        variant="figure"
        y={1100}
        glow
        style={{ opacity: cnt.opacity, transform: cnt.transform, ...type.figure, fontVariantNumeric: "tabular-nums" }}
      >
        {Math.round(pct)}%
      </Text>
      <Text variant="micro" y={1260} style={{ opacity: done }}>
        DÍA DE COBRO
      </Text>
    </Scene>
  );
};
