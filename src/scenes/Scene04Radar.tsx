import React from "react";
import { useCurrentFrame } from "remotion";
import { Ground } from "../components/Ground";
import { PersonIcon } from "../components/PersonIcon";
import { Blip, Radar } from "../components/Radar";
import { Scene } from "../components/Scene";
import { Text, Title } from "../components/Text";
import { C, enter, GLOW, progress, type } from "../theme";
import { BEATS, SCENES } from "../timing";

const B = BEATS.radar;
const CX = 520;
const CY = 690;
const R = 265;
const GROUND_Y = 1110;
const PERSON = 80;
const START_ANGLE = -90; // arranca apuntando arriba

/** Fugas chicas que se repiten todos los meses. Ángulo en grados (0 = derecha, sentido horario). */
const LEAKS = [
  { label: "COMISIONES", angle: -60, r: 0.75 },
  { label: "COMPRAS POR IMPULSO", angle: -130, r: 0.55 },
  { label: "SUSCRIPCIÓN OLVIDADA", angle: 200, r: 0.8 },
  { label: "INTERESES", angle: 60, r: 0.6 },
  { label: "ENVÍOS", angle: 140, r: 0.55 },
];

export const Scene04Radar: React.FC = () => {
  const frame = useCurrentFrame();
  const t = enter(frame, B.title);
  const person = enter(frame, B.person);
  const draw = progress(frame, B.radar, B.radar + 16);
  const travelled = Math.max(0, frame - B.sweepStart) * B.sweepSpeed;
  const sweep = START_ANGLE + travelled;

  const blips: Blip[] = LEAKS.map((l) => {
    const delta = (((l.angle - START_ANGLE) % 360) + 360) % 360;
    const hit = B.sweepStart + delta / B.sweepSpeed;
    return { label: l.label, angle: l.angle, r: l.r * R, seen: progress(frame, hit, hit + 10) };
  });
  const detected = blips.filter((b) => b.seen > 0.5).length;
  const txt = enter(frame, B.text);

  // línea de mira desde la cabeza de la persona al centro del radar
  const head = { x: 190, y: GROUND_Y - PERSON * 1.15 + 18 };
  const link = progress(frame, B.radar + 6, B.radar + 22);

  return (
    <Scene duration={SCENES.radar}>
      <div style={{ opacity: t.opacity, transform: t.transform }}>
        <Title>LO QUE NO VES</Title>
      </div>

      <Ground y={GROUND_Y} progress={progress(frame, 0, 14)} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <line
          x1={head.x}
          y1={head.y}
          x2={head.x + (CX - head.x) * link}
          y2={head.y + (CY - head.y) * link}
          stroke={C.gray}
          strokeWidth={1.5}
          strokeDasharray="3 7"
        />
      </svg>
      <Radar cx={CX} cy={CY} r={R} sweep={sweep} sweepOpacity={draw} draw={draw} blips={blips} />

      <div style={{ position: "absolute", left: 190 - PERSON / 2, top: GROUND_Y - PERSON * 1.15, opacity: person.opacity, transform: person.transform }}>
        <PersonIcon size={PERSON} glow halo={0.7} />
      </div>

      {/* contador de detecciones */}
      <div style={{ position: "absolute", right: 150, top: CY + R - 20, textAlign: "right", opacity: draw }}>
        <div style={{ ...type.micro, fontSize: 18 }}>DETECTADO</div>
        <div style={{ ...type.figure, fontSize: 72, color: C.white, filter: GLOW, lineHeight: 1.05 }}>{detected}</div>
      </div>

      <Text variant="label" y={GROUND_Y + 70} glow size={28} style={{ opacity: txt.opacity, transform: txt.transform }}>
        {"GASTOS PEQUEÑOS,\nTODOS LOS MESES"}
      </Text>
    </Scene>
  );
};
