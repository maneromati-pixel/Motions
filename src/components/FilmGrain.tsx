/**
 * Grano de película animado casi imperceptible (3–4%) + viñeta radial.
 * El seed cambia cada 2 frames (grano "a 15 fps", más orgánico).
 */
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

export const Background: React.FC<{tint?: string; tintAmount?: number}> = ({tint = COLORS.night, tintAmount = 0}) => (
  <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
    <AbsoluteFill
      style={{background: `radial-gradient(ellipse 75% 55% at 48% 44%, ${COLORS.vignetteCenter} 0%, ${COLORS.bg} 100%)`}}
    />
    {tintAmount > 0 && (
      <AbsoluteFill
        style={{
          opacity: tintAmount,
          background: `radial-gradient(ellipse 75% 55% at 48% 44%, #1A1E3A 0%, ${tint} 100%)`,
        }}
      />
    )}
  </AbsoluteFill>
);

export const FilmGrain: React.FC<{opacity?: number}> = ({opacity = 0.035}) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 97;
  return (
    <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
      <svg width="100%" height="100%" viewBox="0 0 540 960" preserveAspectRatio="none">
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="540" height="960" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};
