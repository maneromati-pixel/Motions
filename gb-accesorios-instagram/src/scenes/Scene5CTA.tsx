import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Logo} from '../components/Logo';
import {Sparkle} from '../components/Sparkle';
import {colors, fonts, goldGradient, HANDLE} from '../theme';
import timeline from '../timeline.json';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
// frame (local a la placa) en el que el dedo toca "Seguir" — sincronizado con el sfx "tap"
const TAP = timeline.sfx.tap[0] - timeline.scenes.cierre.from;

const Heart: React.FC<{color: string; size: number}> = ({color, size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 5.3 3.1 1.7-1.9 3.2-3.1 5.3-3.1 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" fill={color} />
  </svg>
);

// Mano/cursor que presiona el botón
const Finger: React.FC = () => (
  <svg width="150" height="170" viewBox="0 0 60 68">
    <path
      d="M22 4c3 0 5 2 5 5v18l2-.4c3-.6 5 1 5.6 2.6l1.2-.2c3-.4 5 1.4 5.4 3l1.6-.2c3.4-.2 5.4 2 5.4 5V48c0 9-6 16-15 16h-4c-6 0-10-3-13-8L8 44c-1.6-2.6-.6-5.6 2-6.6 2.2-.8 4.4 0 5.8 1.8L17 41V9c0-3 2-5 5-5z"
      fill={colors.white}
      stroke={colors.carbon}
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
    {dx: -220, c: colors.roseGold, s: 70, d: 0},
    {dx: -90, c: colors.gold, s: 54, d: 2},
    {dx: 40, c: colors.blush, s: 84, d: 1},
    {dx: 170, c: colors.roseGold, s: 58, d: 3},
    {dx: 260, c: colors.gold, s: 46, d: 5},
  ];

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 38%, ${colors.white} 0%, ${colors.ivory} 45%, ${colors.nude} 110%)`,
        alignItems: 'center',
        fontFamily: fonts.sans,
      }}
    >
      <div style={{position: 'absolute', top: 210, transform: `scale(${(0.7 + 0.3 * logoIn) * breathe})`, opacity: logoIn}}>
        <Logo size={460} ring={logoIn} id="l5" />
      </div>

      <div style={{position: 'absolute', top: 760, width: '100%', textAlign: 'center'}}>
        <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 92, color: colors.carbon, opacity: t1, transform: `translateY(${(1 - t1) * 30}px)`}}>
          Seguinos en
        </div>
        <div style={{display: 'inline-block', marginTop: 14, opacity: t2, transform: `translateY(${(1 - t2) * 30}px)`}}>
          <div style={{fontWeight: 600, fontSize: 70, color: colors.carbon, letterSpacing: 0.5}}>@{HANDLE}</div>
          <div style={{height: 5, marginTop: 10, background: goldGradient, transform: `scaleX(${t2})`, borderRadius: 3}} />
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
              border: `4px solid ${colors.gold}`,
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
            background: followed ? colors.white : goldGradient,
            border: followed ? `4px solid ${colors.gold}` : '4px solid transparent',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
            fontWeight: 600,
            fontSize: 58,
            color: followed ? colors.carbon : colors.white,
            transform: `scale(${btnScale})`,
            boxShadow: followed ? '0 10px 30px rgba(156,122,67,0.18)' : `0 ${22 - 14 * press}px 44px rgba(156,122,67,0.45)`,
          }}
        >
          {followed ? (
            <>
              Siguiendo
              <svg width="54" height="54" viewBox="0 0 24 24" style={{transform: `scale(${pop})`}}>
                <circle cx="12" cy="12" r="11" fill={colors.gold} />
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
                  <Heart color={h.c} size={h.s} />
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
          fontSize: 40,
          fontWeight: 500,
          color: colors.carbon,
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
          fontSize: 28,
          letterSpacing: 8,
          color: colors.roseGold,
          opacity: footer,
        }}
      >
        #GBAccesorios · #AccesoriosDeModa
      </div>

      <Sparkle x={230} y={300} size={60} progress={(frame - 6) / 26} />
      <Sparkle x={860} y={560} size={48} progress={(frame - 12) / 24} color={colors.roseGold} />
      <Sparkle x={820} y={1120} size={60} progress={(frame - TAP) / 22} />
      <Sparkle x={250} y={1260} size={44} progress={(frame - TAP - 4) / 22} color={colors.roseGold} />
    </AbsoluteFill>
  );
};
