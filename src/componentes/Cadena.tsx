import React from 'react';
import {useTiempo} from '../tiempo';
import {interpolate, spring, useVideoConfig} from 'remotion';
import {Caja} from './Caja';
import {Flecha} from './Flecha';
import {COLOR, SUAVE} from '../tema';

export type CajaCadena = {
  texto: string;
  aparece: number; // frame en que aparece
  inactivo?: number;
  brillo?: number;
};

// Tres cajas en columna unidas por flechas que se dibujan en secuencia.
export const Cadena: React.FC<{
  cajas: CajaCadena[];
  ancho?: number;
  alto?: number;
  fontSize?: number;
  largoFlecha?: number;
  apagada?: boolean;
}> = ({cajas, ancho = 540, alto = 140, fontSize = 44, largoFlecha = 96, apagada = false}) => {
  const frame = useTiempo();
  const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      {cajas.map((c, i) => {
        const s = spring({frame: frame - c.aparece, fps, config: SUAVE, durationInFrames: 18});
        const progFlecha =
          i === 0
            ? 0
            : interpolate(frame, [c.aparece - 14, c.aparece], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
        return (
          <React.Fragment key={c.texto}>
            {i > 0 && (
              <div style={{height: largoFlecha, display: 'flex', alignItems: 'center', margin: `${alto * 0.08}px 0`}}>
                <Flecha
                  largo={largoFlecha * 0.8}
                  progreso={progFlecha}
                  grosor={Math.max(3, alto / 35)}
                  color={apagada ? COLOR.gris : COLOR.blanco}
                  glow={!apagada}
                />
              </div>
            )}
            <Caja
              texto={c.texto}
              ancho={ancho}
              alto={alto}
              fontSize={fontSize}
              inactivo={c.inactivo}
              brillo={c.brillo}
              apagada={apagada}
              style={{opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.92, 1])})`}}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};
