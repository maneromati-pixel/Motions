/**
 * Escena 9 — "LIGEREZA": una pluma cae flotando en zigzag. Movimiento secundario:
 * rota según la velocidad, las barbas "flamean" y deja una estela punteada.
 */
import React from 'react';
import {Camera, Stage} from '../components/Camera';
import {LineDraw} from '../components/LineDraw';
import {TopLabel} from '../components/TopLabel';
import {useScene} from '../components/SceneContext';
import {drawGlow, mix, prog} from '../lib/anim';
import {EASE} from '../theme';

const GROUND = 975;

/** Posición de la pluma en el instante u (0→1 del descenso). */
const featherAt = (u: number) => {
  const ph = u * Math.PI * 4.5;
  const x = 520 + Math.sin(ph) * 190 * (1 - u * 0.35);
  const y = mix(u, 450, GROUND - 40) - Math.abs(Math.cos(ph)) * 16;
  const rot = Math.cos(ph) * 32 * (1 - u * 0.5);
  return {x, y, rot, ph};
};

export const S09Lightness: React.FC = () => {
  const {t, dur} = useScene();
  const u = prog(t, -10, dur + 6, EASE.camera);
  const {x, y, rot, ph} = featherAt(u);
  const flutter = Math.sin(t / 3.2) * 4;
  const appear = drawGlow(t, -10, 22);
  const ground = drawGlow(t, dur - 40, 24);
  const exit = prog(t, dur - 6, 10, EASE.out);
  // estela: puntos detrás de la pluma
  const trail = Array.from({length: 14}, (_, i) => {
    const uu = u - (i + 1) * 0.012;
    if (uu < 0) return null;
    const p = featherAt(uu);
    return <circle key={i} cx={p.x} cy={p.y + 40} r={2} fill="#fff" opacity={(0.4 * (1 - i / 14)) * (1 - exit)} />;
  });
  const barbs = Array.from({length: 7}, (_, i) => {
    const s = -70 + i * 22;
    const len = 34 - Math.abs(i - 3) * 5;
    const wv = Math.sin(t / 4 + i * 0.9 + ph) * 3;
    return `M 0 ${s} q ${-len * 0.5} ${8 + wv} ${-len} ${16 + flutter * 0.6} M 0 ${s} q ${len * 0.5} ${8 - wv} ${len} ${16 - flutter * 0.6}`;
  });
  return (
    <Camera
      art={
        <Stage>
          {trail}
          <g transform={`translate(${x} ${y}) rotate(${rot}) scale(1.1)`} opacity={1 - exit}>
            {/* contorno (vane) */}
            <LineDraw
              d={`M 0 -110 C 46 -80, 52 20, 8 82 M 0 -110 C -44 -78, -50 20, -8 82`}
              p={appear.p}
              g={appear.g}
            />
            {/* raquis */}
            <LineDraw d="M 0 -116 L 0 118" p={appear.p} g={appear.g} width={3} />
            {barbs.map((b, i) => (
              <LineDraw key={i} d={b} p={prog(t, -2 + i * 2, 12, EASE.stroke)} g={appear.g * 0.5} width={2} opacity={0.6} />
            ))}
          </g>
          <LineDraw d={`M 260 ${GROUND + 50} H 780`} from="center" p={ground.p} g={ground.g * 0.6} width={2.5} opacity={0.6 * (1 - exit)} />
        </Stage>
      }
      text={<TopLabel text="LIGEREZA" delay={-6} />}
    />
  );
};
