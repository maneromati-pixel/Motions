import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { countValue } from "../components/Counter";
import { Ground } from "../components/Ground";
import { PersonIcon } from "../components/PersonIcon";
import { ProgressBar } from "../components/ProgressBar";
import { Scene } from "../components/Scene";
import { Text } from "../components/Text";
import { ars, C, enter, GLOW, pop, progress, type } from "../theme";
import { BEATS, SCENES } from "../timing";

const B = BEATS.numeros;

// Ahorrar el 10% da $1.600 el año 1 → el 90% restante son $14.400 al año.
const GIVEN_PER_YEAR = 14400;
const SAVED = [1600, 10900, 40800, 48000];
const SAVED_YEARS = [1, 4, 8, 10];
const savedAt = (y: number) =>
  interpolate(y, SAVED_YEARS, SAVED, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const GROUND_Y = 1040;
const STEP_X0 = 290;
const STEP_W = 58;
const STEP_GAP = 4;
const STAIR_H = 470;
const PERSON = 80;
const yearEase = Easing.inOut(Easing.sin);

export const Scene09Numeros: React.FC = () => {
  const frame = useCurrentFrame();

  // intro "PONGAMOS NÚMEROS"
  const intro = pop(frame, B.intro, 10);
  const introOut = interpolate(frame, [B.introOut, B.introOut + 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const yearF = countValue(frame, [B.yearsStart, B.yearsEnd], [1, 10], yearEase);
  const year = Math.min(10, Math.floor(yearF + 1e-6));
  const saved = savedAt(yearF);
  const given = GIVEN_PER_YEAR * yearF;

  const top = enter(frame, B.blocks);
  const scene = enter(frame, B.blocks + 4);
  const below = enter(frame, B.blocks + 10);
  const base = pop(frame, B.base, 14);

  return (
    <Scene duration={SCENES.numeros}>
      {frame < B.introOut + 8 && (
        <Text variant="title" y={760} size={64} glow lineHeight={1.4} style={{ opacity: intro.opacity * introOut, transform: intro.transform, fontWeight: 600 }}>
          {"PONGAMOS\nNÚMEROS"}
        </Text>
      )}

      {frame >= B.blocks && (
        <>
          {/* año, arriba a la derecha (dentro de la zona segura) */}
          <div style={{ position: "absolute", right: 140, top: 200, textAlign: "right", opacity: top.opacity, transform: top.transform }}>
            <div style={{ ...type.micro }}>AÑO</div>
            <div style={{ ...type.figure, fontSize: 76, color: C.white, filter: GLOW, lineHeight: 1, marginTop: 6, fontVariantNumeric: "tabular-nums" }}>{year}</div>
          </div>

          {/* lo que te diste a ti */}
          <Text variant="micro" y={330} color={C.white} style={{ opacity: top.opacity }}>
            {"LO QUE TE DISTE A TI · 10% AL MES"}
          </Text>
          <Text variant="figure" y={362} glow style={{ opacity: top.opacity, transform: top.transform, fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>
            {ars(saved)}
          </Text>

          {/* escalera: un escalón por año, alto proporcional a lo ahorrado */}
          <Ground y={GROUND_Y} x1={120} x2={930} progress={scene.p} />
          <div style={{ position: "absolute", left: 175 - PERSON / 2, top: GROUND_Y - PERSON * 1.15, opacity: scene.opacity }}>
            <PersonIcon size={PERSON} glow halo={0.4 + 0.6 * (saved / 48000)} />
          </div>
          {Array.from({ length: 10 }).map((_, i) => {
            const y = i + 1;
            const grow = progress(frame, 0, 1) * Math.max(0, Math.min(1, yearF - i)); // crece mientras transcurre ese año
            if (grow <= 0) return null;
            const h = Math.max(22, (savedAt(y) / 48000) * STAIR_H) * grow;
            const current = y === year;
            return (
              <div
                key={y}
                style={{
                  position: "absolute",
                  left: STEP_X0 + i * (STEP_W + STEP_GAP),
                  top: GROUND_Y - h,
                  width: STEP_W,
                  height: h,
                  boxSizing: "border-box",
                  border: `3px solid ${C.white}`,
                  borderBottom: "none",
                  borderRadius: "6px 6px 0 0",
                  background: current ? C.white : "rgba(255,255,255,0.05)",
                  filter: GLOW,
                }}
              />
            );
          })}

          {/* lo que le diste a ellos */}
          <div style={{ position: "absolute", left: 540 - 330, width: 660, top: GROUND_Y + 50, opacity: below.opacity, transform: below.transform }}>
            <div style={{ ...type.micro, fontSize: 18, marginBottom: 12 }}>LO QUE LE DISTE A ELLOS</div>
            <ProgressBar value={given / (GIVEN_PER_YEAR * 10)} width={660} height={24} color={C.dim} glow={false} />
            <div style={{ ...type.figure, fontSize: 56, color: C.gray, marginTop: 8, fontVariantNumeric: "tabular-nums" }}>{ars(given)}</div>
          </div>

          <Text variant="label" y={1330} glow size={38} style={{ opacity: base.opacity, transform: base.transform }}>
            TIENES UNA BASE
          </Text>
        </>
      )}
    </Scene>
  );
};
