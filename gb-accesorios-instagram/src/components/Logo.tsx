import React from 'react';
import {Img, staticFile} from 'remotion';

const RATIO = 472 / 681; // alto / ancho del PNG recortado

// Logo oficial (recortado del original con scripts/extract-logo.py).
// shine: 0..1 recorre un brillo diagonal enmascarado por la forma del logo (fuera de rango = apagado).
export const Logo: React.FC<{width: number; shine?: number; style?: React.CSSProperties}> = ({width, shine = -1, style}) => {
  const src = staticFile('logo-gb.png');
  const h = width * RATIO;
  return (
    <div style={{position: 'relative', width, height: h, ...style}}>
      <Img src={src} style={{width, height: h, display: 'block'}} />
      {shine > -0.3 && shine < 1.3 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            WebkitMaskImage: `url(${src})`,
            WebkitMaskSize: '100% 100%',
            background: `linear-gradient(110deg, transparent ${shine * 100 - 14}%, rgba(255,255,255,0.85) ${shine * 100}%, transparent ${shine * 100 + 14}%)`,
          }}
        />
      ) : null}
    </div>
  );
};
