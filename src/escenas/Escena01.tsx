import React from 'react';
import {interpolate, interpolateColors, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Persona} from '../componentes/Persona';
import {Titulo} from '../componentes/Titulo';
import {ZonaSegura} from '../componentes/Escenario';
import {COLOR, glowIntenso, SUAVE} from '../tema';

// [0–3s] Grilla 10x10: 90 se apagan, quedan 10 brillando.
const N = 100;
const ORDEN = Array.from({length: N}, (_, i) => i).sort((a, b) => random(`orden-${a}`) - random(`orden-${b}`));
const RANGO = new Map(ORDEN.map((idx, r) => [idx, r])); // rango < 10 => queda blanco
const INICIO = 14;
const FIN = 66;

export const Escena01: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const brilloFinal = spring({frame: frame - FIN, fps, config: SUAVE, durationInFrames: 20});
  return (
    <ZonaSegura>
      <Titulo texto="ORDEN EQUIVOCADO" delay={4} size={42} style={{marginBottom: 70}} />
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(10, 80px)', gridAutoRows: 92}}>
        {Array.from({length: N}, (_, i) => {
          const fila = Math.floor(i / 10);
          const col = i % 10;
          const entra = spring({frame: frame - (fila + col) * 0.5, fps, config: SUAVE, durationInFrames: 10});
          const r = RANGO.get(i)!;
          const queda = r < 10;
          const momento = INICIO + ((r - 10) / 89) * (FIN - INICIO);
          const apagado = queda
            ? 0
            : interpolate(frame, [momento, momento + 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div key={i} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <Persona
                alto={68}
                color={interpolateColors(apagado, [0, 1], [COLOR.blanco, COLOR.gris])}
                glow={queda ? glowIntenso(brilloFinal) : false}
                style={{
                  opacity: entra,
                  transform: `scale(${queda ? 1 + 0.1 * brilloFinal : interpolate(apagado, [0, 1], [1, 0.92])})`,
                }}
              />
            </div>
          );
        })}
      </div>
    </ZonaSegura>
  );
};
