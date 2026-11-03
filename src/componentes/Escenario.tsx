import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLOR, SUAVE, ZONA_SEGURA} from '../tema';

// Fondo negro con degradé radial sutil.
export const Fondo: React.FC<{centro?: string; borde?: string}> = ({
  centro = COLOR.fondoCentro,
  borde = COLOR.fondo,
}) => (
  <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, ${centro} 0%, ${borde} 72%)`}} />
);

// Área donde va el contenido: deja libre abajo (UI de TikTok) y el lateral derecho.
export const ZonaSegura: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      position: 'absolute',
      top: ZONA_SEGURA.arriba,
      bottom: ZONA_SEGURA.abajo,
      left: ZONA_SEGURA.izquierda,
      right: ZONA_SEGURA.derecha,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}
  >
    {children}
  </div>
);

// Transición entre escenas: fade + escala 0.95 -> 1 al entrar, fade al salir.
export const Transicion: React.FC<{
  children: React.ReactNode;
  duracion: number;
  entrada?: boolean;
  salida?: boolean;
}> = ({children, duracion, entrada = true, salida = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const e = entrada ? spring({frame, fps, config: SUAVE, durationInFrames: 16}) : 1;
  const s = salida
    ? interpolate(frame, [duracion - 9, duracion - 1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 1;
  const escala = interpolate(e, [0, 1], [0.95, 1]);
  return <AbsoluteFill style={{opacity: e * s, transform: `scale(${escala})`}}>{children}</AbsoluteFill>;
};
