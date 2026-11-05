/**
 * Escena 8 — "PENSADO ANTES": dos tarjetas. "IMPULSO" titila y se apaga;
 * "PREPARACIÓN" se activa con glow y una tilde que se dibuja.
 */
import React from 'react';
import {Camera, Stage} from '../components/Camera';
import {Card} from '../components/Card';
import {LineDraw} from '../components/LineDraw';
import {TopLabel} from '../components/TopLabel';
import {useScene} from '../components/SceneContext';
import {anticipate, drawGlow, mix, prog} from '../lib/anim';
import {CUES, chunkStart, f} from '../timings';
import {EASE} from '../theme';

const W = 350;
const H = 440;
const Y = 840;
const XL = 520 - W / 2 - 22;
const XR = 520 + W / 2 + 22;

export const S08Prepared: React.FC = () => {
  const {t, dur, L} = useScene();
  const impulse = L(CUES.impulse);
  const prepAppear = L(f(chunkStart(13))) - 4;
  const prepared = L(CUES.prepared);
  // IMPULSO: entra activo, titila en "impulso" y se apaga
  const flicker = t > impulse && t < impulse + 14 ? (Math.floor((t - impulse) / 2) % 2 === 0 ? 0.25 : 1) : 1;
  const leftActive = (1 - prog(t, impulse, 18, EASE.in)) * flicker;
  const leftDim = prog(t, impulse + 10, 16, EASE.in);
  const rightActive = prog(t, prepared, 16, EASE.in);
  const pop = anticipate(t, prepared, 0.05);
  const exit = prog(t, dur - 10, 12, EASE.out);
  return (
    <Camera
      art={
        <Stage>
          <g opacity={1 - exit} transform={`translate(${-exit * 40} 0)`}>
            <Card
              x={XL}
              y={Y}
              w={W}
              h={H}
              title="IMPULSO"
              t={t + 2}
              active={leftActive * prog(t, 0, 20, EASE.in)}
              dim={leftDim}
              icon={(p, g) => {
                const d = drawGlow(t, 12, 12);
                return (
                  <LineDraw
                    d={`M ${XL + 14} ${Y - 150} L ${XL - 22} ${Y - 60} L ${XL + 8} ${Y - 60} L ${XL - 14} ${Y + 20}`}
                    p={d.p * p}
                    g={d.g * g * mix(leftActive, 0.3, 1)}
                    width={4}
                  />
                );
              }}
            />
          </g>
          {t >= prepAppear && (
            <g
              opacity={1 - exit}
              transform={`translate(${XR} ${Y}) scale(${1 + pop * 0.04}) translate(${-XR} ${-Y}) translate(${exit * 40} 0)`}
            >
              <Card x={XR} y={Y} w={W} h={H} title="PREPARACIÓN" t={t - prepAppear} active={rightActive} check={prepared - prepAppear + 2} />
            </g>
          )}
        </Stage>
      }
      text={<TopLabel text="PENSADO ANTES" delay={-4} />}
    />
  );
};
