import React from 'react';
import {useTiempo} from '../tiempo';
import {interpolate, spring, useVideoConfig} from 'remotion';
import {BarraProgreso} from '../componentes/BarraProgreso';
import {Contador} from '../componentes/Contador';
import {Titulo} from '../componentes/Titulo';
import {ZonaSegura} from '../componentes/Escenario';
import {ANCHO_UTIL, COLOR, FUENTE, SUAVE} from '../tema';

// [42–55s] Lo que gastaste ($0) vs. 10% por mes creciendo en 10 años.
const META = 48000;
const K = 3; // curvatura exponencial
const G0 = 45; // frame en que empieza a crecer
const G1 = 282; // frame en que llega al año 10

export const Escena09: React.FC = () => {
  const frame = useTiempo();
  const {fps} = useVideoConfig();
  const p = interpolate(frame, [G0, G1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const curva = (Math.exp(K * p) - 1) / (Math.exp(K) - 1);
  const valor = Math.round((META * curva) / 100) * 100;
  const anio = Math.min(10, Math.max(1, Math.ceil(p * 10)));
  const cambio = G0 + ((anio - 1) / 10) * (G1 - G0);
  const pop = spring({frame: frame - cambio, fps, config: {damping: 14, stiffness: 180}, durationInFrames: 12});
  const b1 = spring({frame: frame - 6, fps, config: SUAVE, durationInFrames: 18});
  const b2 = spring({frame: frame - 22, fps, config: SUAVE, durationInFrames: 18});
  const etiqueta: React.CSSProperties = {
    fontFamily: FUENTE,
    fontWeight: 500,
    fontSize: 30,
    letterSpacing: '0.3em',
    marginBottom: 22,
  };
  return (
    <ZonaSegura style={{alignItems: 'stretch'}}>
      <div style={{position: 'absolute', top: 10, right: 0, display: 'flex', alignItems: 'baseline', gap: 22, opacity: b1}}>
        <span style={{...etiqueta, marginBottom: 0, color: COLOR.grisMedio}}>AÑO</span>
        <span
          style={{
            fontFamily: FUENTE,
            fontWeight: 700,
            fontSize: 76,
            color: COLOR.blanco,
            minWidth: 50,
            textAlign: 'right',
            display: 'inline-block',
            transform: `scale(${frame >= G0 ? 0.85 + 0.15 * pop : 1})`,
            transformOrigin: 'right bottom',
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.75))',
          }}
        >
          {anio}
        </span>
      </div>

      <div style={{opacity: b1, transform: `translateY(${(1 - b1) * 20}px)`}}>
        <div style={{...etiqueta, color: COLOR.grisMedio}}>LO QUE GASTASTE</div>
        <Contador valor={0} size={110} color={COLOR.gris} glow={false} style={{marginBottom: 30}} />
        <BarraProgreso progreso={0} largo={ANCHO_UTIL} grosor={60} punteada />
      </div>

      <div style={{height: 130}} />

      <div style={{opacity: b2, transform: `translateY(${(1 - b2) * 20}px)`}}>
        <div style={{...etiqueta, color: COLOR.texto}}>10% POR MES</div>
        <Contador valor={valor} size={150} style={{marginBottom: 30}} />
        <BarraProgreso progreso={curva} largo={ANCHO_UTIL} grosor={60} />
      </div>

      <div style={{height: 110, display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
        <Titulo texto="TENÉS UNA BASE" delay={306} size={36} glow />
      </div>
    </ZonaSegura>
  );
};
