/**
 * Escena 15 — "PRUDENTE": un camino se dibuja hacia el horizonte y una figura
 * ya va adelantada, caminando. La frase final queda 2 s más y la cámara se aleja.
 */
import React from 'react';
import {Camera, Stage} from '../components/Camera';
import {LineDraw} from '../components/LineDraw';
import {Figure} from '../components/Figure';
import {TopLabel} from '../components/TopLabel';
import {useScene} from '../components/SceneContext';
import {drawGlow, mix, prog} from '../lib/anim';
import {CUES} from '../timings';
import {EASE} from '../theme';

const VP = {x: 520, y: 620}; // punto de fuga
const BOTTOM = 1090;

export const S15Prudent: React.FC = () => {
  const {t, dur, L} = useScene();
  const start = L(CUES.pathStart);
  const horizon = drawGlow(t, start, 26);
  const road = drawGlow(t, start + 6, 34);
  const fig = drawGlow(t, start + 26, 18);
  // cámara alejándose al final
  const pull = -0.07 * prog(t, dur - 80, 90, EASE.camera);
  // marcas centrales que avanzan hacia el horizonte (perspectiva)
  const dashes = Array.from({length: 7}, (_, i) => {
    const z = ((i / 7 + t / 160) % 1 + 1) % 1; // 0 = cerca, 1 = horizonte
    const zz = Math.pow(1 - z, 2.2);
    const y1 = mix(zz, VP.y + 6, BOTTOM);
    const len = 46 * zz + 3;
    return (
      <LineDraw key={i} d={`M ${VP.x} ${y1} V ${y1 - len}`} g={0.6} width={mix(zz, 1.5, 4)} opacity={road.p * (0.25 + zz * 0.6)} />
    );
  });
  const walk = Math.sin(t / 5) * 2;
  return (
    <Camera
      push={pull + 0.04}
      art={
        <Stage>
          <LineDraw d={`M 140 ${VP.y} H 900`} from="center" p={horizon.p} g={horizon.g * 0.5} width={2.5} opacity={0.6} />
          <LineDraw d={`M 230 ${BOTTOM} L ${VP.x - 6} ${VP.y + 2}`} p={road.p} g={road.g} />
          <LineDraw d={`M 810 ${BOTTOM} L ${VP.x + 6} ${VP.y + 2}`} p={road.p} g={road.g} />
          {dashes}
          {/* la figura ya va adelantada, cerca del horizonte */}
          <g transform={`translate(0 ${walk * 0.5})`}>
            <Figure x={VP.x + 6} y={VP.y + 118} s={0.5} p={fig.p} g={fig.g * 1.3} width={3} />
          </g>
          {/* una luz suave en el horizonte detrás de la figura */}
          <circle cx={VP.x} cy={VP.y} r={mix(prog(t, start + 30, 60, EASE.in), 0, 90)} fill="none" stroke="#fff" strokeWidth={2} opacity={0.12} filter="url(#gFar)" />
        </Stage>
      }
      text={<TopLabel text="PRUDENTE" delay={start} exitAt={dur - 4} />}
    />
  );
};
