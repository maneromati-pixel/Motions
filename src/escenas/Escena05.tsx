import React from 'react';
import {Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Moneda} from '../componentes/Moneda';
import {Titulo} from '../componentes/Titulo';
import {ZonaSegura} from '../componentes/Escenario';
import {GLOW, glowIntenso, SUAVE} from '../tema';

// [19–24s] Un vaso que se llena de monedas hasta el borde.
const W = 440;
const H = 580;
const ARR = 18; // margen lateral arriba
const ABJ = 64; // margen lateral abajo (vaso más angosto abajo)
const MON = 66;
const PASO_Y = 60;

const paredIzq = (y: number) => ARR + (ABJ - ARR) * (y / H);

type Pos = {x: number; y: number; rot: number};
const POSICIONES: Pos[] = (() => {
  const res: Pos[] = [];
  for (let fila = 0; ; fila++) {
    const cy = H - 12 - MON / 2 - fila * PASO_Y;
    if (cy - MON / 2 < 2) break;
    const izq = paredIzq(cy) + 10;
    const util = W - izq * 2;
    const n = Math.floor(util / (MON + 4));
    const paso = util / n;
    for (let k = 0; k < n; k++) {
      res.push({
        x: izq + paso * (k + 0.5) + (random(`x${fila}-${k}`) - 0.5) * 6,
        y: cy + (random(`y${fila}-${k}`) - 0.5) * 4,
        rot: (random(`r${fila}-${k}`) - 0.5) * 40,
      });
    }
  }
  return res;
})();

const INICIO = 10;
const INTERVALO = 2.3;
const CAIDA = 16;

export const Escena05: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ultimo = INICIO + (POSICIONES.length - 1) * INTERVALO + CAIDA;
  const lleno = spring({frame: frame - ultimo, fps, config: SUAVE, durationInFrames: 20});
  const vaso = `M ${ARR} 0 L ${ABJ} ${H - 18} Q ${ABJ + 2} ${H} ${ABJ + 22} ${H} L ${W - ABJ - 22} ${H} Q ${W - ABJ - 2} ${H} ${W - ABJ} ${H - 18} L ${W - ARR} 0`;
  return (
    <ZonaSegura>
      <Titulo texto="GASTOS" delay={4} size={40} style={{marginBottom: 90}} />
      <div style={{position: 'relative', width: W, height: H}}>
        {POSICIONES.map((p, i) => {
          const t0 = INICIO + i * INTERVALO;
          const t = interpolate(frame, [t0, t0 + CAIDA], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.in(Easing.quad),
          });
          if (t <= 0) return null;
          const rebote = -10 * Math.sin(Math.PI * interpolate(frame, [t0 + CAIDA, t0 + CAIDA + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
          const desdeY = -260;
          const y = desdeY + (p.y - desdeY) * t + rebote;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: p.x - MON / 2,
                top: y - MON / 2,
                opacity: interpolate(t, [0, 0.35], [0, 1], {extrapolateRight: 'clamp'}),
                transform: `rotate(${p.rot * t}deg)`,
              }}
            >
              <Moneda tam={MON} />
            </div>
          );
        })}
        <svg
          width={W}
          height={H}
          style={{position: 'absolute', inset: 0, overflow: 'visible', filter: lleno > 0 ? glowIntenso(lleno * 0.6) : GLOW}}
        >
          <path d={vaso} fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </ZonaSegura>
  );
};
