/**
 * Escena 10 — "TE ESCONDES" (acento rojo): una figura simple detrás de un muro.
 * Solo asoma la cabeza (y los dedos en el borde), mira, y se vuelve a esconder.
 */
import React from 'react';
import {Camera, Stage} from '../components/Camera';
import {LineDraw} from '../components/LineDraw';
import {TopLabel} from '../components/TopLabel';
import {useScene} from '../components/SceneContext';
import {breathe, drawGlow, mix, prog, settle} from '../lib/anim';
import {CUES} from '../timings';
import {DUR, EASE} from '../theme';

const WALL = {x: 300, y: 720, w: 440, h: 330};
const HEAD = {x: 610, r: 30};

const bricks = (() => {
  const out: string[] = [];
  const rows = 4;
  const rh = WALL.h / rows;
  for (let r = 1; r < rows; r++) out.push(`M ${WALL.x} ${WALL.y + r * rh} H ${WALL.x + WALL.w}`);
  for (let r = 0; r < rows; r++) {
    const off = r % 2 === 0 ? 0 : 55;
    for (let c = 110 - off; c < WALL.w; c += 110) {
      if (c <= 10) continue;
      out.push(`M ${WALL.x + c} ${WALL.y + r * rh + 6} V ${WALL.y + (r + 1) * rh - 6}`);
    }
  }
  return out;
})();

export const S10Hiding: React.FC = () => {
  const {t, dur, L} = useScene();
  const peekUp = L(CUES.peekUp) - 6;
  const hide = L(CUES.peek) - 10;
  // asoma despacio con desconfianza, se esconde rápido
  const up = t < hide ? settle(t, peekUp) : 1 - prog(t, hide, 7, EASE.out);
  const second = prog(t, hide + 50, 14, EASE.in) * (1 - prog(t, hide + 74, 8, EASE.out)) * 0.45;
  const rise = Math.max(up, second);
  const headY = WALL.y + HEAD.r + 8 - rise * (HEAD.r * 2 + 6);
  const look = Math.sin(Math.max(0, t - peekUp - 16) / 9) * 6 * prog(t, peekUp + 10, 10, EASE.in);
  const outline = drawGlow(t, -8, 24);
  const exit = prog(t, dur - 8, 10, EASE.out);
  const k = breathe(t, 0.01, 100);
  return (
    <Camera
      art={
        <Stage>
          <defs>
            <clipPath id="aboveWall">
              <rect x={0} y={0} width={1080} height={WALL.y - 2} />
            </clipPath>
          </defs>
          <g opacity={1 - exit} transform={`translate(520 ${WALL.y}) scale(${k}) translate(-520 ${-WALL.y})`}>
            {/* cabeza que asoma (recortada por el borde del muro) */}
            <g clipPath="url(#aboveWall)">
              <LineDraw d={`M ${HEAD.x} ${headY - HEAD.r} A ${HEAD.r} ${HEAD.r} 0 1 1 ${HEAD.x - 0.01} ${headY - HEAD.r}`} g={0.9} />
              {[-10, 10].map((o) => (
                <LineDraw key={o} d={`M ${HEAD.x + o + look} ${headY - 4} v 7`} g={0.8} width={4} />
              ))}
            </g>
            {/* dedos en el borde */}
            {[-26, -12, 12, 26].map((o, i) => {
              const fp = prog(t, peekUp + 6 + i * 2, 8, EASE.in) * (1 - prog(t, hide - 2, 5, EASE.out));
              return fp > 0.01 ? (
                <LineDraw key={o} d={`M ${HEAD.x + o * 2.2} ${WALL.y + 2} q 0 -14 6 -14 q 6 0 6 14`} p={fp} g={0.7} width={3} />
              ) : null;
            })}
            {/* muro */}
            <LineDraw
              d={`M ${WALL.x} ${WALL.y + WALL.h} V ${WALL.y} H ${WALL.x + WALL.w} V ${WALL.y + WALL.h}`}
              p={outline.p}
              g={outline.g}
            />
            <LineDraw d={`M ${WALL.x - 90} ${WALL.y + WALL.h} H ${WALL.x + WALL.w + 90}`} from="center" p={outline.p} g={outline.g * 0.5} width={3} />
            {bricks.map((b, i) => {
              const d = drawGlow(t, 4 + i * 1.5, 12, DUR.glowDelay);
              return <LineDraw key={i} d={b} p={d.p} g={d.g * 0.3} width={2.5} opacity={0.5} />;
            })}
          </g>
        </Stage>
      }
      text={<TopLabel text="[TE ESCONDES]" delay={-4} />}
    />
  );
};
