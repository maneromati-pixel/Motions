/**
 * Escena 14 — "PRUDENCIA": balanza que oscila con física de resorte
 * (amortiguada) y termina equilibrada. Los platos cuelgan siempre verticales.
 */
import React from 'react';
import {spring} from 'remotion';
import {Camera, Stage} from '../components/Camera';
import {LineDraw} from '../components/LineDraw';
import {TopLabel} from '../components/TopLabel';
import {useScene} from '../components/SceneContext';
import {breathe, drawGlow, prog} from '../lib/anim';
import {CUES} from '../timings';
import {DUR, EASE, SPRING, VIDEO} from '../theme';

const PX = 520;
const PY = 640; // pivote
const ARM = 250;
const STR = 230; // largo de las cuerdas

export const S14Prudence: React.FC = () => {
  const {t, dur, L} = useScene();
  const release = 14;
  const settleAt = L(CUES.scaleSettle);
  // ángulo: arranca inclinada y se suelta; el spring oscila alrededor de 0 y se asienta
  const s = spring({frame: t - release, fps: VIDEO.fps, config: SPRING.pendulum});
  const lock = prog(t, settleAt - 20, 30, EASE.in); // garantiza equilibrio exacto al llegar a "más tarda"
  const angle = 17 * (1 - s) * (1 - lock);
  const rad = (angle * Math.PI) / 180;
  const ends = [-1, 1].map((d) => ({x: PX + Math.cos(rad) * ARM * d, y: PY + Math.sin(rad) * ARM * d}));

  const post = drawGlow(t, -10, 22);
  const beam = drawGlow(t, -4, 18);
  const pans = drawGlow(t, 2, 18);
  const balanced = prog(t, settleAt - 6, 20, EASE.in);
  const exit = prog(t, dur - 8, 10, EASE.out);
  const k = breathe(t, 0.01, 90);

  return (
    <Camera
      art={
        <Stage>
          <g opacity={1 - exit} transform={`translate(${PX} ${PY}) scale(${k}) translate(${-PX} ${-PY})`}>
            {/* columna y base */}
            <LineDraw d={`M ${PX} ${PY} V 1060`} p={post.p} g={post.g} />
            <LineDraw d={`M ${PX - 110} 1060 Q ${PX} 1030 ${PX + 110} 1060`} p={post.p} g={post.g} />
            <circle cx={PX} cy={PY} r={9} fill="none" stroke="#fff" strokeWidth={3} opacity={beam.p} />
            {/* brazo */}
            <LineDraw d={`M ${ends[0].x} ${ends[0].y} L ${ends[1].x} ${ends[1].y}`} from="center" p={beam.p} g={beam.g * (0.7 + balanced * 0.8)} />
            {ends.map((e, i) => {
              const py = e.y + STR;
              return (
                <g key={i}>
                  <LineDraw d={`M ${e.x} ${e.y} L ${e.x - 70} ${py} M ${e.x} ${e.y} L ${e.x + 70} ${py}`} p={pans.p} g={pans.g * 0.4} width={2} opacity={0.6} />
                  <LineDraw
                    d={`M ${e.x - 92} ${py} Q ${e.x} ${py + 70} ${e.x + 92} ${py} Z`}
                    p={prog(t, 8 + i * DUR.stagger, 16, EASE.stroke)}
                    g={pans.g * (0.7 + balanced * 0.6)}
                  />
                </g>
              );
            })}
            {/* indicador central: marca vertical que se alinea al equilibrarse */}
            <LineDraw d={`M ${PX} ${PY - 20} L ${PX + Math.sin(rad) * 60} ${PY - 20 - Math.cos(rad) * 60}`} p={beam.p} g={balanced * 1.4} width={3} />
          </g>
        </Stage>
      }
      text={<TopLabel text="PRUDENCIA" delay={-4} />}
    />
  );
};
