/**
 * Escena 1 — Gancho "DECIDIR": reloj de arena; la arena cae cada vez más rápido.
 * Movimiento desde el frame 1 (el reloj se dibuja de inmediato) y punch de
 * cámara cuando entra la primera frase.
 */
import React from 'react';
import {Camera, Stage} from '../components/Camera';
import {LineDraw} from '../components/LineDraw';
import {TopLabel} from '../components/TopLabel';
import {useScene} from '../components/SceneContext';
import {drawGlow, mix, prog, breathe, hash} from '../lib/anim';
import {CUES} from '../timings';
import {DUR, EASE} from '../theme';

const CX = 520;
const TOP = 570;
const BOT = 1050;
const NECK = 810;

/** semiancho interior del vidrio a la altura y (arriba o abajo del cuello) */
const half = (y: number) => {
  const d = Math.abs(y - NECK) / (NECK - TOP - 30);
  return 16 + 124 * Math.pow(Math.min(1, d), 0.62);
};

const glass = (side: 1 | -1) => {
  const x = (w: number) => CX + side * w;
  return `M ${x(140)} ${TOP + 30} C ${x(140)} ${TOP + 170}, ${x(18)} ${NECK - 70}, ${x(18)} ${NECK} C ${x(18)} ${NECK + 70}, ${x(140)} ${BOT - 170}, ${x(140)} ${BOT - 30}`;
};

export const S01Hook: React.FC = () => {
  const {t, dur, L} = useScene();
  const zoomAt = L(CUES.hookZoom);

  const frame = drawGlow(t, -2, 16);
  const glassL = drawGlow(t, 2, 18);
  const glassR = drawGlow(t, 2 + DUR.stagger, 18);
  const sandIn = prog(t, 10, 12, EASE.in);

  // La arena acelera: velocidad creciente → fase = ∫ v dt
  const tt = Math.max(0, t);
  const speed = 4 + tt * 0.22;
  const phase = 4 * tt + 0.11 * tt * tt;
  const drained = Math.min(1, Math.pow(tt / (dur + 10), 1.6)); // 0→1, acelerado

  const topLevel = mix(drained, TOP + 90, NECK - 34);
  const tw = half(topLevel) - 6;
  const topSand = `M ${CX - tw} ${topLevel} Q ${CX} ${topLevel + 34 + drained * 20} ${CX + tw} ${topLevel}`;
  const pile = mix(drained, 8, 120);
  const bw = 124;
  const botSand = `M ${CX - bw} ${BOT - 36} Q ${CX - 30} ${BOT - 36 - pile * 0.9}, ${CX} ${BOT - 36 - pile} Q ${CX + 30} ${BOT - 36 - pile * 0.9}, ${CX + bw} ${BOT - 36}`;
  const stream = `M ${CX} ${NECK + 6} L ${CX} ${BOT - 40 - pile}`;

  const punch = 0.07 * prog(t, zoomAt - 2, 26, EASE.in) - 0.012 * prog(t, zoomAt - 8, 6, EASE.stroke) * (1 - prog(t, zoomAt, 6, EASE.in));
  const wobble = Math.sin(t / 9) * 0.6 * (speed / 20);

  return (
    <Camera
      punch={punch}
      art={
        <Stage>
          <g transform={`rotate(${wobble} ${CX} ${NECK}) translate(${CX} ${NECK}) scale(${breathe(t, 0.01, 80)}) translate(${-CX} ${-NECK})`}>
            {/* placas y postes */}
            <LineDraw d={`M ${CX - 190} ${TOP} H ${CX + 190}`} from="center" p={frame.p} g={frame.g} width={4} />
            <LineDraw d={`M ${CX - 190} ${BOT} H ${CX + 190}`} from="center" p={frame.p} g={frame.g} width={4} />
            <LineDraw d={`M ${CX - 172} ${TOP} V ${BOT}`} p={glassL.p} g={glassL.g * 0.5} width={3} opacity={0.55} />
            <LineDraw d={`M ${CX + 172} ${TOP} V ${BOT}`} p={glassR.p} g={glassR.g * 0.5} width={3} opacity={0.55} />
            {/* vidrio */}
            <LineDraw d={glass(-1)} p={glassL.p} g={glassL.g} />
            <LineDraw d={glass(1)} p={glassR.p} g={glassR.g} />
            {/* arena */}
            <LineDraw d={topSand} p={sandIn} g={sandIn} width={3} />
            <LineDraw d={botSand} p={sandIn} g={sandIn} width={3} />
            <LineDraw d={stream} p={sandIn} g={sandIn * 0.8} width={3} dash={`${0.035} ${0.05}`} />
            {/* el chorro corre: un segundo trazo punteado que se desplaza */}
            <path
              d={stream}
              pathLength={1}
              stroke="#fff"
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray="0.02 0.07"
              strokeDashoffset={-phase / 60}
              opacity={sandIn}
              filter="url(#gNear)"
            />
            {/* granos sueltos que caen cada vez más rápido */}
            {Array.from({length: 6}, (_, i) => {
              const cyc = ((phase / 40 + i / 6) % 1 + 1) % 1;
              const y = mix(cyc, NECK + 10, BOT - 44 - pile);
              const x = CX + (hash(i) - 0.5) * 10;
              return (
                <circle key={i} cx={x} cy={y} r={2.2} fill="#fff" opacity={sandIn * (1 - cyc * 0.6)} />
              );
            })}
          </g>
        </Stage>
      }
      text={<TopLabel text="DECIDIR" delay={0} />}
    />
  );
};
