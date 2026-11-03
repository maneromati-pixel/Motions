import React from 'react';
import {COLOR, FUENTE, GLOW} from '../tema';

// Caja con borde redondeado.
// inactivo: 0 = blanca, 1 = gris con borde punteado (crossfade suave entre ambos)
// brillo: 0..1 glow extra para la caja destacada
export const Caja: React.FC<{
  texto: string;
  ancho?: number;
  alto?: number;
  fontSize?: number;
  inactivo?: number;
  brillo?: number;
  apagada?: boolean; // gris sólido, sin glow (versión "incorrecta")
  style?: React.CSSProperties;
}> = ({texto, ancho = 520, alto = 140, fontSize = 44, inactivo = 0, brillo, apagada = false, style}) => {
  const radio = Math.min(28, alto / 2.6);
  const borde = Math.max(2, Math.round(alto / 45));
  const base: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: radio,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: FUENTE,
    fontWeight: 500,
    fontSize,
    letterSpacing: '0.3em',
    paddingLeft: '0.3em',
  };
  const destacada = brillo !== undefined;
  const b = brillo ?? 0;
  return (
    <div style={{position: 'relative', width: ancho, height: alto, ...style}}>
      <div
        style={{
          ...base,
          opacity: 1 - inactivo,
          border: `${borde}px solid ${apagada ? COLOR.gris : COLOR.blanco}`,
          color: apagada ? COLOR.gris : COLOR.blanco,
          ...(destacada
            ? {
                boxShadow: `0 0 ${14 + 22 * b}px rgba(255,255,255,${0.45 + 0.4 * b}), inset 0 0 ${12 + 18 * b}px rgba(255,255,255,${0.2 + 0.3 * b})`,
                textShadow: `0 0 ${8 + 10 * b}px rgba(255,255,255,${0.7 + 0.3 * b})`,
              }
            : {filter: apagada ? undefined : GLOW}),
        }}
      >
        {texto}
      </div>
      {inactivo > 0 && (
        <div
          style={{
            ...base,
            opacity: inactivo,
            border: `${borde}px dashed ${COLOR.gris}`,
            color: COLOR.gris,
          }}
        >
          {texto}
        </div>
      )}
    </div>
  );
};
