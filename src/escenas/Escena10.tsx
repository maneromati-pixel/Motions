import React from 'react';
import {useTiempo} from '../tiempo';
import {interpolate, spring, useVideoConfig} from 'remotion';
import {Moneda} from '../componentes/Moneda';
import {Persona} from '../componentes/Persona';
import {Titulo} from '../componentes/Titulo';
import {ZonaSegura} from '../componentes/Escenario';
import {GLOW, glowIntenso, SUAVE} from '../tema';

// [55–62s] Monedas que se transforman en muñequitos que caminan; aparece la luna.
const POS = [
  {x: -230, y: -100},
  {x: -70, y: -100},
  {x: 90, y: -100},
  {x: -150, y: 80},
  {x: 10, y: 80},
  {x: 170, y: 80},
];
const MORPH = 98;

const Luna: React.FC<{tam: number}> = ({tam}) => (
  <svg width={tam} height={tam} viewBox="0 0 100 100" style={{overflow: 'visible'}}>
    <defs>
      <mask id="creciente">
        <rect width="100" height="100" fill="white" />
        <circle cx="66" cy="38" r="38" fill="black" />
      </mask>
    </defs>
    <circle cx="48" cy="52" r="42" fill="#FFFFFF" mask="url(#creciente)" />
  </svg>
);

export const Escena10: React.FC = () => {
  const frame = useTiempo();
  const {fps} = useVideoConfig();
  const luna = spring({frame: frame - 165, fps, config: SUAVE, durationInFrames: 30});
  return (
    <ZonaSegura>
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 10,
          opacity: luna,
          transform: `translateY(${(1 - luna) * 30}px)`,
          filter: glowIntenso(0.5),
        }}
      >
        <Luna tam={130} />
        {[
          {x: 170, y: 20, r: 5, f: 0},
          {x: 210, y: 110, r: 4, f: 1.7},
          {x: 120, y: 175, r: 3.5, f: 3.1},
        ].map((e, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: e.x,
              top: e.y,
              width: e.r * 2,
              height: e.r * 2,
              borderRadius: '50%',
              background: '#FFF',
              opacity: 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(frame / 9 + e.f)),
            }}
          />
        ))}
      </div>

      <div style={{position: 'absolute', top: 300, left: 0, right: 0}}>
        <Titulo texto={'TRABAJAN\nPARA VOS'} delay={122} size={40} />
      </div>

      <div style={{position: 'relative', width: 0, height: 0, top: 120}}>
        {POS.map((p, i) => {
          const entra = spring({frame: frame - 4 - i * 3, fps, config: SUAVE, durationInFrames: 16});
          const m = spring({frame: frame - MORPH - i * 4, fps, config: SUAVE, durationInFrames: 22});
          const flota = Math.sin(frame / 12 + i) * 6 * (1 - m);
          const arranca = MORPH + 26 + i * 3;
          const paso = Math.max(0, frame - arranca);
          const x = paso * 3.2;
          const bob = paso > 0 ? -Math.abs(Math.sin(paso * 0.32)) * 12 : 0;
          const giro = paso > 0 ? Math.sin(paso * 0.32) * 5 : 0;
          return (
            <div key={i} style={{position: 'absolute', left: p.x, top: p.y, width: 110, height: 110}}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: entra * (1 - m),
                  transform: `translateY(${flota}px) scale(${entra * (1 - 0.4 * m)})`,
                }}
              >
                <Moneda tam={110} glow />
              </div>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  opacity: m,
                  transform: `translate(${x}px, ${bob}px) rotate(${giro}deg) scale(${interpolate(m, [0, 1], [0.6, 1])})`,
                }}
              >
                <Persona alto={110} glow={GLOW} />
              </div>
            </div>
          );
        })}
      </div>
    </ZonaSegura>
  );
};
