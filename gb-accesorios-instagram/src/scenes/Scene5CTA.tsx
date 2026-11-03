import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CheckerBg} from '../components/CheckerBg';
import {Heart} from '../components/Heart';
import {Logo} from '../components/Logo';
import {Sparkle} from '../components/Sparkle';
import {bubbleText, colors, fonts, hotGradient, HANDLE} from '../theme';
import timeline from '../timeline.json';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
// frame (local a la placa) en el que el dedo toca "Seguir" — sincronizado con el sfx "tap"
const TAP = timeline.sfx.tap[0] - timeline.scenes.cierre.from;

// Mano/cursor que presiona el botón
const Finger: React.FC = () => (
  <svg width="150" height="170" viewBox="0 0 60 68">
    <path
      d="M22 4c3 0 5 2 5 5v18l2-.4c3-.6 5 1 5.6 2.6l1.2-.2c3-.4 5 1.4 5.4 3l1.6-.2c3.4-.2 5.4 2 5.4 5V48c0 9-6 16-15 16h-4c-6 0-10-3-13-8L8 44c-1.6-2.6-.6-5.6 2-6.6 2.2-.8 4.4 0 5.8 1.8L17 41V9c0-3 2-5 5-5z"
      fill={colors.white}
      stroke={colors.hot}
      strokeWidth="2.6"
      strokeLinejoin="round"
    />
  </svg>
);

