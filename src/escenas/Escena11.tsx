import React from 'react';
import {useTiempo} from '../tiempo';
import {Easing, interpolate} from 'remotion';
import {getLength, getPointAtLength} from '@remotion/paths';
import {Titulo} from '../componentes/Titulo';
import {ZonaSegura} from '../componentes/Escenario';
import {COLOR, FUENTE, glowIntenso, GLOW} from '../tema';

// [62–70s] Gráfico ingreso / tiempo: curva plana que después sube fuerte.
const W = 820;
const H = 700;
const OX = 90; // origen
const OY = 640;
const X1 = 770;
const K = 4.6;

const CURVA = (() => {
  const pts: string[] = [];
  for (let i = 0; i <= 80; i++) {
    const t = i / 80;
    const x = OX + 20 + (X1 - OX - 20) * t;
    const y = OY - 40 - 540 * ((Math.exp(K * t) - 1) / (Math.exp(K) - 1));
    pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(' ');
})();
const LARGO = getLength(CURVA);
const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Escena11: React.FC = () => {
  const frame = useTiempo();
  const ejes = interpolate(frame, [4, 26], [0, 1], {...CL, easing: Easing.out(Easing.cubic)});
  const p = interpolate(frame, [26, 165], [0, 1], {...CL, easing: Easing.inOut(Easing.quad)});
  const punto = getPointAtLength(CURVA, Math.max(0.01, LARGO * p));
  const etiqueta = {
    fontFamily: FUENTE,
    fontWeight: 500,
    fontSize: 26,
    letterSpacing: '0.3em',
    fill: COLOR.grisMedio,
  };
  return (
    <ZonaSegura>
      <svg width={W} height={H} style={{overflow: 'visible'}}>
        <g opacity={ejes} stroke="#9A9A9A" strokeWidth={3} strokeLinecap="round" fill="none">
          <path d={`M ${OX} ${OY} L ${OX} ${OY - (OY - 40) * ejes}`} />
          <path d={`M ${OX} ${OY} L ${OX + (X1 + 20 - OX) * ejes} ${OY}`} />
          <path d={`M ${OX - 10} 54 L ${OX} 40 L ${OX + 10} 54`} />
          <path d={`M ${X1 + 6} ${OY - 10} L ${X1 + 20} ${OY} L ${X1 + 6} ${OY + 10}`} />
        </g>
        <text {...etiqueta} opacity={ejes} transform={`translate(${OX - 30} 40) rotate(-90)`} textAnchor="end">
          INGRESO
        </text>
        <text {...etiqueta} opacity={ejes} x={X1 + 26} y={OY + 56} textAnchor="end">
          TIEMPO
        </text>
        <path
          d={CURVA}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={7}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={LARGO}
          strokeDashoffset={LARGO * (1 - p)}
          style={{filter: GLOW}}
        />
        {p > 0 && punto && (
          <circle cx={punto.x} cy={punto.y} r={14} fill="#FFFFFF" style={{filter: glowIntenso(1)}} />
        )}
      </svg>
      <Titulo texto={'EMPEZÁ CON\nLO QUE TENÉS'} delay={140} size={44} color="#FFFFFF" glow style={{marginTop: 70}} />
    </ZonaSegura>
  );
};
