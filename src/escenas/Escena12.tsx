import React from 'react';
import {useTiempo} from '../tiempo';
import {spring, useVideoConfig} from 'remotion';
import {Fondo, ZonaSegura} from '../componentes/Escenario';
import {Titulo} from '../componentes/Titulo';
import {COLOR, FUENTE, SUAVE} from '../tema';

// [70–75s] Cierre: barra de búsqueda genérica donde se tipea el usuario.
const ESCRIBE = 32;
const CADA = 4;

const Lupa: React.FC = () => (
  <svg width={54} height={54} viewBox="0 0 50 50">
    <circle cx={21} cy={21} r={13} fill="none" stroke={COLOR.fondoCierre} strokeWidth={5} />
    <path d="M31 31 L43 43" stroke={COLOR.fondoCierre} strokeWidth={5.5} strokeLinecap="round" />
  </svg>
);

export const Escena12: React.FC<{usuario: string}> = ({usuario}) => {
  const frame = useTiempo();
  const {fps} = useVideoConfig();
  const barra = spring({frame: frame - 14, fps, config: SUAVE, durationInFrames: 20});
  const letras = Math.max(0, Math.min(usuario.length, Math.floor((frame - ESCRIBE) / CADA) + 1));
  const escribiendo = frame >= ESCRIBE && letras < usuario.length;
  const cursorVisible = escribiendo || Math.floor(frame / 15) % 2 === 0;
  const fontSize = Math.min(56, 600 / (usuario.length * 0.62));
  return (
    <>
      <Fondo centro={COLOR.fondoCierreCentro} borde={COLOR.fondoCierre} />
      <ZonaSegura>
        <Titulo texto="SEGUIME" delay={4} size={48} color="#FFFFFF" glow style={{marginBottom: 70}} />
        <div
          style={{
            width: 800,
            height: 130,
            borderRadius: 65,
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            padding: '0 46px',
            boxSizing: 'border-box',
            opacity: barra,
            transform: `scale(${0.92 + 0.08 * barra})`,
            boxShadow: '0 0 22px rgba(255,255,255,0.35), 0 0 60px rgba(255,255,255,0.12)',
          }}
        >
          <Lupa />
          <div
            style={{
              marginLeft: 28,
              fontFamily: FUENTE,
              fontWeight: 500,
              fontSize,
              color: COLOR.fondoCierre,
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'pre',
            }}
          >
            {usuario.slice(0, letras)}
            <span
              style={{
                display: 'inline-block',
                width: 4,
                height: fontSize * 1.1,
                marginLeft: 6,
                background: COLOR.fondoCierre,
                opacity: cursorVisible ? 1 : 0,
              }}
            />
          </div>
        </div>
      </ZonaSegura>
    </>
  );
};