// PLACA 5 (8–10 s): llamado a la acción con botón "Seguir" que se presiona.
export const Scene5CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const logoIn = spring({frame, fps, config: {damping: 14}});
  const t1 = interpolate(frame, [4, 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const t2 = interpolate(frame, [8, 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const btnIn = spring({frame: frame - 10, fps, config: {damping: 12, stiffness: 150}});

  // dedo: entra, presiona en TAP, se retira
  const fingerIn = interpolate(frame, [TAP - 12, TAP - 1], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const fingerOut = interpolate(frame, [TAP + 6, TAP + 16], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const press = interpolate(frame, [TAP - 1, TAP + 1, TAP + 5], [0, 1, 0], clamp);
  const followed = frame >= TAP + 1;
  const pop = spring({frame: frame - TAP - 1, fps, config: {damping: 8, stiffness: 200}});
  const btnScale = btnIn * (1 - 0.08 * press) * (followed ? 0.94 + 0.06 * pop : 1);
  const ripple = interpolate(frame, [TAP, TAP + 14], [0, 1], clamp);
  const breathe = 1 + 0.015 * Math.sin(frame / 5);
  const footer = interpolate(frame, [TAP + 6, TAP + 16], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});

  const hearts = [
    {dx: -230, c: colors.bubble, s: 110, d: 0},
    {dx: -100, c: colors.white, s: 84, d: 2},
    {dx: 40, c: colors.heart, s: 130, d: 1},
    {dx: 180, c: colors.bubble, s: 92, d: 3},
    {dx: 270, c: colors.white, s: 74, d: 5},
  ];

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        fontFamily: fonts.round,
        overflow: 'hidden',
      }}
    >
      <CheckerBg />
      <div style={{position: 'absolute', width: 1100, height: 1100, top: 0, borderRadius: '50%', background: `radial-gradient(circle, ${colors.white}CC 0%, ${colors.white}00 65%)`}} />
      <div style={{position: 'absolute', top: 230, transform: `scale(${(0.6 + 0.4 * logoIn) * breathe}) rotate(${Math.sin(frame / 8) * 2}deg)`, opacity: Math.min(1, logoIn * 2)}}>
        <Logo width={640} shine={interpolate(frame, [12, 28], [-0.2, 1.2], clamp)} />
      </div>

      <div style={{position: 'absolute', top: 760, width: '100%', textAlign: 'center'}}>
        <div style={{fontFamily: fonts.round, fontWeight: 700, fontSize: 84, color: colors.hot, opacity: t1, transform: `translateY(${(1 - t1) * 30}px)`}}>
          Seguinos en
        </div>
        <div style={{display: 'inline-block', marginTop: 14, opacity: t2, transform: `translateY(${(1 - t2) * 30}px)`}}>
          <div style={{fontSize: 64, ...bubbleText(11, colors.white)}}>@{HANDLE}</div>
        </div>
      </div>

      {/* BOTÓN */}
      <div style={{position: 'absolute', top: 1130, width: 600, height: 140, display: 'flex', justifyContent: 'center'}}>
        {/* onda del toque */}
        {frame >= TAP && ripple < 1 ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 70,
              border: `6px solid ${colors.hot}`,
              transform: `scale(${1 + ripple * 0.35})`,
              opacity: 1 - ripple,
            }}
          />
        ) : null}
        <div
          style={{
            width: 600,
            height: 140,
            borderRadius: 70,
            background: followed ? colors.white : hotGradient,
            border: followed ? `6px solid ${colors.hot}` : `6px solid ${colors.white}`,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
            fontWeight: 600,
            fontSize: 58,
            color: followed ? colors.hot : colors.white,
            transform: `scale(${btnScale})`,
            boxShadow: followed ? `0 8px 0 ${colors.bubble}` : `0 ${16 - 12 * press}px 0 ${colors.hotDark}`,
          }}
        >
          {followed ? (
            <>
              Siguiendo
              <svg width="54" height="54" viewBox="0 0 24 24" style={{transform: `scale(${pop})`}}>
                <circle cx="12" cy="12" r="11" fill={colors.hot} />
                <path d="M7 12.5 L10.5 16 L17 9" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" />
              </svg>
            </>
          ) : (
            '+ Seguir'
          )}
        </div>

        {/* corazones */}
        {followed
          ? hearts.map((h, i) => {
              const p = interpolate(frame, [TAP + 1 + h.d, TAP + 30 + h.d], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
              if (p <= 0 || p >= 1) return null;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: 300 + h.dx * p - h.s / 2,
                    top: 20 - 420 * p,
                    opacity: 1 - p,
                    transform: `scale(${0.4 + 0.8 * Math.sin(Math.PI * Math.min(1, p * 1.6))}) rotate(${h.dx / 12}deg)`,
                  }}
                >
                  <Heart fill={h.c} size={h.s * 1.4} />
                </div>
              );
            })
          : null}

        {/* dedo */}
        {fingerOut < 1 ? (
          <div
            style={{
              position: 'absolute',
              left: 360,
              top: 60,
              transform: `translate(${(1 - fingerIn) * 260 + fingerOut * 220}px, ${(1 - fingerIn) * 420 + fingerOut * 380 + press * 14}px) rotate(-12deg) scale(${1 - press * 0.08})`,
              filter: 'drop-shadow(0 12px 18px rgba(0,0,0,0.25))',
            }}
          >
            <Finger />
          </div>
        ) : null}
      </div>

      <div
        style={{
          position: 'absolute',
          top: 1380,
          width: '100%',
          textAlign: 'center',
          fontSize: 44,
          fontWeight: 600,
          color: colors.ink,
          opacity: footer,
          transform: `translateY(${(1 - footer) * 24}px)`,
        }}
      >
        Mirá todos los productos en nuestro perfil 💌
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 210,
          fontWeight: 600,
          fontSize: 32,
          letterSpacing: 4,
          color: colors.hot,
          opacity: footer,
        }}
      >
        #GBAccesorios · #AccesoriosDeModa
      </div>

      <Sparkle x={230} y={300} size={60} progress={(frame - 6) / 26} />
      <Sparkle x={860} y={560} size={48} progress={(frame - 12) / 24} color={colors.white} />
      <Sparkle x={820} y={1120} size={60} progress={(frame - TAP) / 22} />
      <Sparkle x={250} y={1260} size={44} progress={(frame - TAP - 4) / 22} color={colors.white} />
    </AbsoluteFill>
  );
};
