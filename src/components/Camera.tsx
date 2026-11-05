/**
 * <Camera>: cámara virtual de cada escena.
 *  - push-in muy lento (1 → 1.04 a lo largo de la escena)
 *  - parallax: la capa de ilustración (`art`) se mueve más que la de texto (`text`)
 *  - extras opcionales: punch (zoom puntual), rotate (grados), pullBack (alejar)
 *  - se atenúa la ilustración cuando una palabra grande ocupa el centro
 */
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE, SAFE} from '../theme';
import {prog, drift} from '../lib/anim';
import {useScene} from './SceneContext';
import {bigDim} from './BigWord';

type Props = {
  art: React.ReactNode;
  text?: React.ReactNode;
  push?: number; // cantidad de push-in (default 0.04)
  punch?: number; // zoom extra puntual
  rotate?: number;
  originY?: number;
};

export const Camera: React.FC<Props> = ({art, text, push = 0.04, punch = 0, rotate = 0, originY = SAFE.stageY}) => {
  const {t, dur, global} = useScene();
  useCurrentFrame();
  const p = prog(t, -12, dur + 24, EASE.camera);
  const dim = bigDim(global);
  const artScale = 1 + push * p + punch;
  const textScale = 1 + push * 0.35 * p;
  const sway = drift(global, 2.5, 220);
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          transformOrigin: `${SAFE.centerX}px ${originY}px`,
          transform: `translate(${sway}px, ${-10 * p}px) scale(${artScale}) rotate(${rotate}deg)`,
          opacity: 1 - 0.72 * dim,
          filter: dim > 0.01 ? `blur(${dim * 3}px)` : undefined,
        }}
      >
        {art}
      </AbsoluteFill>
      {text && (
        <AbsoluteFill
          style={{
            transformOrigin: `${SAFE.centerX}px 300px`,
            transform: `translate(${sway * 0.4}px, ${-4 * p}px) scale(${textScale})`,
          }}
        >
          {text}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/** SVG a pantalla completa con coordenadas en px reales (1080x1920). */
export const Stage: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <svg
    width={1080}
    height={1920}
    viewBox="0 0 1080 1920"
    style={{position: 'absolute', inset: 0, overflow: 'visible', ...style}}
  >
    {children}
  </svg>
);
