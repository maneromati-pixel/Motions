/**
 * Escena 11 — "AFRONTAR": una ola grande de línea se levanta frente a una figura
 * pequeña que se queda de pie. Anticipación (la ola retrocede) y overshoot.
 * Termina en corte seco a negro con golpe grave (ver BLACK_CUTS en timings.ts).
 */
import React from 'react';
import {Camera, Stage} from '../components/Camera';
import {LineDraw} from '../components/LineDraw';
import {Figure} from '../components/Figure';
import {TopLabel} from '../components/TopLabel';
import {useScene} from '../components/SceneContext';
import {anticipate, drawGlow, mix, prog, hash} from '../lib/anim';
import {CUES} from '../timings';
import {EASE} from '../theme';

const BASE = 1070;

/** Ola: todos los puntos de control son lineales en h → interpolar h es un morph limpio. */
const wave = (h: number, sx = 1) => {
  const X = (x: number) => 430 + (x - 430) * sx;
  return `M ${X(410)} ${BASE} C ${X(560)} ${BASE}, ${X(640)} ${BASE - h * 0.25}, ${X(690)} ${BASE - h * 0.62} C ${X(730)} ${BASE - h * 0.95}, ${X(810)} ${BASE - h * 1.06}, ${X(860)} ${BASE - h * 0.9} C ${X(890)} ${BASE - h * 0.78}, ${X(870)} ${BASE - h * 0.62}, ${X(835)} ${BASE - h * 0.66} C ${X(800)} ${BASE - h * 0.7}, ${X(790)} ${BASE - h * 0.84}, ${X(815)} ${BASE - h * 0.86}`;
};

export const S11Face: React.FC = () => {
  const {t, L} = useScene();
  const rise = L(CUES.waveRise) - 6;
  const a = anticipate(t, rise, 0.12);
  const swell = Math.sin(t / 10) * 8;
  const h = mix(a, 60 + swell, 470);
  const draw = drawGlow(t, -8, 20);
  const fig = drawGlow(t, -4, 18);
  const lean = mix(Math.max(0, a), 0, -2.5);
  const spray = prog(t, rise + 8, 20, EASE.in);
  const crest = {x: 860, y: BASE - h * 0.98};
  return (
    <Camera
      punch={0.03 * prog(t, rise, 30, EASE.in)}
      art={
        <Stage>
          <LineDraw d={`M 140 ${BASE} H 410`} p={draw.p} g={draw.g * 0.5} width={3} opacity={0.7} />
          <g transform={`rotate(${lean} 300 ${BASE})`}>
            <Figure x={300} y={BASE} s={0.62} p={fig.p} g={fig.g} width={3.5} />
          </g>
          {/* líneas interiores de la ola (profundidad) */}
          <LineDraw d={wave(h * 0.66, 0.84)} p={draw.p} g={draw.g * 0.4} width={2.5} opacity={0.4} />
          <LineDraw d={wave(h * 0.38, 0.7)} p={draw.p} g={draw.g * 0.3} width={2} opacity={0.3} />
          <LineDraw d={wave(h)} p={draw.p} g={draw.g * (0.8 + spray * 0.6)} />
          <LineDraw d={`M 860 ${BASE} H 930`} p={draw.p} g={draw.g * 0.4} width={3} opacity={0.6} />
          {/* espuma: gotas que saltan de la cresta */}
          {Array.from({length: 9}, (_, i) => {
            const life = ((t - rise - 6 + i * 4) % 30) / 30;
            if (spray <= 0 || life < 0) return null;
            const dx = (hash(i) - 0.7) * 120 * life;
            const dy = -40 * life + 90 * life * life;
            return <circle key={i} cx={crest.x - 30 + dx} cy={crest.y + dy} r={2.6} fill="#fff" opacity={spray * (1 - life)} />;
          })}
        </Stage>
      }
      text={<TopLabel text="AFRONTAR" delay={-4} />}
    />
  );
};
