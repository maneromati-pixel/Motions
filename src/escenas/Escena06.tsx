import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Cadena} from '../componentes/Cadena';
import {Titulo} from '../componentes/Titulo';
import {ZonaSegura} from '../componentes/Escenario';
import {SUAVE} from '../tema';

// [24–32s] Lo que hacen pocos: COBRO → AHORRO → GASTOS, con AHORRO brillando y pulsando.
const A_AHORRO = 108;

export const Escena06: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enciende = spring({frame: frame - A_AHORRO - 6, fps, config: SUAVE, durationInFrames: 24});
  const pulso = 0.5 + 0.5 * Math.sin(((frame - A_AHORRO) / fps) * Math.PI * 2 * 0.7);
  const brillo = enciende * (0.65 + 0.35 * pulso);
  return (
    <ZonaSegura>
      <Titulo texto="LO QUE HACEN POCOS" delay={6} size={40} style={{marginBottom: 80}} />
      <div style={{transform: 'translateZ(0)'}}>
        <Cadena
          cajas={[
            {texto: 'COBRO', aparece: 62},
            {texto: 'AHORRO', aparece: A_AHORRO, brillo},
            {texto: 'GASTOS', aparece: 178},
          ]}
        />
      </div>
      <div style={{height: 190}} />
    </ZonaSegura>
  );
};
