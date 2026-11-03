import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE, inOut, lerp, mixColor, p} from '../anim';
import {At, Headline, Mono} from '../components/primitives';
import {C, SAFE} from '../theme';
import {T} from '../timeline';
import {curveHead, goldMix, pointColor} from './Chart';

const PILL = {x1: 170, x2: 850, y: 1020, h: 104} as const;
const HANDLE = '@zerum00';
const TYPE_SIZE = 50;
const TYPE_CH = TYPE_SIZE * 0.58; // avance mono con tracking −0.02em
const TEXT_LEFT = 262;

/**
 * El punto de la curva atraviesa todo el final:
 * cabeza de la curva → punto que titila en el valle → punto dorado que brilla →
 * se desplaza → se convierte en el cursor del buscador.
 */
export const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  if (t < T.curveStart) return null;

  // ── Punto
  const head = curveHead(Math.min(t, T.close));
  const appear = p(t, T.curveStart - 0.1, 0.5);
  const glide = p(t, T.close + 0.2, 1.3);
  const morph = p(t, T.pill, 0.7);

  const typed = Math.max(0, Math.min(HANDLE.length, Math.floor((t - T.typeStart) / T.typeStep) + 1));
  const cursorX = TEXT_LEFT + typed * TYPE_CH + 5;

  const restX = SAFE.cx;
  const restY = PILL.y;
  let x = lerp(head.x, restX, glide);
  let y = lerp(head.y, restY, glide);
  x = lerp(x, cursorX, morph);

  // Titileo en el valle (2 beats), sólido al subir
  const valleyBlink =
    t < T.climb ? 0.6 + 0.4 * Math.cos((2 * Math.PI * (t - T.curveStart)) / 1.0) : 1;
  const blinkFade = p(t, T.climb - 0.4, 0.5);
  let op = appear * lerp(valleyBlink, 1, blinkFade);

  // Cursor parpadeante (sólido mientras tipea)
  if (t >= T.pill + 0.7) {
    const idle = t < T.typeStart || t >= T.typeStart + HANDLE.length * T.typeStep;
    if (idle) {
      const ph = ((t - T.pill) % 1.0) / 1.0;
      op = ph < 0.5 ? 1 : 0.0;
      // bordes suaves de 2 frames
      const e = 2 / 60;
      if (ph < e) op = ph / e;
      else if (ph > 0.5 && ph < 0.5 + e) op = 1 - (ph - 0.5) / e;
    }
  }

  const gm = goldMix(head.y);
  const baseColor = t < T.close ? pointColor(head.y) : C.gold;
  const color = mixColor(baseColor, C.cursor, morph);
  const glowK = p(t, T.climbEnd - 0.3, 0.9) * (1 - morph) * C.glowAmt;

  const w = lerp(18, 5, morph);
  const h = lerp(18, 54, morph);
  const r = lerp(9, 2.5, morph);

  // ── Textos de decisión
  const l1 = inOut(t, T.close + 0.5, 0.8, T.pill, 0.5);
  const l2 = inOut(t, T.close + 0.6, 0.8, T.pill + 0.04, 0.5);
  const dim = p(t, T.close + 1.9, 0.6);
  const hoy = inOut(t, T.close + 1.9, 0.8, T.pill + 0.1, 0.5);
  const up = (k: number) => -26 * p(t, T.pill + k, 0.5);
  const firstColor = mixColor(C.text, C.text2, dim);

  // ── Buscador
  const grow = p(t, T.pill, 0.7);
  const grow2 = p(t, T.pill + 0.05, 0.75); // el alto acompaña un pelín después
  const left = lerp(restX - 9, PILL.x1, grow);
  const right = lerp(restX + 9, PILL.x2, grow);
  const ph = lerp(18, PILL.h, grow2);
  const pillOp = t >= T.pill ? 1 : 0;
  const lupa = p(t, T.pill + 0.45, 0.6);
  const seguime = p(t, T.pill + 0.45, 0.8);

  return (
    <>
      {/* Textos */}
      <At x={SAFE.cx} y={600 + 14 * (1 - l1) + up(0)} style={{opacity: l1}}>
        <Headline size={46} tracking={0.1} color={firstColor}>El mejor momento</Headline>
      </At>
      <At x={SAFE.cx} y={662 + 14 * (1 - l2) + up(0.04)} style={{opacity: l2}}>
        <Headline size={46} tracking={0.1} color={firstColor}>fue a los 18.</Headline>
      </At>
      <At x={SAFE.cx} y={800 + 16 * (1 - hoy) + up(0.1)} style={{opacity: hoy}}>
        <Headline size={66} weight={800} tracking={0.08}>El segundo es hoy.</Headline>
      </At>

      {/* SEGUIME */}
      <At x={SAFE.cx} y={900 + 12 * (1 - seguime)} style={{opacity: seguime}}>
        <Headline size={34} weight={700} tracking={0.32}>Seguime</Headline>
      </At>

      {/* Píldora blanca */}
      {pillOp ? (
        <div
          style={{
            position: 'absolute',
            left,
            top: PILL.y - ph / 2,
            width: right - left,
            height: ph,
            borderRadius: ph / 2,
            background: C.text,
            boxShadow: `0 0 ${lerp(0, 40, grow)}px rgba(246,244,235,0.08)`,
          }}
        />
      ) : null}
      {/* Lupa */}
      <svg
        width={44}
        height={44}
        viewBox="0 0 44 44"
        style={{position: 'absolute', left: PILL.x1 + 34, top: PILL.y - 22, opacity: lupa}}
      >
        <g fill="none" stroke={C.bg} strokeWidth={3.5} strokeLinecap="round">
          <circle cx={18} cy={18} r={12} />
          <line x1={27} y1={27} x2={38} y2={38} />
        </g>
      </svg>
      {/* @zerum00 tipeado */}
      <At x={TEXT_LEFT} y={PILL.y + 1} ax={0}>
        <Mono size={TYPE_SIZE} color={C.bg} weight={500}>
          {HANDLE.slice(0, typed)}
        </Mono>
      </At>

      {/* Punto → cursor */}
      <div
        style={{
          position: 'absolute',
          left: x - w / 2,
          top: y - h / 2,
          width: w,
          height: h,
          borderRadius: r,
          background: color,
          opacity: op,
          boxShadow:
            glowK > 0.001
              ? `0 0 ${18 * glowK}px rgba(${C.glow},${0.75 * glowK}), 0 0 ${60 * glowK}px rgba(${C.glow},${0.3 * glowK})`
              : gm > 0
                ? `0 0 10px rgba(${C.glow},${0.35 * gm})`
                : '0 0 10px rgba(246,244,235,0.25)',
        }}
      />
    </>
  );
};
