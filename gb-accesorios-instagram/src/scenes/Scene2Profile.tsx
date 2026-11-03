import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Logo} from '../components/Logo';
import {ProductArt} from '../components/Products';
import {colors, fonts, goldGradient, HANDLE} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Aparición escalonada: fade + leve subida
const useIn = (start: number, dur = 12) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + dur], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return {opacity: p, transform: `translateY(${(1 - p) * 26}px)`};
};

const BIO = [
  '✨ Accesorios que completan tu look',
  '💍 Bijou · Carteras · Lentes · Relojes',
  '📦 Envíos · Consultas por DM 💌',
];

const HIGHLIGHTS: Array<{label: string; art: number}> = [
  {label: 'Novedades', art: 2},
  {label: 'Aros', art: 0},
  {label: 'Carteras', art: 1},
  {label: 'Lentes', art: 3},
  {label: 'Relojes', art: 4},
];

// PLACA 2 (2–4 s): maqueta del perfil de Instagram con los colores de la marca.
export const Scene2Profile: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const rise = spring({frame, fps, config: {damping: 15, mass: 0.8}});
  const tilt = interpolate(rise, [0, 1], [18, 0]);
  const drift = interpolate(frame, [0, 60], [1, 1.035], clamp); // zoom lento
  const ring = interpolate(frame, [4, 22], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const typed = Math.round(interpolate(frame, [6, 22], [0, HANDLE.length], clamp));
  const followPulse = 1 + 0.04 * Math.max(0, Math.sin(((frame - 34) / 10) * Math.PI)) * (frame > 34 ? 1 : 0);

  const s = {
    status: useIn(2),
    header: useIn(4),
    name: useIn(10),
    bio: [useIn(14), useIn(17), useIn(20)],
    buttons: useIn(23),
    tabs: useIn(30),
  };

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${colors.nude} 0%, ${colors.blush} 55%, ${colors.roseGold} 120%)`,
        alignItems: 'center',
        perspective: 2200,
      }}
    >
      {/* círculos decorativos de fondo */}
      <div style={{position: 'absolute', width: 900, height: 900, borderRadius: '50%', border: `2px solid ${colors.ivory}55`, left: -420, top: -260}} />
      <div style={{position: 'absolute', width: 700, height: 700, borderRadius: '50%', border: `2px solid ${colors.ivory}55`, right: -380, bottom: -160}} />

      <div
        style={{
          position: 'absolute',
          top: 70,
          fontFamily: fonts.sans,
          fontWeight: 600,
          fontSize: 34,
          letterSpacing: 8,
          color: colors.carbon,
          ...useIn(0, 10),
        }}
      >
        ENCONTRANOS EN INSTAGRAM
      </div>

      {/* TELÉFONO */}
      <div
        style={{
          position: 'absolute',
          top: 170,
          width: 900,
          height: 1600,
          borderRadius: 80,
          background: colors.white,
          boxShadow: '0 60px 120px rgba(80,40,30,0.35), 0 0 0 14px #1B1717',
          overflow: 'hidden',
          transform: `translateY(${(1 - rise) * 900}px) rotateX(${tilt}deg) scale(${drift})`,
          transformOrigin: '50% 0%',
          fontFamily: fonts.sans,
          color: colors.carbon,
        }}
      >
        {/* status bar */}
        <div style={{display: 'flex', justifyContent: 'space-between', padding: '34px 60px 0', fontWeight: 600, fontSize: 30, ...s.status}}>
          <span>9:41</span>
          <span style={{letterSpacing: 6}}>▂▄▆ ◔</span>
        </div>

        {/* header */}
        <div style={{display: 'flex', alignItems: 'center', padding: '30px 50px 10px', gap: 18, ...s.header}}>
          <span style={{fontSize: 46, fontWeight: 600}}>‹</span>
          <span style={{fontSize: 40, fontWeight: 600, letterSpacing: 0.5}}>
            {HANDLE.slice(0, typed)}
            <span style={{opacity: frame % 16 < 8 && typed < HANDLE.length ? 1 : 0, color: colors.gold}}>|</span>
          </span>
          <span style={{marginLeft: 'auto', fontSize: 40, letterSpacing: 4}}>⋯</span>
        </div>

        {/* avatar + nombre */}
        <div style={{display: 'flex', alignItems: 'center', gap: 40, padding: '24px 50px 10px'}}>
          <div style={{position: 'relative', width: 230, height: 230, flexShrink: 0}}>
            <svg width="230" height="230" viewBox="0 0 230 230" style={{position: 'absolute', inset: 0}}>
              <defs>
                <linearGradient id="avatarRing" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor={colors.gold} />
                  <stop offset="55%" stopColor={colors.roseGold} />
                  <stop offset="100%" stopColor={colors.blush} />
                </linearGradient>
              </defs>
              <circle
                cx="115" cy="115" r="108" fill="none" stroke="url(#avatarRing)" strokeWidth="9"
                strokeDasharray={2 * Math.PI * 108} strokeDashoffset={2 * Math.PI * 108 * (1 - ring)}
                transform={`rotate(${-90 + frame * 2} 115 115)`} strokeLinecap="round"
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 18,
                borderRadius: '50%',
                background: colors.ivory,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${spring({frame: frame - 4, fps, config: {damping: 12}})})`,
              }}
            >
              <Logo size={170} id="avatar" />
            </div>
          </div>
          <div style={s.name}>
            <div style={{fontFamily: fonts.serif, fontWeight: 700, fontSize: 52, lineHeight: 1.1}}>
              GB Accesorios
              <br />
              <span style={{fontStyle: 'italic', color: colors.roseGold}}>&amp; Moda</span>
            </div>
            <div style={{fontSize: 28, color: '#8a7a74', marginTop: 12, fontWeight: 500}}>Tienda de accesorios</div>
          </div>
        </div>

        {/* bio */}
        <div style={{padding: '18px 50px 0', fontSize: 33, lineHeight: 1.6, fontWeight: 500}}>
          {BIO.map((line, i) => (
            <div key={line} style={s.bio[i]}>
              {line}
            </div>
          ))}
        </div>

        {/* botones */}
        <div style={{display: 'flex', gap: 16, padding: '34px 50px 0', ...s.buttons}}>
          <div
            style={{
              flex: 1.3,
              height: 84,
              borderRadius: 20,
              background: goldGradient,
              color: colors.white,
              fontWeight: 600,
              fontSize: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${followPulse})`,
              boxShadow: '0 10px 24px rgba(156,122,67,0.35)',
            }}
          >
            Seguir
          </div>
          <div style={{flex: 1, height: 84, borderRadius: 20, background: colors.nude, fontWeight: 600, fontSize: 34, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            Mensaje
          </div>
          <div style={{width: 84, height: 84, borderRadius: 20, background: colors.nude, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34}}>
            ⌄
          </div>
        </div>

        {/* historias destacadas */}
        <div style={{display: 'flex', justifyContent: 'space-between', padding: '40px 46px 0'}}>
          {HIGHLIGHTS.map((h, i) => {
            const p = spring({frame: frame - 24 - i * 3, fps, config: {damping: 11, stiffness: 160}});
            return (
              <div key={h.label} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, transform: `scale(${p})`, opacity: Math.min(1, p * 1.5)}}>
                <div style={{width: 138, height: 138, borderRadius: '50%', border: `4px solid ${colors.nude}`, padding: 6, boxSizing: 'border-box'}}>
                  <ProductArt index={h.art} size={118} rounded={60} t={frame} />
                </div>
                <span style={{fontSize: 24, fontWeight: 500}}>{h.label}</span>
              </div>
            );
          })}
        </div>

        {/* pestañas */}
        <div style={{display: 'flex', marginTop: 34, borderBottom: '2px solid #eee', ...s.tabs}}>
          {['▦', '▶', '◎'].map((ic, i) => (
            <div key={ic} style={{flex: 1, textAlign: 'center', fontSize: 40, padding: '16px 0', color: i === 0 ? colors.carbon : '#b9aaa4', borderBottom: i === 0 ? `4px solid ${colors.carbon}` : 'none'}}>
              {ic}
            </div>
          ))}
        </div>

        {/* grilla */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4}}>
          {Array.from({length: 6}).map((_, i) => {
            const p = interpolate(frame, [32 + i * 2, 42 + i * 2], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.6))});
            return (
              <div key={i} style={{opacity: p, transform: `scale(${0.6 + 0.4 * p})`}}>
                <ProductArt index={(i + 4) % 9} size={297} t={frame} />
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
