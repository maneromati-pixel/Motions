/**
 * Escena 6 — "DAR VUELTAS": una línea gira en espiral sin llegar a ningún lado.
 * Un tramo brillante persigue su propia cola por la espiral y la cámara rota
 * levemente con ella.
 */
import React from 'react';
import {Camera, Stage} from '../components/Camera';
import {LineDraw} from '../components/LineDraw';
import {TopLabel} from '../components/TopLabel';
import {useScene} from '../components/SceneContext';
import {breathe, drawGlow} from '../lib/anim';
import {CUES} from '../timings';
import {SPIRAL, SPIRAL_C, spiralCamRot, spiralSpin} from './spiral';

export const S06Spiral: React.FC = () => {
  const {t, global} = useScene();
  const base = drawGlow(t, -6, 60);
  // el "pensamiento" que da vueltas: un segmento que recorre la espiral en loop
  const loop = ((global / 46) % 1 + 1) % 1;
  const k = breathe(global, 0.02, 70);
  return (
    <Camera
      rotate={spiralCamRot(global, CUES.spiralBreak)}
      art={
        <Stage>
          <g transform={`rotate(${spiralSpin(global)} ${SPIRAL_C.x} ${SPIRAL_C.y}) translate(${SPIRAL_C.x} ${SPIRAL_C.y}) scale(${k}) translate(${-SPIRAL_C.x} ${-SPIRAL_C.y})`}>
            <LineDraw d={SPIRAL} p={base.p} g={base.g * 0.5} width={3} opacity={0.55} />
            {t > 10 && (
              <path
                d={SPIRAL}
                pathLength={1}
                fill="none"
                stroke="#fff"
                strokeWidth={4}
                strokeLinecap="round"
                strokeDasharray="0.12 1.2"
                strokeDashoffset={-loop * 1.12 + 0.12}
                filter="url(#gNear)"
              />
            )}
            {t > 10 && (
              <path
                d={SPIRAL}
                pathLength={1}
                fill="none"
                stroke="#fff"
                strokeWidth={4}
                strokeLinecap="round"
                strokeDasharray="0.12 1.2"
                strokeDashoffset={-loop * 1.12 + 0.12}
              />
            )}
          </g>
        </Stage>
      }
      text={<TopLabel text="DAR VUELTAS" delay={-4} />}
    />
  );
};
