import React from 'react';
import {Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE_SINE, inOut, lerp, mixColor, p} from '../anim';
import {At, Headline, Micro, Mono} from '../components/primitives';
import {DATA, fvMonths} from '../data';
import {C, HEIGHT, WIDTH} from '../theme';
import {T} from '../timeline';
import {GROUND} from './Comparison';

/** Geometría del gráfico. */
export const CH = {
  ox: 150, // origen
  oy: 1240,
  xEnd: 900, // fin del eje (flecha)
  yTop: 420, // fin del eje Y (flecha)
  plotW: 710, // 20 → 65 años
  plotH: 720, // 0 → $1.054.900
} as const;

const MONTHS = (DATA.endAge - DATA.startAge) * 12;
const EASE_CLIMB = Easing.bezier(0.5, 0, 0.2, 1);

export const cx = (m: number) => CH.ox + (CH.plotW * m) / MONTHS;
export const cy = (v: number) => CH.oy - (CH.plotH * v) / DATA.totalAt65;

/** Edad en la cabeza de la curva según el reloj (avanza, se frena en el valle, se dispara). */
export const curveAge = (t: number) => {
  if (t < T.curveStart) return DATA.startAge;
  if (t < T.climb) return lerp(20, 41, p(t, T.curveStart, T.valleyStop - T.curveStart, EASE_SINE));
  return lerp(41, 65, p(t, T.climb, T.climbEnd - T.climb, EASE_CLIMB));
};

export const curveHead = (t: number) => {
  const m = (curveAge(t) - DATA.startAge) * 12;
  return {x: cx(m), y: cy(fvMonths(m)), m};
};

/** Fracción de altura donde el trazo vira de blanco a dorado (compartido con el punto). */
export const goldMix = (y: number) => {
  const f = (CH.oy - y) / CH.plotH;
  return Math.min(1, Math.max(0, (f - 0.1) / 0.32));
};

const pathTo = (mEnd: number) => {
  const step = 2;
  let d = `M ${cx(0).toFixed(2)} ${cy(0).toFixed(2)}`;
  for (let m = step; m < mEnd; m += step) d += ` L ${cx(m).toFixed(2)} ${cy(fvMonths(m)).toFixed(2)}`;
  if (mEnd > 0) d += ` L ${cx(mEnd).toFixed(2)} ${cy(fvMonths(mEnd)).toFixed(2)}`;
  return d;
};

/**
 * 40,4–56 s EL VALLE + LA CURVA.
 * La línea del piso de la escena anterior baja y se convierte en el eje TIEMPO.
 */
