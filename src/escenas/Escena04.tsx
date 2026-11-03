import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {LayoutTodos} from './Escena03';
import {Contador} from '../componentes/Contador';
import {COLOR, SUAVE} from '../tema';

// [14–19s] AHORRO se apaga (gris, punteado) y aparece $0 en gris.
export const Escena04: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inactivo = interpolate(frame, [18, 42], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const entra = spring({frame: frame - 40, fps, config: SUAVE, durationInFrames: 18});
  const valor = interpolate(frame, [44, 84], [300, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <LayoutTodos
      aparecen={[-100, -100, -100]}
      tituloDelay={-100}
      inactivoAhorro={inactivo}
      debajo={
        <Contador
          valor={valor}
          size={130}
          color={COLOR.gris}
          glow={false}
          style={{opacity: entra, transform: `translateY(${(1 - entra) * 20}px)`}}
        />
      }
    />
  );
};
