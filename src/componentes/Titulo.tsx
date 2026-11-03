import React from 'react';
import {useTiempo} from '../tiempo';
import {spring, useVideoConfig} from 'remotion';
import {COLOR, FUENTE, SUAVE} from '../tema';

// Título en mayúsculas, letter-spacing amplio, entra con fade + leve subida.
export const Titulo: React.FC<{
  texto: string;
  delay?: number;
  size?: number;
  color?: string;
  glow?: boolean;
  align?: 'center' | 'left' | 'right';
  style?: React.CSSProperties;
}> = ({texto, delay = 0, size = 40, color = COLOR.texto, glow = false, align = 'center', style}) => {
  const frame = useTiempo();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: SUAVE, durationInFrames: 20});
  return (
    <div
      style={{
        fontFamily: FUENTE,
        fontWeight: 500,
        fontSize: size,
        letterSpacing: '0.3em',
        // compensa el espacio extra que deja letter-spacing después de la última letra
        ...(align === 'center' ? {paddingLeft: '0.3em'} : align === 'right' ? {marginRight: '-0.3em'} : {}),
        textTransform: 'uppercase',
        textAlign: align,
        color,
        whiteSpace: 'pre-line',
        lineHeight: 1.35,
        opacity: s,
        transform: `translateY(${(1 - s) * 16}px)`,
        filter: glow ? 'drop-shadow(0 0 8px rgba(255,255,255,0.6))' : undefined,
        ...style,
      }}
    >
      {texto}
    </div>
  );
};