export const Chart: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  if (t < T.cut || t > T.close + 1.2) return null;

  // Piso → eje X
  const km = p(t, T.valley + 0.25, 1.1);
  const x1 = lerp(GROUND.x1, CH.ox, km);
  const x2 = lerp(GROUND.x2, CH.xEnd, km);
  const y0 = lerp(GROUND.y, CH.oy, km);
  const axisColor = mixColor(C.off, C.text2, km);

  const yAxis = p(t, T.valley + 1.0, 0.9);
  const arrows = p(t, T.valley + 1.5, 0.5);
  const lblY = p(t, T.valley + 1.6, 0.7);
  const lblX = p(t, T.valley + 1.75, 0.7);
  const tick20 = p(t, T.valley + 1.9, 0.6);
  const tick65 = p(t, T.climbEnd - 0.2, 0.6);

  // Salida: el gráfico se retira y deja sólo el punto
  const exit = p(t, T.close + 0.15, 0.65);
  const exitY = 24 * exit;
  const chartOp = 1 - exit;

  const head = curveHead(t);
  const d = pathTo(head.m);

  const abandonOp = inOut(t, T.curveStart + 2.0, 0.8, T.climb + 0.1, 0.5);
  const abandonY = 12 * p(t, T.climb + 0.1, 0.5) + 12 * (1 - p(t, T.curveStart + 2.0, 0.8));
  const millonOp = inOut(t, T.climbEnd + 0.2, 0.8, T.close, 0.45);
  const millonY = 14 * (1 - p(t, T.climbEnd + 0.2, 0.8)) - 12 * p(t, T.close, 0.45);

  const gradY1 = CH.oy - CH.plotH * 0.1;
  const gradY2 = CH.oy - CH.plotH * 0.42;

  return (
    <>
      <svg
        width={WIDTH}
        height={HEIGHT}
        style={{position: 'absolute', inset: 0, opacity: chartOp, transform: `translateY(${exitY}px)`}}
      >
        <defs>
          <linearGradient id="curveStroke" gradientUnits="userSpaceOnUse" x1="0" y1={gradY1} x2="0" y2={gradY2}>
            <stop offset="0" stopColor={C.curveLow} />
            <stop offset="0.55" stopColor={C.gold} />
            <stop offset="1" stopColor={C.goldHi} />
          </linearGradient>
          <linearGradient id="curveGlow" gradientUnits="userSpaceOnUse" x1="0" y1={gradY1} x2="0" y2={gradY2}>
            <stop offset="0" stopColor={C.gold} stopOpacity={0} />
            <stop offset="1" stopColor={C.gold} stopOpacity={0.55} />
          </linearGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        {/* Eje X (era el piso) */}
        <line x1={x1} y1={y0} x2={x2} y2={y0} stroke={axisColor} strokeWidth={2} strokeLinecap="round" />
        {/* Eje Y */}
        <line
          x1={CH.ox}
          y1={CH.oy}
          x2={CH.ox}
          y2={lerp(CH.oy, CH.yTop, yAxis)}
          stroke={C.text2}
          strokeWidth={2}
          strokeLinecap="round"
          opacity={yAxis > 0 ? 1 : 0}
        />
        {/* Flechas */}
        <g stroke={C.text2} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={arrows}>
          <polyline points={`${CH.ox - 9},${CH.yTop + 12} ${CH.ox},${CH.yTop} ${CH.ox + 9},${CH.yTop + 12}`} />
          <polyline points={`${CH.xEnd - 12},${CH.oy - 9} ${CH.xEnd},${CH.oy} ${CH.xEnd - 12},${CH.oy + 9}`} />
        </g>

        {/* Curva */}
        {head.m > 0 ? (
          <>
            <path d={d} fill="none" stroke="url(#curveGlow)" strokeWidth={12} filter="url(#soft)" />
            <path d={d} fill="none" stroke="url(#curveStroke)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : null}
      </svg>

      <div style={{position: 'absolute', inset: 0, opacity: chartOp, transform: `translateY(${exitY}px)`}}>
        <At x={CH.ox + 26} y={CH.yTop + 2} ax={0} style={{opacity: lblY}}>
          <Micro align="left" size={20}>Patrimonio</Micro>
        </At>
        <At x={CH.xEnd} y={CH.oy - 34} ax={1} style={{opacity: lblX}}>
          <Micro align="right" size={20}>Tiempo</Micro>
        </At>
        <At x={CH.ox} y={CH.oy + 46} style={{opacity: tick20}}>
          <Mono size={22} color={C.text2} weight={400}>20</Mono>
        </At>
        <At x={cx(MONTHS)} y={CH.oy + 46} style={{opacity: tick65}}>
          <Mono size={22} color={C.text2} weight={400}>65</Mono>
        </At>
      </div>

      <At x={510} y={1060 + abandonY} style={{opacity: abandonOp}}>
        <Headline size={42} tracking={0.1}>Acá todos abandonan.</Headline>
      </At>

      <At x={CH.ox + 24} y={600 + millonY} ax={0} ay={1} style={{opacity: millonOp}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
          <Headline size={50} tracking={0.08} style={{paddingLeft: 0}}>Acá se hace</Headline>
          <Headline size={50} tracking={0.08} style={{paddingLeft: 0}}>el millón.</Headline>
        </div>
      </At>
    </>
  );
};

export const pointColor = (y: number) => mixColor(C.curveLow, C.gold, goldMix(y));
