import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { Chart } from "../components/Chart";
import { PersonIcon } from "../components/PersonIcon";
import { Scene } from "../components/Scene";
import { Text } from "../components/Text";
import { C, enter, progress } from "../theme";
import { BEATS, SCENES } from "../timing";

const B = BEATS.curva;

export const Scene09Curva: React.FC = () => {
  const frame = useCurrentFrame();
  const axes = progress(frame, B.axes, B.axes + 14);
  const curve = progress(frame, B.curveStart, B.curveEnd, Easing.inOut(Easing.quad));
  const t1 = enter(frame, B.text1);
  const t2 = enter(frame, B.text2);
  return (
    <Scene duration={SCENES.curva}>
      {/* vos, parado al pie de la curva */}
      <div style={{ position: "absolute", left: 92, top: 1000 - 70 * 1.15, opacity: axes }}>
        <PersonIcon size={70} glow halo={0.5 + 0.5 * curve} />
      </div>
      <Chart x={190} y={1000} width={720} height={640} axes={axes} progress={curve} labelsOpacity={axes} />
      <Text variant="label" y={1110} color={C.gray} size={27} style={{ opacity: t1.opacity, transform: t1.transform }}>
        {"SI NO LE DAS UN DESTINO\nA TU PLATA,"}
      </Text>
      <Text variant="label" y={1220} glow size={34} style={{ opacity: t2.opacity, transform: t2.transform }}>
        {"ALGUIEN MÁS\nSE LO DA"}
      </Text>
    </Scene>
  );
};
