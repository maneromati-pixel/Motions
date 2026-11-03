import React from "react";
import { useCurrentFrame } from "remotion";
import { Arrow } from "../components/Arrow";
import { BarMeter } from "../components/BarMeter";
import { OutlineBox } from "../components/OutlineBox";
import { Scene } from "../components/Scene";
import { Text, Title } from "../components/Text";
import { C, enter, progress, type } from "../theme";
import { BEATS, SCENES } from "../timing";

const B = BEATS.quien;
const ITEMS = ["SUSCRIPCIONES", "CUOTAS", "DELIVERY", "BANCO"];

const BAR_X = 150;
const BAR_W = 110;
const BAR_TOP = 400;
const BAR_H = 640;
const BOX_X = 420;
const BOX_W = 440;
const BOX_H = 90;
const BOX_TOP = 430;
const BOX_GAP = 160;

export const Scene03Quien: React.FC = () => {
  const frame = useCurrentFrame();
  const t = enter(frame, B.title);
  const bar = enter(frame, B.bar);

  // la barra baja un tramo con cada caja
  let level = 1;
  ITEMS.forEach((_, i) => {
    const s = B.firstBox + i * B.boxGap + 6;
    level -= 0.25 * progress(frame, s, s + B.drainDur);
  });

  const zero = enter(frame, B.zero);
  const barRight = BAR_X + BAR_W;

  return (
    <Scene duration={SCENES.quien}>
      <div style={{ opacity: t.opacity, transform: t.transform }}>
        <Title>QUIÉN SE LO LLEVA</Title>
      </div>

      <div style={{ position: "absolute", left: BAR_X, top: BAR_TOP, opacity: bar.opacity, transform: bar.transform }}>
        <BarMeter level={level} width={BAR_W} height={BAR_H} />
        <div style={{ ...type.micro, marginTop: 22, width: BAR_W, textAlign: "center", paddingLeft: "0.3em" }}>
          SUELDO
        </div>
      </div>

      {ITEMS.map((label, i) => {
        const s = B.firstBox + i * B.boxGap;
        const box = enter(frame, s + 4);
        const cy = BOX_TOP + i * BOX_GAP + BOX_H / 2;
        // flecha desde el borde derecho de la barra hasta el borde izquierdo de la caja
        const x1 = barRight + 14;
        const y1 = BAR_TOP + BAR_H * (0.2 + i * 0.2);
        const x2 = BOX_X - 14;
        const dx = x2 - x1;
        const dy = cy - y1;
        const len = Math.hypot(dx, dy);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI - 90;
        return (
          <React.Fragment key={label}>
            <div style={{ position: "absolute", left: x1 - 12, top: y1 }}>
              <Arrow length={len} angle={angle} progress={progress(frame, s, s + 10)} />
            </div>
            <div style={{ position: "absolute", left: BOX_X, top: cy - BOX_H / 2, opacity: box.opacity, transform: box.transform }}>
              <OutlineBox label={label} fontSize={label.length > 10 ? 25 : 30} />
            </div>
          </React.Fragment>
        );
      })}

      <Text variant="figure" y={1150} color={C.gray} style={{ opacity: zero.opacity, transform: zero.transform }}>
        $0
      </Text>
    </Scene>
  );
};
