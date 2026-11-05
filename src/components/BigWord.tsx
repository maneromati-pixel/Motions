/**
 * Tipografía cinética grande: en 4–5 momentos fuertes la palabra clave salta
 * al centro (tracking-in 0.1em → 0, spring suave, glow fuerte).
 * Se dispara cuando la voz dice la palabra clave del chunk marcado con `big`.
 */
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS, EASE, SAFE, TYPE} from '../theme';
import {BIG_MOMENTS, SCENES} from '../timings';
import {breathe, mix, prog, settle} from '../lib/anim';
import {textGlow} from './Glow';

const HOLD = 46; // frames en pantalla (máximo)
const IN = 12;
const OUT = 10;

/** Cada palabra grande se queda HOLD frames, o hasta 2 frames después del corte de su escena. */
export const BIGS = BIG_MOMENTS.map((b) => {
  const s = SCENES.find((x) => x.start <= b.at && x.end > b.at)!;
  return {...b, hold: Math.min(HOLD, s.end - b.at - OUT + 4)};
});

/** 0→1: cuánto se atenúa la ilustración mientras hay una palabra grande. */
export const bigDim = (g: number) =>
  Math.max(0, ...BIGS.map((b) => Math.min(prog(g, b.at - 2, IN, EASE.in), 1 - prog(g, b.at + b.hold - 4, OUT + 6, EASE.out))));

export const BigWordLayer: React.FC = () => {
  const g = useCurrentFrame();
  const b = BIGS.find((x) => g >= x.at - 1 && g < x.at + x.hold + OUT);
  if (!b) return null;
  const t = g - b.at;
  const s = settle(t, 0);
  const out = prog(t, b.hold, OUT, EASE.out);
  const track = mix(prog(t, 0, 22, EASE.in), 0.1, 0);
  const size = Math.min(TYPE.big.size, 860 / (b.text.length * 0.64));
  const color = b.accent ? COLORS.accent : COLORS.white;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: SAFE.centerX * 2,
          top: SAFE.stageY,
          textAlign: 'center',
          transform: `translateY(-50%) translateY(${mix(out, 0, -30)}px) scale(${mix(s, 0.9, 1) * breathe(t, 0.012, 60)})`,
          opacity: Math.min(prog(t, 0, 8, EASE.in), 1 - out),
          fontFamily: TYPE.family,
          fontWeight: TYPE.big.weight,
          fontSize: size,
          letterSpacing: `${track}em`,
          color,
          lineHeight: 1,
          textShadow: b.accent ? textGlow(1.1, '200,16,46') : textGlow(1.2),
          filter: out > 0 ? `blur(${out * 6}px)` : undefined,
        }}
      >
        {b.text}
      </div>
    </AbsoluteFill>
  );
};
