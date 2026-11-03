import React from "react";
import { random, useCurrentFrame } from "remotion";
import { PersonIcon } from "../components/PersonIcon";
import { Scene } from "../components/Scene";
import { Text } from "../components/Text";
import { C, enter, SAFE } from "../theme";
import { BEATS, SCENES } from "../timing";

const B = BEATS.hook;
const COLS = 10;
const CELL = 68;
const ICON = 44;
const GRID_W = COLS * CELL;
const GRID_TOP = 420;

/** Estado (blanco/gris) de cada persona: titila con fase pseudoaleatoria determinística. */
const isLit = (i: number, frame: number) => {
  const period = B.twinklePeriod + Math.floor(random(`p${i}`) * 22);
  const phase = Math.floor(random(`o${i}`) * period);
  const duty = 0.35 + random(`d${i}`) * 0.3;
  return ((frame + phase) % period) / period < duty;
};

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const sub = enter(frame, B.subtitle);
  return (
    <Scene duration={SCENES.hook}>
      {/* REGLA 1: el título es estático y opaco desde el frame 0 (sin entrada). */}
      <Text variant="title" y={SAFE.titleY - 60} size={44} glow lineHeight={1.5}>
        {"ALGUIEN GANA\nCON TU SUELDO"}
      </Text>

      <div
        style={{
          position: "absolute",
          left: 540 - GRID_W / 2,
          top: GRID_TOP,
          width: GRID_W,
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
          gridAutoRows: `${CELL}px`,
        }}
      >
        {Array.from({ length: 100 }).map((_, i) => {
          const lit = isLit(i, frame);
          return (
            <div key={i} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <PersonIcon size={ICON} color={lit ? C.white : C.dim} glow={lit} />
            </div>
          );
        })}
      </div>

      <Text
        variant="label"
        y={GRID_TOP + GRID_W + 70}
        glow
        style={{ opacity: sub.opacity, transform: sub.transform }}
      >
        Y NO SOS VOS
      </Text>
    </Scene>
  );
};
