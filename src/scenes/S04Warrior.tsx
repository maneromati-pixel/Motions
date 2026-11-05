/**
 * Escena 4 — "EL GUERRERO": katana dibujada en un solo trazo rápido, con un
 * tajo (rotación + motion blur real), un destello que recorre la hoja y el
 * SFX metálico. La tsuba es el círculo 7 que llegó de la escena anterior.
 */
import React from 'react';
import {Camera, Stage} from '../components/Camera';
import {LineDraw} from '../components/LineDraw';
import {TopLabel} from '../components/TopLabel';
import {MotionBlur} from '../components/MotionBlur';
import {useScene} from '../components/SceneContext';
import {breathe, drawGlow, mix, prog, settle} from '../lib/anim';
import {CUES} from '../timings';
import {EASE} from '../theme';
import {TSUBA} from './S03Breaths';

const T = {x: TSUBA.x, y: TSUBA.y};
const U = {x: 0.914, y: -0.406}; // eje de la hoja
const N = {x: 0.406, y: 0.914}; // normal
const pt = (s: number, w: number) => `${(T.x + U.x * s + N.x * w).toFixed(1)} ${(T.y + U.y * s + N.y * w).toFixed(1)}`;

/** Katana completa en UN solo trazo continuo. */
const KATANA = [
  `M ${pt(-195, -13)} L ${pt(-16, -13)}`,
  `L ${pt(16, -11)} Q ${pt(330, -26)} ${pt(600, 0)}`,
  `Q ${pt(330, 2)} ${pt(16, 11)}`,
  `L ${pt(-16, 13)} L ${pt(-195, 13)} Q ${pt(-206, 0)} ${pt(-195, -13)}`,
].join(' ');
const BACK = `M ${pt(16, -11)} Q ${pt(330, -26)} ${pt(600, 0)}`;
const WRAPS = Array.from({length: 6}, (_, i) => {
  const s = -180 + i * 27;
  return `M ${pt(s, -13)} L ${pt(s + 13.5, 13)} L ${pt(s + 27, -13)}`;
});
const tsubaPath = `M ${T.x} ${T.y - TSUBA.r} A ${TSUBA.r} ${TSUBA.r} 0 1 1 ${T.x - 0.01} ${T.y - TSUBA.r}`;
export const KATANA_TSUBA_PATH = tsubaPath;

/** La parte que se mueve rápido: lee el frame adentro para el motion blur. */
const Blade: React.FC = () => {
  const {t, dur, L} = useScene();
  const draw = L(CUES.katanaDraw) + 6;
  const swing = settle(t, draw);
  const rot = mix(swing, -38, 0);
  const stroke = prog(t, draw, 9, EASE.stroke);
  const glow = prog(t, draw + 6, 12, EASE.in);
  const out = prog(t, dur - 10, 14, EASE.stroke); // se "borra" hacia la punta
  const k = breathe(t, 0.012, 90);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <g transform={`rotate(${rot} ${T.x} ${T.y}) translate(${T.x} ${T.y}) scale(${k}) translate(${-T.x} ${-T.y})`}>
        <LineDraw d={KATANA} p={stroke} g={glow} tail={out} />
        {WRAPS.map((w, i) => {
          const d = drawGlow(t, draw + 8 + i * 2, 8);
          return <LineDraw key={i} d={w} p={d.p} g={d.g * 0.6} width={2.5} opacity={0.8 * (1 - out)} />;
        })}
      </g>
    </svg>
  );
};

export const S04Warrior: React.FC = () => {
  const {t, dur, L} = useScene();
  const draw = L(CUES.katanaDraw) + 6;
  const shine = L(CUES.katanaShine);
  // estela del tajo: arco que se dibuja y se borra muy rápido
  const arcP = prog(t, draw - 1, 7, EASE.in);
  const arcTail = prog(t, draw + 3, 9, EASE.in);
  const sh = prog(t, shine, 14, EASE.stroke);
  const glint = Math.sin(Math.PI * prog(t, shine + 10, 12, EASE.stroke));
  const tip = {x: T.x + U.x * 600, y: T.y + U.y * 600};
  const out = prog(t, dur - 10, 14, EASE.stroke);
  return (
    <Camera
      art={
        <>
          <MotionBlur samples={10} shutter={240}>
            <Blade />
          </MotionBlur>
          <Stage>
            {/* tsuba: llega desde el círculo 7 (se queda hasta transformarse en cuenco) */}
            <LineDraw d={tsubaPath} p={prog(t, 6, 1)} g={1} />
            <LineDraw
              d={`M ${T.x - 420} ${T.y + 120} Q ${T.x + 150} ${T.y - 420} ${tip.x + 60} ${tip.y + 40}`}
              p={arcP}
              tail={arcTail}
              g={1}
              width={2}
              opacity={0.6}
            />
            {/* destello que recorre la hoja */}
            {sh > 0 && sh < 1 && (
              <path
                d={BACK}
                pathLength={1}
                fill="none"
                stroke="#fff"
                strokeWidth={6}
                strokeLinecap="round"
                strokeDasharray="0.14 3"
                strokeDashoffset={mix(sh, 0.14, -1)}
                filter="url(#gNear)"
                opacity={1 - out}
              />
            )}
            {glint > 0.01 && (
              <g transform={`translate(${tip.x} ${tip.y}) scale(${glint}) rotate(${t * 2})`} opacity={glint}>
                <LineDraw d="M -34 0 H 34 M 0 -34 V 34" g={1.6} width={2.5} />
              </g>
            )}
          </Stage>
        </>
      }
      text={<TopLabel text="EL GUERRERO" delay={2} />}
    />
  );
};
