/**
 * Escena 7 — La espiral se rompe y se endereza en una flecha recta hacia
 * arriba (morph por puntos), con anticipación (se contrae) y overshoot.
 * Acento sonoro en el quiebre.
 */
import React from 'react';
import {Camera, Stage} from '../components/Camera';
import {LineDraw} from '../components/LineDraw';
import {MorphPath} from '../components/MorphPath';
import {TopLabel} from '../components/TopLabel';
import {useScene} from '../components/SceneContext';
import {breathe, drift, mix, prog, settle} from '../lib/anim';
import {CUES} from '../timings';
import {EASE} from '../theme';
import {ARROW, SPIRAL, SPIRAL_C, spiralCamRot, spiralSpin} from './spiral';

export const S07Arrow: React.FC = () => {
  const {t, dur, global, L} = useScene();
  const br = L(CUES.spiralBreak);
  // tensión: la espiral se aprieta y tiembla antes de romperse
  const tension = prog(t, br - 16, 16, EASE.stroke) * (1 - prog(t, br, 4, EASE.in));
  const shake = tension * Math.sin(t * 2.7) * 3;
  const s = t >= br ? settle(t, br) : 0; // 0 → 1 con overshoot
  const spin = mix(Math.min(1, s), spiralSpin(global), 0) * (t < br ? 1 : 1 - Math.min(1, s));
  const k = (1 - tension * 0.06) * breathe(global, 0.02, 70);
  const loop = ((global / 46) % 1 + 1) % 1;
  // salida: la flecha dispara hacia arriba (y arrastra el corte siguiente)
  const shoot = prog(t, dur - 10, 14, EASE.out);
  const glowUp = prog(t, br + 4, 14, EASE.in);
  return (
    <Camera
      rotate={spiralCamRot(global, CUES.spiralBreak)}
      art={
        <Stage>
          <g
            transform={`translate(${shake} ${-shoot * 1400 + (t > br ? drift(t, 4, 60) : 0)}) rotate(${spin} ${SPIRAL_C.x} ${SPIRAL_C.y}) translate(${SPIRAL_C.x} ${SPIRAL_C.y}) scale(${k}) translate(${-SPIRAL_C.x} ${-SPIRAL_C.y})`}
          >
            {t < br ? (
              <>
                <LineDraw d={SPIRAL} g={0.5 + tension} width={3} opacity={0.55 + tension * 0.45} />
                {/* el tramo que da vueltas sigue desde la escena anterior y se apaga con la tensión */}
                <path
                  d={SPIRAL}
                  pathLength={1}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeDasharray="0.12 1.2"
                  strokeDashoffset={-loop * 1.12 + 0.12}
                  opacity={1 - tension}
                />
              </>
            ) : (
              <MorphPath from={SPIRAL} to={ARROW} p={s} samples={320} g={0.6 + glowUp * 0.8} width={mix(Math.min(1, s), 3, 4)} />
            )}
            {/* líneas de velocidad debajo de la flecha al dispararse */}
            {[-1, 1].map((d) => (
              <LineDraw key={d} d={`M ${520 + d * 34} 1100 V 900`} p={prog(t, dur - 12, 8, EASE.in)} tail={prog(t, dur - 6, 8, EASE.in)} g={1} width={2} opacity={0.6} />
            ))}
          </g>
        </Stage>
      }
      text={<TopLabel text="TSUNETOMO" delay={2} />}
    />
  );
};
