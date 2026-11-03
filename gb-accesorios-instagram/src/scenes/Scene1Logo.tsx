import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Logo} from '../components/Logo';
import {Sparkle} from '../components/Sparkle';
import {colors, fonts} from '../theme';

// PLACA 1 (0–2 s): el aro se dibuja, entran la G y la B, "pop" + destellos, brillo y tagline.
export const Scene1Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

  const ring = interpolate(frame, [0, 22], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const g = spring({frame: frame - 6, fps, config: {damping: 16, mass: 0.7}});
  const b = spring({frame: frame - 10, fps, config: {damping: 16, mass: 0.7}});
  const tagline = interpolate(frame, [18, 34], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const shine = interpolate(frame, [26, 44], [-0.2, 1.2], clamp);
  const pop = spring({frame: frame - 10, fps, config: {damping: 9, stiffness: 180}});
  const scale = 0.86 + 0.14 * pop + interpolate(frame, [10, 60], [0, 0.04], clamp);
  const bgGlow = interpolate(frame, [0, 30], [0, 1], clamp);
  const sub = interpolate(frame, [30, 44], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});

  const sparkles = [
    {x: 250, y: 640, s: 70, d: 12},
    {x: 840, y: 760, s: 50, d: 15},
    {x: 820, y: 1250, s: 80, d: 19},
    {x: 230, y: 1180, s: 44, d: 23},
    {x: 560, y: 560, s: 36, d: 28},
    {x: 700, y: 1390, s: 40, d: 33},
  ];

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 45%, ${colors.white} 0%, ${colors.ivory} ${30 + 25 * bgGlow}%, ${colors.nude} 120%)`,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* halo suave detrás del logo */}
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.blush}55 0%, transparent 65%)`,
          transform: `scale(${0.6 + 0.4 * bgGlow})`,
          top: 960 - 450 - 80,
        }}
      />
      <div style={{transform: `scale(${scale})`, marginTop: -160}}>
        <Logo size={720} ring={ring} g={g} b={b} tagline={tagline} shine={shine} id="l1" />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1380,
          fontFamily: fonts.serif,
          fontStyle: 'italic',
          fontSize: 58,
          color: colors.carbon,
          opacity: sub,
          transform: `translateY(${(1 - sub) * 30}px)`,
          letterSpacing: 1,
        }}
      >
        tu estilo, tus detalles
      </div>
      {sparkles.map((s, i) => (
        <Sparkle key={i} x={s.x} y={s.y} size={s.s} progress={(frame - s.d) / 26} color={i % 2 ? colors.roseGold : colors.gold} />
      ))}
    </AbsoluteFill>
  );
};
