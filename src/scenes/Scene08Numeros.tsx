import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { countValue } from "../components/Counter";
import { ProgressBar } from "../components/ProgressBar";
import { Scene } from "../components/Scene";
import { Text } from "../components/Text";
import { ars, C, enter, GLOW, pop, type } from "../theme";
import { BEATS, SCENES } from "../timing";

const B = BEATS.numeros;


// Sueldo de referencia: el 10% ahorrado da $1.600 el año 1 → el 90% restante son $14.400/año.
const GIVEN_PER_YEAR = 14400;
const SAVED = [1600, 10900, 40800, 48000];
const SAVED_YEARS = [1, 4, 8, 10];
const BAR_W = 720;
const LEFT = 540 - BAR_W / 2;

export const Scene08Numeros: React.FC = () => {
  const frame = useCurrentFrame();

  // --- intro: "PONELE NÚMEROS"
  const intro = pop(frame, B.intro, 10);
  const introOut = interpolate(frame, [B.introOut, B.introOut + 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // --- años: 1 → 10
  const yearF = countValue(frame, [B.yearsStart, B.yearsEnd], [1, 10], Easing.inOut(Easing.sin));
  const year = Math.min(10, Math.floor(yearF + 1e-6));
  // las cifras dependen del año (continuo), así contador y años siempre coinciden
  const saved = interpolate(yearF, SAVED_YEARS, SAVED, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const given = GIVEN_PER_YEAR * yearF;
  const givenFill = given / (GIVEN_PER_YEAR * 10);

  const yr = enter(frame, B.blocks);
  const b1 = enter(frame, B.blocks + 4);
  const b2 = enter(frame, B.blocks + 12);
  const base = pop(frame, B.base, 14);

  return (
    <Scene duration={SCENES.numeros}>
      {frame < B.introOut + 8 && (
        <Text variant="title" y={760} size={64} glow lineHeight={1.4} style={{ opacity: intro.opacity * introOut, transform: intro.transform, fontWeight: 600 }}>
          {"PONELE\nNÚMEROS"}
        </Text>
      )}

      {frame >= B.blocks && (
        <>
          {/* contador de años: arriba a la derecha (dentro de la zona segura) */}
          <div style={{ position: "absolute", right: 140, top: 240, textAlign: "right", opacity: yr.opacity, transform: yr.transform }}>
            <div style={{ ...type.micro }}>AÑO</div>
            <div style={{ ...type.figure, fontSize: 84, color: C.white, filter: GLOW, lineHeight: 1, marginTop: 8, fontVariantNumeric: "tabular-nums" }}>
              {year}
            </div>
          </div>

          {/* bloque 1: lo que le diste a ellos */}
          <div style={{ position: "absolute", left: LEFT, top: 430, width: BAR_W, opacity: b1.opacity, transform: b1.transform }}>
            <div style={{ ...type.micro, fontSize: 22, color: C.gray, marginBottom: 18 }}>LO QUE LE DISTE A ELLOS</div>
            <ProgressBar value={givenFill} width={BAR_W} height={30} color={C.dim} glow={false} />
            <div style={{ ...type.figure, fontSize: 72, color: C.gray, marginTop: 14, fontVariantNumeric: "tabular-nums" }}>{ars(given)}</div>
          </div>

          {/* bloque 2: lo que te diste a vos */}
          <div style={{ position: "absolute", left: LEFT, top: 780, width: BAR_W, opacity: b2.opacity, transform: b2.transform }}>
            <div style={{ ...type.micro, fontSize: 22, color: C.white, marginBottom: 6 }}>LO QUE TE DISTE A VOS</div>
            <div style={{ ...type.micro, fontSize: 18, marginBottom: 14 }}>10% POR MES</div>
            <div style={{ ...type.figure, color: C.white, filter: GLOW, lineHeight: 1.05, fontVariantNumeric: "tabular-nums" }}>{ars(saved)}</div>
            <ProgressBar value={saved / SAVED[SAVED.length - 1]} width={BAR_W} height={34} style={{ marginTop: 24 }} />
          </div>

          <Text variant="label" y={1250} glow size={40} style={{ opacity: base.opacity, transform: base.transform }}>
            TENÉS UNA BASE
          </Text>
        </>
      )}
    </Scene>
  );
};
