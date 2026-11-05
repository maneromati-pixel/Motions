/**
 * Escena 5 — "CON CALMA": la tsuba se transforma (flubber) en el primer cuenco
 * de té; los otros nueve aparecen escalonados. En "7 de cada 10", siete se
 * inclinan y se apagan con stagger; tres quedan encendidos con vapor.
 * Número grande "7/10" con mini etiqueta "SALEN MAL".
 */
import React from 'react';
import {Camera, Stage} from '../components/Camera';
import {LineDraw} from '../components/LineDraw';
import {MorphPath} from '../components/MorphPath';
import {TopLabel} from '../components/TopLabel';
import {BigNumber} from '../components/BigNumber';
import {useScene} from '../components/SceneContext';
import {anticipate, breathe, drawGlow, drift, mix, prog} from '../lib/anim';
import {CUES, chunkStart, f} from '../timings';
import {DUR, EASE} from '../theme';
import {KATANA_TSUBA_PATH} from './S04Warrior';

const bowlPos = (i: number) => ({x: 520 + ((i % 5) - 2) * 150, y: i < 5 ? 880 : 1030});
/** cuenco cerrado (borde + cuerpo) centrado en (x, y) */
const bowl = (x: number, y: number) =>
  `M ${x - 56} ${y - 24} L ${x + 56} ${y - 24} C ${x + 56} ${y + 18}, ${x + 32} ${y + 38}, ${x} ${y + 38} C ${x - 32} ${y + 38}, ${x - 56} ${y + 18}, ${x - 56} ${y - 24} Z`;
const foot = (x: number, y: number) => `M ${x - 20} ${y + 38} L ${x - 24} ${y + 50} H ${x + 24} L ${x + 20} ${y + 38}`;
const KEEP = [2, 5, 9]; // los 3 que salen bien
const FALL_ORDER = [0, 6, 3, 8, 1, 7, 4]; // orden "humano" en que se caen

export const S05Calm: React.FC = () => {
  const {t, dur, L} = useScene();
  const fall = L(CUES.bowlsFall);
  const calm = L(f(chunkStart(7)));
  const morph = prog(t, 0, 20, EASE.stroke);
  const exit = prog(t, dur - 8, 10, EASE.out);

  return (
    <Camera
      art={
        <Stage>
          <g opacity={1 - exit}>
            {Array.from({length: 10}, (_, i) => {
              const {x, y} = bowlPos(i);
              const appear = i === 0 ? 14 : 12 + i * 5; // stagger calmo
              const d = drawGlow(t, appear, 18);
              const order = FALL_ORDER.indexOf(i);
              const falls = order >= 0;
              const ft = fall + order * DUR.stagger;
              const tilt = falls ? anticipate(t, ft, 0.12) : 0;
              const dir = i % 2 === 0 ? -1 : 1;
              const rot = tilt * 17 * dir;
              const dim = falls ? prog(t, ft + 4, 14, EASE.in) : 0;
              const lit = !falls ? prog(t, fall + 12, 20, EASE.in) : 0;
              const k = breathe(t, 0.015, 90, i * 13);
              const bob = drift(t, 2, 120, i * 30);
              const pivotX = x + dir * 56;
              const pivotY = y + 50;
              return (
                <g
                  key={i}
                  transform={`translate(0 ${bob}) rotate(${rot} ${pivotX} ${pivotY}) translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`}
                  opacity={mix(dim, 1, 0.18)}
                >
                  {i === 0 && t < 20 ? (
                    <MorphPath from={KATANA_TSUBA_PATH} to={bowl(x, y)} p={morph} mode="flubber" g={1} />
                  ) : (
                    <LineDraw d={bowl(x, y)} p={i === 0 ? 1 : d.p} g={(i === 0 ? 1 : d.g) * (0.55 + lit * 0.9)} />
                  )}
                  <LineDraw d={foot(x, y)} p={prog(t, appear + 10, 10, EASE.stroke)} g={0.5 + lit} width={3} />
                  {/* vapor en los que salen bien */}
                  {KEEP.includes(i) &&
                    [-16, 14].map((o, j) => {
                      const sp = prog(t, calm + j * 6 + i, 30, EASE.stroke);
                      const sway = Math.sin((t + j * 20 + i * 7) / 14) * 6;
                      return (
                        <LineDraw
                          key={j}
                          d={`M ${x + o} ${y - 36} C ${x + o + 14 + sway} ${y - 60}, ${x + o - 14 - sway} ${y - 80}, ${x + o + sway * 0.5} ${y - 92}`}
                          p={sp}
                          g={0.6 + lit}
                          width={2.5}
                          opacity={0.5 + lit * 0.4}
                        />
                      );
                    })}
                </g>
              );
            })}
          </g>
        </Stage>
      }
      text={
        <>
          <TopLabel text="CON CALMA" delay={2} />
          <div style={{opacity: 1 - exit}}>
            <BigNumber
              value={
                <span>
                  7<span style={{opacity: 0.45, fontWeight: 500, margin: '0 0.04em'}}>/</span>10
                </span>
              }
              label="SALEN MAL"
              x={520}
              y={610}
              t={t - fall}
              size={150}
            />
          </div>
        </>
      }
    />
  );
};
