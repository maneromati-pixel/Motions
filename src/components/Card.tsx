/**
 * <Card>: tarjeta de línea (rect redondeado dibujado con stroke) + título.
 * `active` = glow y tilde que se dibuja; inactiva = gris apagado.
 */
import React from 'react';
import {COLORS, EASE, TYPE} from '../theme';
import {breathe, drawGlow, mix, prog} from '../lib/anim';
import {LineDraw} from './LineDraw';
import {textGlow} from './Glow';

type Props = {
  x: number; // centro
  y: number;
  w: number;
  h: number;
  title: string;
  t: number; // frame local desde la aparición
  active: number; // 0→1 activación
  check?: number; // frame local (relativo a t) en que se dibuja la tilde
  dim?: number; // 0→1 apagado
  icon?: (p: number, g: number) => React.ReactNode;
};

const rr = (x: number, y: number, w: number, h: number, r: number) =>
  `M ${x + r} ${y} H ${x + w - r} Q ${x + w} ${y} ${x + w} ${y + r} V ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} H ${x + r} Q ${x} ${y + h} ${x} ${y + h - r} V ${y + r} Q ${x} ${y} ${x + r} ${y} Z`;

export const Card: React.FC<Props> = ({x, y, w, h, title, t, active, check, dim = 0, icon}) => {
  const {p, g} = drawGlow(t, 0, 22);
  const k = breathe(t, 0.012 * (0.4 + active), 90);
  const op = mix(dim, 1, 0.32);
  const titleP = prog(t, 10, 16, EASE.in);
  const ck = check !== undefined ? drawGlow(t, check, 12) : {p: 0, g: 0};
  const cx = x;
  const cy = y - h * 0.1;
  return (
    <g transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`} opacity={op}>
      <LineDraw d={rr(x - w / 2, y - h / 2, w, h, 34)} p={p} g={g * (0.25 + active * 0.9)} width={3} />
      {icon?.(p, g)}
      {check !== undefined && (
        <LineDraw d={`M ${cx - 34} ${cy} L ${cx - 8} ${cy + 26} L ${cx + 40} ${cy - 30}`} p={ck.p} g={ck.g * 1.4} width={4} />
      )}
      <foreignObject x={x - w / 2} y={y + h * 0.24 - 30} width={w} height={60}>
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            fontFamily: TYPE.family,
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: '0.3em',
            paddingLeft: '0.3em',
            lineHeight: '60px',
            color: COLORS.white,
            opacity: titleP * mix(active, 0.55, 1),
            transform: `translateY(${mix(titleP, 8, 0)}px)`,
            textShadow: textGlow(active * 0.7),
          }}
        >
          {title}
        </div>
      </foreignObject>
    </g>
  );
};
