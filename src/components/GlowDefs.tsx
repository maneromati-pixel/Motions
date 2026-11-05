/**
 * Filtros SVG globales del glow (dos capas) y del motion blur direccional.
 * Se montan una sola vez; cualquier <svg> del documento los referencia por id.
 * userSpaceOnUse evita que líneas rectas (bbox de alto 0) pierdan el filtro.
 */
import React from 'react';
import {STROKE} from '../theme';

const region = {filterUnits: 'userSpaceOnUse' as const, x: -1200, y: -1200, width: 3480, height: 4320};

export const GlowDefs: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}} aria-hidden>
    <defs>
      <filter id="gNear" {...region}>
        <feGaussianBlur stdDeviation={STROKE.glowNear.blur} />
      </filter>
      <filter id="gFar" {...region}>
        <feGaussianBlur stdDeviation={STROKE.glowFar.blur} />
      </filter>
    </defs>
  </svg>
);
