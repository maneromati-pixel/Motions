import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CheckerBg} from '../components/CheckerBg';
import {Heart} from '../components/Heart';
import {Logo} from '../components/Logo';
import {Sparkle} from '../components/Sparkle';
import {bubbleText, colors, fonts} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// PLACA 1 (0–2 s): el cuadriculado aparece ondeando, el logo entra rebotando como un globo
// (squash & stretch), estallan corazones, pasa un brillo y aparece el tagline.
export const Scene1Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const bgIn = interpolate(frame, [0, 10], [0, 1], clamp);
  const pop = spring({frame: frame - 6, fps, config: {damping: 7, stiffness: 170, mass: 0.8}});
  // squash & stretch: se estira cuando crece rápido, se aplasta al pasarse
  const vel = pop - spring({frame: frame - 7, fps, config: {damping: 7, stiffness: 170, mass: 0.8}});
  const sx = pop * (1 - vel * 1.2);
  const sy = pop * (1 + vel * 1.2);
  const wobble = Math.sin(frame / 7) * 2.5 * interpolate(frame, [10, 60], [1, 0.4], clamp);
  const float = Math.sin(frame / 9) * 10;
  const shine = interpolate(frame, [24, 42], [-0.2, 1.2], clamp);
  const tag = spring({frame: frame - 22, fps, config: {damping: 11, stiffness: 140}});

  const hearts = [
    {a: -150, d: 330, s: 120, c: colors.bubble},
    {a: -35, d: 380, s: 90, c: colors.heart},
    {a: 20, d: 360, s: 130, c: colors.bubble},
    {a: 140, d: 360, s: 80, c: colors.heart},
    {a: 95, d: 420, s: 100, c: colors.white},
    {a: -95, d: 440, s: 70, c: colors.white},
  ];

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, opacity: bgIn, transform: `scale(${1.15 - 0.15 * bgIn})`}}>
        <CheckerBg />
      </div>
      {/* halo blanco detrás del logo */}
      <div
        style={{
          position: 'absolute',
          width: 1000,
          height: 1000,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.white}DD 0%, ${colors.white}00 62%)`,
          transform: `scale(${pop})`,
          top: 960 - 500 - 120,
        }}
      />

      {/* corazones que salen disparados desde el logo */}
      {hearts.map((h, i) => {
        const p = interpolate(frame, [10 + i, 34 + i], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        const rad = (h.a * Math.PI) / 180;
        const x = Math.cos(rad - Math.PI / 2) * h.d * p;
        const y = Math.sin(rad - Math.PI / 2) * h.d * p * 1.3;
        const bob = Math.sin((frame + i * 9) / 8) * 12 * p;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 540 + x - h.s * 0.8,
              top: 840 + y + bob - h.s * 0.8,
              transform: `scale(${p}) rotate(${h.a / 6}deg)`,
              opacity: p,
            }}
          >
            <Heart size={h.s * 1.6} fill={h.c} />
          </div>
        );
      })}

      <div style={{transform: `translateY(${-120 + float}px) rotate(${wobble}deg) scale(${sx}, ${sy})`}}>
        <Logo width={820} shine={shine} />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 1290,
          transform: `scale(${tag}) rotate(${-3 + Math.sin(frame / 10) * 1.5}deg)`,
          ...bubbleText(14, colors.white),
          fontSize: 84,
          letterSpacing: 2,
        }}
      >
        accesorios & moda
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1450,
          fontFamily: fonts.round,
          fontWeight: 600,
          fontSize: 60,
          color: colors.hot,
          opacity: interpolate(frame, [32, 42], [0, 1], clamp),
        }}
      >
        que enamoran 💖
      </div>

      <Sparkle x={200} y={560} size={80} progress={(frame - 14) / 24} color={colors.white} />
      <Sparkle x={880} y={1100} size={70} progress={(frame - 20) / 24} />
      <Sparkle x={880} y={520} size={56} progress={(frame - 28) / 24} color={colors.white} />
      <Sparkle x={180} y={1180} size={60} progress={(frame - 32) / 24} />
    </AbsoluteFill>
  );
};
