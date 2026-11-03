import React from "react";
import { useCurrentFrame } from "remotion";
import { Arrow } from "../components/Arrow";
import { Diamond } from "../components/Diamond";
import { Ground } from "../components/Ground";
import { OutlineBox } from "../components/OutlineBox";
import { PersonIcon } from "../components/PersonIcon";
import { Scene } from "../components/Scene";
import { Spotlight } from "../components/Spotlight";
import { Title } from "../components/Text";
import { C, enter, GLOW, pop, progress, type } from "../theme";
import { BEATS, SCENES } from "../timing";

const B = BEATS.piensan;
const CX = 540;
const COBRO_Y = 360;
const D_CY = 600;
const D_W = 320;
const D_H = 170;
const AH_X = 140; // caja lateral "AHORRA PRIMERO"
const AH_W = 180;
const RESTO_Y = 790;
const GROUND_Y = 1180;
const P = 100;
const LEFT_P = 330;
const RIGHT_P = 750;

const Micro: React.FC<{ x: number; y: number; children: React.ReactNode; opacity: number; color?: string }> = ({ x, y, children, opacity, color = C.gray }) => (
  <div style={{ position: "absolute", left: x, top: y, ...type.micro, fontSize: 18, color, opacity }}>{children}</div>
);

export const Scene07Piensan: React.FC = () => {
  const frame = useCurrentFrame();
  const t = enter(frame, B.title);
  const cobro = enter(frame, B.cobro);
  const dia = pop(frame, B.diamond, 14);
  const noLine = progress(frame, B.no, B.no + 10);
  const ah = pop(frame, B.ahorra);
  const ret = progress(frame, B.ret, B.ret + 16);
  const resto = enter(frame, B.resto);
  const people = enter(frame, B.people);
  const link = progress(frame, B.link, B.link + 16);

  const leftEdge = CX - D_W / 2;
  const ahRight = AH_X + AH_W;
  const ahTop = D_CY - 35;
  // camino de vuelta (punteado): sube desde la caja y entra a la flecha principal
  const retPath = `M${AH_X + AH_W / 2},${ahTop} V${COBRO_Y + 120} H${CX - 14}`;

  return (
    <Scene duration={SCENES.piensan}>
      <div style={{ opacity: t.opacity, transform: t.transform }}>
        <Title>LO QUE HACEN POCOS</Title>
      </div>

      <Ground y={GROUND_Y} progress={progress(frame, B.ground, B.ground + 14)} />
      <Spotlight cx={RIGHT_P} top={RESTO_Y + 90} bottom={GROUND_Y} width={220} intensity={people.opacity * 0.9} />

      <div style={{ position: "absolute", left: CX - 180, top: COBRO_Y, opacity: cobro.opacity, transform: cobro.transform }}>
        <OutlineBox label="INGRESO" width={360} height={80} fontSize={26} />
      </div>
      <div style={{ position: "absolute", left: CX - 12, top: COBRO_Y + 90 }}>
        <Arrow length={D_CY - D_H / 2 - COBRO_Y - 100} progress={progress(frame, B.arrow1, B.arrow1 + 8)} />
      </div>

      <Diamond cx={CX} cy={D_CY} width={D_W} height={D_H} label="¿YA AHORRÉ?" opacity={dia.opacity} scale={0.9 + 0.1 * dia.p} />

      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {/* rama NO → izquierda */}
        <line x1={leftEdge} y1={D_CY} x2={leftEdge - (leftEdge - ahRight - 6) * noLine} y2={D_CY} stroke={C.ink} strokeWidth={2} />
        {noLine > 0.9 && <polyline points={`${ahRight + 16},${D_CY - 8} ${ahRight + 6},${D_CY} ${ahRight + 16},${D_CY + 8}`} fill="none" stroke={C.ink} strokeWidth={2} />}
        {/* vuelta punteada */}
        <path d={retPath} fill="none" stroke={C.gray} strokeWidth={2} strokeDasharray="5 8" pathLength={1} strokeDashoffset={0} opacity={ret} />
        {/* enlace punteado hacia la persona que lo hace */}
        <line x1={CX} y1={RESTO_Y + 76} x2={CX + (RIGHT_P - CX) * link} y2={RESTO_Y + 76 + (GROUND_Y - P * 1.15 - 10 - RESTO_Y - 76) * link} stroke={C.gray} strokeWidth={1.5} strokeDasharray="3 7" opacity={link > 0 ? 0.8 : 0} />
      </svg>
      <Micro x={ahRight + 14} y={D_CY - 36} opacity={noLine}>NO</Micro>

      <div style={{ position: "absolute", left: AH_X, top: ahTop, opacity: ah.opacity, transform: ah.transform }}>
        <OutlineBox label={"AHORRA\nPRIMERO"} variant="active" width={AH_W} height={70} fontSize={16} style={{ whiteSpace: "pre-line", textAlign: "center", lineHeight: 1.3 }} />
      </div>

      <div style={{ position: "absolute", left: CX - 12, top: D_CY + D_H / 2 + 6 }}>
        <Arrow length={RESTO_Y - D_CY - D_H / 2 - 16} progress={progress(frame, B.si, B.si + 8)} />
      </div>
      <Micro x={CX + 22} y={D_CY + D_H / 2 + 8} opacity={progress(frame, B.si, B.si + 8)} color={C.ink}>SÍ</Micro>

      <div style={{ position: "absolute", left: CX - 180, top: RESTO_Y, opacity: resto.opacity, transform: resto.transform }}>
        <OutlineBox label="GASTA EL RESTO" width={360} height={76} fontSize={22} />
      </div>

      {/* la mayoría vs. pocos */}
      <div style={{ position: "absolute", left: LEFT_P - P / 2, top: GROUND_Y - P * 1.15, opacity: people.opacity, transform: people.transform }}>
        <PersonIcon size={P} color={C.dim} />
      </div>
      <div style={{ position: "absolute", left: RIGHT_P - P / 2, top: GROUND_Y - P * 1.15, opacity: people.opacity, transform: people.transform }}>
        <PersonIcon size={P} glow halo={0.8} />
      </div>
      <div style={{ position: "absolute", left: LEFT_P - 150, width: 300, top: GROUND_Y + 26, textAlign: "center", ...type.micro, color: C.dim, opacity: people.opacity }}>
        LA MAYORÍA
      </div>
      <div style={{ position: "absolute", left: RIGHT_P - 150, width: 300, top: GROUND_Y + 26, textAlign: "center", ...type.micro, color: C.ink, filter: GLOW, opacity: people.opacity }}>
        POCOS
      </div>
    </Scene>
  );
};
