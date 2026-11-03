import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Persona} from '../componentes/Persona';
import {Cadena} from '../componentes/Cadena';
import {Titulo} from '../componentes/Titulo';
import {ZonaSegura} from '../componentes/Escenario';
import {SUAVE} from '../tema';

// [32–38s] Mismo sueldo, misma persona, distinto orden.
const MINI = {ancho: 310, alto: 80, fontSize: 26, largoFlecha: 44};

export const Escena07: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const piso = spring({frame: frame - 4, fps, config: SUAVE, durationInFrames: 24});
  const p1 = spring({frame: frame - 10, fps, config: SUAVE, durationInFrames: 18});
  const p2 = spring({frame: frame - 16, fps, config: SUAVE, durationInFrames: 18});
  const enciende = spring({frame: frame - 112, fps, config: SUAVE, durationInFrames: 20});
  const pulso = 0.5 + 0.5 * Math.sin(((frame - 112) / fps) * Math.PI * 2 * 0.7);
  const t = (f: number) => [f, f + 10, f + 20] as const;
  const izq = t(56);
  const der = t(90);
  return (
    <ZonaSegura>
      <Titulo texto="MISMO SUELDO" delay={4} size={42} style={{marginBottom: 80}} />
      <div style={{display: 'flex', gap: 210, alignItems: 'flex-end'}}>
        <Persona alto={250} glow style={{opacity: p1, transform: `translateY(${(1 - p1) * 20}px)`}} />
        <Persona
          alto={250}
          glow
          style={{opacity: p2, transform: `translateY(${(1 - p2) * 20}px) scale(${1 + 0.03 * enciende})`}}
        />
      </div>
      <div
        style={{
          width: 760,
          height: 3,
          background: '#BBBBBB',
          margin: "14px 0 60px",
          transform: `scaleX(${piso})`,
          boxShadow: '0 0 8px rgba(255,255,255,0.5)',
        }}
      />
      <div style={{display: 'flex', gap: 60}}>
        <Cadena
          {...MINI}
          apagada
          cajas={[
            {texto: 'COBRO', aparece: izq[0]},
            {texto: 'GASTOS', aparece: izq[1]},
            {texto: 'AHORRO', aparece: izq[2]},
          ]}
        />
        <Cadena
          {...MINI}
          cajas={[
            {texto: 'COBRO', aparece: der[0]},
            {texto: 'AHORRO', aparece: der[1], brillo: enciende * (0.6 + 0.4 * pulso)},
            {texto: 'GASTOS', aparece: der[2]},
          ]}
        />
      </div>
    </ZonaSegura>
  );
};
