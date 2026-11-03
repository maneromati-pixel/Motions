import React from 'react';
import {useTiempo} from '../tiempo';
import {spring, useVideoConfig} from 'remotion';
import {ZonaSegura} from '../componentes/Escenario';
import {FUENTE, SUAVE} from '../tema';

// [38–42s] "PONELE NÚMEROS" letra por letra.
const LINEAS = ['PONELE', 'NÚMEROS'];
const INICIO = 8;
const CADA = 4;

export const Escena08: React.FC = () => {
  const frame = useTiempo();
  const {fps} = useVideoConfig();
  let k = 0;
  return (
    <ZonaSegura>
      {LINEAS.map((linea) => (
        <div key={linea} style={{display: 'flex', margin: '14px 0', paddingLeft: '0.3em', fontSize: 92}}>
          {linea.split('').map((letra, i) => {
            const s = spring({frame: frame - INICIO - k++ * CADA, fps, config: SUAVE, durationInFrames: 14});
            return (
              <span
                key={i}
                style={{
                  fontFamily: FUENTE,
                  fontWeight: 500,
                  letterSpacing: '0.3em',
                  color: '#FFFFFF',
                  opacity: s,
                  transform: `translateY(${(1 - s) * 18}px)`,
                  display: 'inline-block',
                  filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.7))',
                }}
              >
                {letra}
              </span>
            );
          })}
        </div>
      ))}
    </ZonaSegura>
  );
};
