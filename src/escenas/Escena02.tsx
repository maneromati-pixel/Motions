import React from 'react';
import {useTiempo} from '../tiempo';
import {Easing, interpolate, spring, useVideoConfig} from 'remotion';
import {Persona} from '../componentes/Persona';
import {Titulo} from '../componentes/Titulo';
import {BarraProgreso} from '../componentes/BarraProgreso';
import {Contador} from '../componentes/Contador';
import {ZonaSegura} from '../componentes/Escenario';
import {SUAVE} from '../tema';

// [3–8s] Dos sueldos (100% y 50%) que se vacían hasta $0.
const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Columna: React.FC<{lleno: number; delay: number}> = ({lleno, delay}) => {
  const frame = useTiempo();
  const {fps} = useVideoConfig();
  const sube = interpolate(frame, [delay + 8, delay + 36], [0, lleno], {...CL, easing: Easing.out(Easing.cubic)});
  const baja = interpolate(frame, [72, 118], [1, 0], {...CL, easing: Easing.inOut(Easing.cubic)});
  const vacia = interpolate(frame, [110, 122], [0, 1], CL);
  const cero = spring({frame: frame - 116, fps, config: SUAVE, durationInFrames: 18});
  const entra = spring({frame: frame - delay, fps, config: SUAVE, durationInFrames: 18});
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: entra}}>
      <Titulo texto="SUELDO" delay={delay} size={32} style={{marginBottom: 28}} />
      <BarraProgreso orientacion="vertical" largo={440} grosor={120} progreso={sube * baja} vacia={vacia} />
      <Persona alto={190} glow style={{marginTop: 44}} />
      <Contador
        valor={0}
        size={120}
        style={{marginTop: 40, opacity: cero, transform: `scale(${interpolate(cero, [0, 1], [0.8, 1])})`}}
      />
    </div>
  );
};

export const Escena02: React.FC = () => (
  <ZonaSegura>
    <div style={{display: 'flex', gap: 170, alignItems: 'flex-start'}}>
      <Columna lleno={1} delay={4} />
      <Columna lleno={0.5} delay={12} />
    </div>
  </ZonaSegura>
);
