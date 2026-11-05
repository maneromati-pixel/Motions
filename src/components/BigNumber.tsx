/**
 * Número o palabra clave grande (165px bold, glow fuerte) con mini etiqueta
 * debajo (20px, tracking 0.4em, 60%). Entra con spring + tracking-in.
 */
import React from 'react';
import {COLORS, EASE, TYPE} from '../theme';
import {breathe, mix, prog, settle} from '../lib/anim';
import {textGlow} from './Glow';

type Props = {
  value: React.ReactNode;
  label?: string;
  x: number;
  y: number;
  t: number; // frame local relativo a la aparición
  exit?: number; // frame local relativo en que sale
  size?: number;
  color?: string;
  glow?: number;
  labelT?: number; // tiempo propio de la etiqueta (para que no parpadee al cambiar el número)
  hideLabel?: boolean;
};

export const BigNumber: React.FC<Props> = ({value, label, x, y, t, exit = 9999, size = TYPE.big.size, color = COLORS.white, glow = 1.2, labelT, hideLabel}) => {
  if (t < 0) return null;
  const s = settle(t, 0);
  const out = prog(t, exit, 10, EASE.out);
  const lp = prog(labelT ?? t, 8, 18, EASE.in);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 400,
        width: 800,
        top: y,
        textAlign: 'center',
        transform: `translateY(-50%) translateY(${mix(out, 0, -24)}px)`,
        opacity: Math.min(prog(t, 0, 6, EASE.in), 1 - out),
        fontFamily: TYPE.family,
      }}
    >
      <div
        style={{
          fontSize: size,
          fontWeight: TYPE.big.weight,
          lineHeight: 1,
          color,
          letterSpacing: `${mix(prog(t, 0, 20, EASE.in), 0.1, -0.02)}em`,
          transform: `scale(${mix(s, 0.86, 1) * breathe(t, 0.015, 70)})`,
          textShadow: textGlow(glow),
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>
      {label && (
        <div
          style={{
            marginTop: 18,
            visibility: hideLabel ? 'hidden' : undefined,
            fontSize: TYPE.bigLabel.size,
            fontWeight: 600,
            letterSpacing: TYPE.bigLabel.tracking,
            paddingLeft: TYPE.bigLabel.tracking,
            color: COLORS.white,
            opacity: TYPE.bigLabel.opacity * lp,
            transform: `translateY(${mix(lp, 8, 0)}px)`,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
