import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, money} from '../theme';
import {appear, useIn} from '../ui/anim';
import {BigText, Label, ProgressBar} from '../ui/primitives';
import type {SceneProps} from './types';

// Saldos por edad con aportes de $100/mes al 8% anual hasta los 65.
const AGES = [25, 35, 45, 55, 65];
const A = [0, 18300, 58900, 149000, 349000];
const B = [0, 0, 18300, 58900, 149000];
const MAX = 349000;

const at = (table: number[], age: number) => interpolate(age, AGES, table, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const Row: React.FC<{label: string; value: number; strong?: boolean; p: number}> = ({label, value, strong, p}) => (
  <div style={{...appear(p), width: 860}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24}}>
      <Label color={strong ? COLORS.white : COLORS.gray} glow={strong} size={30}>
        {label}
      </Label>
      <BigText size={strong ? 84 : 70} glow={strong ? 'normal' : 'none'} color={strong ? COLORS.white : COLORS.gray}>
        {money(value)}
      </BigText>
    </div>
    <ProgressBar p={value / MAX} strong={strong} />
  </div>
);

export const Scene06Numeros: React.FC<SceneProps> = ({cues, duration}) => {
  const frame = useCurrentFrame();
  const start = cues.grow;
  // La edad llega a 65 cuando la voz dice el resultado final (o al 85% de la escena).
  const end = Math.max(start + 45, Math.min(cues.a ?? duration * 0.85, duration - 10));
  const age = interpolate(frame, [start, end], [25, 65], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
  const pAge = useIn(2);
  const pB = useIn(6);
  const pA = useIn(12);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', top: 250, right: 90, textAlign: 'right', ...appear(pAge)}}>
        <Label size={28}>Edad</Label>
        <BigText size={120} glow="soft" style={{marginTop: 10}}>
          {Math.round(age)}
        </BigText>
      </div>
      <div style={{position: 'absolute', left: 110, top: 720, display: 'flex', flexDirection: 'column', gap: 110}}>
        <Row label="Empezó a los 35" value={at(B, age)} p={pB} />
        <Row label="Empezó a los 25" value={at(A, age)} p={pA} strong />
      </div>
    </div>
  );
};
