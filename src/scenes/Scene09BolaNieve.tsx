import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, GLOW} from '../theme';
import {fadeIn, ramp} from '../ui/anim';
import {Label} from '../ui/primitives';
import type {SceneProps} from './types';

const Snowball: React.FC<{p: number}> = ({p}) => {
  const groundY = 1150;
  const e = p * p * p; // cada vez más rápido
  const r = 22 + 150 * e;
  const x = 130 + 760 * e;
  const angle = ((x - 130) / ((22 + r) / 2)) * (180 / Math.PI);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <line x1={90} y1={groundY} x2={990} y2={groundY} stroke={COLORS.dark} strokeWidth={2} />
      <g transform={`translate(${x} ${groundY - r}) rotate(${angle})`} style={{filter: GLOW.drop}}>
        <circle r={r} fill={COLORS.white} />
        <circle cx={r * 0.45} cy={-r * 0.2} r={r * 0.09} fill={COLORS.gray} />
        <circle cx={-r * 0.3} cy={r * 0.4} r={r * 0.07} fill={COLORS.gray} />
      </g>
    </svg>
  );
};

const Chart: React.FC<{p: number}> = ({p}) => {
  const ox = 170;
  const oy = 1260;
  const w = 760;
  const h = 640;
  const N = 80;
  const pts: [number, number][] = [];
  const k = 4;
  for (let i = 0; i <= N * p; i++) {
    const u = i / N;
    pts.push([ox + u * w, oy - ((Math.exp(k * u) - 1) / (Math.exp(k) - 1)) * h]);
  }
  const tip = pts[pts.length - 1];
  const d = pts.map((q, i) => `${i ? 'L' : 'M'}${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(' ');
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <path d={`M${ox} ${oy - h - 40} V${oy} H${ox + w + 40}`} stroke={COLORS.gray} strokeWidth={2} fill="none" />
        <path d={d} stroke={COLORS.white} strokeWidth={6} fill="none" strokeLinecap="round" style={{filter: GLOW.drop}} />
        {tip ? (
          <circle cx={tip[0]} cy={tip[1]} r={14} fill={COLORS.white} style={{filter: 'drop-shadow(0 0 16px #fff) drop-shadow(0 0 40px #fff)'}} />
        ) : null}
      </svg>
      <div style={{position: 'absolute', top: oy + 40, left: ox + w - 260, width: 300, textAlign: 'right'}}>
        <Label size={28}>Tiempo</Label>
      </div>
      <div style={{position: 'absolute', top: oy - h - 40, left: ox - 30, transform: 'rotate(-90deg) translateX(-100%)', transformOrigin: 'top left'}}>
        <Label size={28}>Dinero</Label>
      </div>
    </>
  );
};

export const Scene09BolaNieve: React.FC<SceneProps> = ({cues, duration}) => {
  const frame = useCurrentFrame();
  const split = Math.min(cues.curve, duration - 40);
  const ball = interpolate(frame, [4, split], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ballOut = 1 - ramp(frame, split - 8, split);
  const chartIn = fadeIn(frame, split + 2, 8);
  const curve = interpolate(frame, [split + 6, Math.max(split + 40, duration - 12)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', top: 440, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: fadeIn(frame, 2)}}>
        <Label color={COLORS.white} glow>
          Bola de nieve
        </Label>
      </div>
      <div style={{opacity: ballOut}}>
        <Snowball p={ball} />
      </div>
      {frame >= split ? (
        <div style={{opacity: chartIn, position: 'absolute', inset: 0}}>
          <Chart p={curve} />
        </div>
      ) : null}
    </div>
  );
};
