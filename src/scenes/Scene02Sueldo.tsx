import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { BarMeter } from "../components/BarMeter";
import { countValue } from "../components/Counter";
import { Ground } from "../components/Ground";
import { PersonIcon } from "../components/PersonIcon";
import { Scene } from "../components/Scene";
import { Spotlight } from "../components/Spotlight";
import { Text, Title } from "../components/Text";
import { enter, pop, progress, type } from "../theme";
import { BEATS, SCENES } from "../timing";

const B = BEATS.sueldo;
const fillEase = Easing.inOut(Easing.cubic);
const GROUND_Y = 1060;
const PERSON = 120;

export const Scene02Sueldo: React.FC = () => {
  const frame = useCurrentFrame();
  const t = enter(frame, B.title);
  const bar = pop(frame, B.person - 4);
  const person = enter(frame, B.person);
  const ground = progress(frame, 0, 14);
  const light = progress(frame, B.person, B.person + 20);
  const level = progress(frame, B.fillStart, B.fillEnd, fillEase);
  const pct = countValue(frame, [B.fillStart, B.fillEnd], [0, 100], fillEase);
  const cnt = enter(frame, B.fillStart - 6);
  return (
    <Scene duration={SCENES.sueldo}>
      <div style={{ opacity: t.opacity, transform: t.transform }}>
        <Title>TU SUELDO</Title>
      </div>

      <Spotlight cx={540} top={340} bottom={GROUND_Y} width={300} intensity={light * (0.5 + 0.5 * level)} />
      <Ground y={GROUND_Y} progress={ground} caption="DÍA DE PAGO" captionOpacity={person.opacity} />

      <div style={{ position: "absolute", left: 540 - 55, top: 390, opacity: bar.opacity, transform: bar.transform }}>
        <BarMeter level={level} width={110} height={440} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 540 - PERSON / 2,
          top: GROUND_Y - PERSON * 1.15,
          opacity: person.opacity,
          transform: person.transform,
        }}
      >
        <PersonIcon size={PERSON} glow halo={0.6 + 0.4 * level} />
      </div>

      <Text
        variant="figure"
        y={1150}
        glow
        style={{ opacity: cnt.opacity, transform: cnt.transform, ...type.figure, fontVariantNumeric: "tabular-nums" }}
      >
        {Math.round(pct)}%
      </Text>
    </Scene>
  );
};
