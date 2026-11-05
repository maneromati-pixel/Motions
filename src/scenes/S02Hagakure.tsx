/**
 * Escena 2 — "HAGAKURE": pergamino que se desenrolla (anticipación + overshoot)
 * y un trazo de pincel abstracto (sin texto legible) hecho de varias "cerdas".
 */
import React from 'react';
import {Camera, Stage} from '../components/Camera';
import {LineDraw} from '../components/LineDraw';
import {TopLabel} from '../components/TopLabel';
import {useScene} from '../components/SceneContext';
import {anticipate, breathe, drawGlow, drift, mix, prog} from '../lib/anim';
import {EASE} from '../theme';

const CX = 520;
const CY = 820;
const H = 360; // alto del papel

const roller = (x: number) =>
  `M ${x - 15} ${CY - H / 2 - 18} Q ${x} ${CY - H / 2 - 26} ${x + 15} ${CY - H / 2 - 18} V ${CY + H / 2 + 18} Q ${x} ${CY + H / 2 + 26} ${x - 15} ${CY + H / 2 + 18} Z`;

// trazo de pincel: un gesto amplio + columnas de marcas cortas (abstracto)
const BRUSH = 'M 330 700 C 400 660, 470 690, 500 760 S 560 900, 640 880 S 720 780, 700 730';
const MARKS = [
  'M 300 820 q 12 18 4 40',
  'M 296 890 q 18 6 26 -4',
  'M 304 930 q 6 20 -4 36',
  'M 745 690 q 10 14 2 32',
  'M 738 760 q 20 2 24 14',
  'M 750 812 q -6 20 4 44',
  'M 742 880 q 16 10 22 2',
];

export const S02Hagakure: React.FC = () => {
  const {t} = useScene();
  const rollers = drawGlow(t, -8, 14);
  const open = anticipate(t, 10, 0.06); // contracción y apertura con overshoot
  const half = mix(Math.max(0, open), 18, 280) + mix(Math.min(0, open), 0, 60);
  const xl = CX - half;
  const xr = CX + half;
  const edge = (y: number) => `M ${xl + 15} ${y} L ${xr - 15} ${y}`;
  const brushStart = 26;
  const k = breathe(t, 0.012, 100);

  return (
    <Camera
      art={
        <Stage>
          <g transform={`translate(${CX} ${CY}) scale(${k}) translate(${-CX} ${-CY + drift(t, 3, 160)})`}>
            {/* bordes del papel */}
            <LineDraw d={edge(CY - H / 2)} p={rollers.p} g={rollers.g * 0.6} width={3} />
            <LineDraw d={edge(CY + H / 2)} p={rollers.p} g={rollers.g * 0.6} width={3} />
            {/* cerdas del pincel (4 trazos casi paralelos, con delay mínimo) */}
            {[-7, -2, 3, 8].map((o, i) => {
              const b = drawGlow(t, brushStart + i * 2, 34);
              return (
                <g key={i} transform={`translate(${o * 0.6} ${o})`}>
                  <LineDraw d={BRUSH} p={b.p} g={b.g * 0.8} width={i === 1 || i === 2 ? 4 : 2.5} opacity={i === 0 || i === 3 ? 0.55 : 1} />
                </g>
              );
            })}
            {MARKS.map((m, i) => {
              const b = drawGlow(t, brushStart + 20 + i * 4, 10);
              return <LineDraw key={i} d={m} p={b.p} g={b.g * 0.7} width={3.5} opacity={0.85} />;
            })}
            {/* rodillos */}
            <LineDraw d={roller(xl)} p={rollers.p} g={rollers.g} />
            <LineDraw d={roller(xr)} p={rollers.p} g={rollers.g} />
            {[xl, xr].map((x, i) => (
              <g key={i} opacity={prog(t, 0, 10, EASE.in)}>
                <LineDraw d={`M ${x} ${CY - H / 2 - 24} V ${CY - H / 2 - 44}`} g={rollers.g} width={4} />
                <LineDraw d={`M ${x} ${CY + H / 2 + 24} V ${CY + H / 2 + 44}`} g={rollers.g} width={4} />
              </g>
            ))}
          </g>
        </Stage>
      }
      text={<TopLabel text="HAGAKURE" delay={-6} />}
    />
  );
};
