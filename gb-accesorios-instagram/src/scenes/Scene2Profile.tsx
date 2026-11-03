import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CheckerBg} from '../components/CheckerBg';
import {Heart} from '../components/Heart';
import {Logo} from '../components/Logo';
import {ProductArt} from '../components/Products';
import {bubbleText, colors, fonts, hotGradient, HANDLE} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Aparición escalonada: fade + leve subida
const useIn = (start: number, dur = 12) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + dur], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return {opacity: p, transform: `translateY(${(1 - p) * 26}px)`};
};

const BIO = ['🎀 Accesorios que enamoran', '💖 Aros · Collares · Carteras · Lentes', '📦 Envíos · Consultas por DM 💌'];

const HIGHLIGHTS: Array<{label: string; art: number}> = [
  {label: 'Novedades', art: 2},
  {label: 'Aros', art: 0},
  {label: 'Carteras', art: 1},
  {label: 'Lentes', art: 3},
  {label: 'Relojes', art: 4},
];

// PLACA 2 (2–4 s): maqueta del perfil de Instagram con el logo y los colores de la marca.
export const Scene2Profile: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const rise = spring({frame, fps, config: {damping: 14, mass: 0.8}});
  const tilt = interpolate(rise, [0, 1], [18, 0]);
  const drift = interpolate(frame, [0, 60], [1, 1.035], clamp);
  const ring = interpolate(frame, [4, 22], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const typed = Math.round(interpolate(frame, [6, 22], [0, HANDLE.length], clamp));
  const followPulse = frame > 34 ? 1 + 0.05 * Math.max(0, Math.sin(((frame - 34) / 10) * Math.PI)) : 1;

  const s = {
    title: useIn(0, 10),
    status: useIn(2),
    header: useIn(4),
    name: useIn(10),
    bio: [useIn(14), useIn(17), useIn(20)],
    buttons: useIn(23),
    tabs: useIn(30),
  };

  return (
    <AbsoluteFill style={{alignItems: 'center', perspective: 2200, overflow: 'hidden'}}>
      <CheckerBg light={colors.bubble} dark={colors.heart} amp={30} speed={0.8} />

      <div style={{position: 'absolute', top: 52, fontSize: 64, ...bubbleText(10, colors.white), ...s.title}}>
        encontranos en IG 💕
      </div>

      {/* corazones flotando junto al teléfono */}
      {[
        {x: 10, y: 700, s: 150, d: 20},
        {x: 920, y: 1150, s: 140, d: 26},
      ].map((h, i) => {
        const p = spring({frame: frame - h.d, fps, config: {damping: 9}});
        return (
          <div key={i} style={{position: 'absolute', left: h.x, top: h.y + Math.sin((frame + i * 20) / 8) * 14, transform: `scale(${p}) rotate(${i ? 14 : -14}deg)`}}>
            <Heart size={h.s} fill={i ? colors.white : colors.bubble} />
          </div>
        );
      })}
      {/* TELÉFONO */}
      <div
        style={{
          position: 'absolute',
          top: 190,
          width: 900,
          height: 1600,
          borderRadius: 80,
          background: colors.white,
          boxShadow: `0 50px 100px rgba(176,2,78,0.35), 0 0 0 14px ${colors.hot}`,
          overflow: 'hidden',
          transform: `translateY(${(1 - rise) * 900}px) rotateX(${tilt}deg) scale(${drift})`,
          transformOrigin: '50% 0%',
          fontFamily: fonts.round,
          color: colors.ink,
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
          <span style={{fontSize: 42, fontWeight: 600}}>
            {HANDLE.slice(0, typed)}
            <span style={{opacity: frame % 16 < 8 && typed < HANDLE.length ? 1 : 0, color: colors.hot}}>|</span>
          </span>
          <span style={{marginLeft: 'auto', fontSize: 40, letterSpacing: 4}}>⋯</span>
        </div>

        {/* avatar + nombre */}
        <div style={{display: 'flex', alignItems: 'center', gap: 36, padding: '24px 50px 10px'}}>
          <div style={{position: 'relative', width: 240, height: 240, flexShrink: 0}}>
            <svg width="240" height="240" viewBox="0 0 240 240" style={{position: 'absolute', inset: 0}}>
              <defs>
                <linearGradient id="avatarRing" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor={colors.hot} />
                  <stop offset="60%" stopColor={colors.heart} />
                  <stop offset="100%" stopColor={colors.bubble} />
                </linearGradient>
              </defs>
              <circle
                cx="120" cy="120" r="113" fill="none" stroke="url(#avatarRing)" strokeWidth="9"
                strokeDasharray={2 * Math.PI * 113} strokeDashoffset={2 * Math.PI * 113 * (1 - ring)}
                transform={`rotate(${-90 + frame * 2} 120 120)`} strokeLinecap="round"
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 18,
                borderRadius: '50%',
                overflow: 'hidden',
                transform: `scale(${spring({frame: frame - 4, fps, config: {damping: 10}})})`,
              }}
            >
              {/* el cuadriculado en miniatura, como la foto de perfil */}
              <div style={{position: 'absolute', width: 1080, height: 1920, transform: 'scale(0.2)', transformOrigin: '0 0'}}>
                <CheckerBg cell={200} amp={30} />
              </div>
              <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Logo width={170} />
              </div>
            </div>
          </div>
          <div style={s.name}>
            <div style={{fontFamily: fonts.display, fontSize: 54, lineHeight: 1.1, color: colors.hot}}>
              GB Accesorios
              <br />
              <span style={{color: colors.heart}}>&amp; Moda</span>
            </div>
            <div style={{fontSize: 30, color: '#B36A8C', marginTop: 10, fontWeight: 500}}>Tienda de accesorios</div>
          </div>
        </div>

        {/* bio */}
        <div style={{padding: '18px 50px 0', fontSize: 35, lineHeight: 1.55, fontWeight: 500}}>
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
              height: 86,
              borderRadius: 43,
              background: hotGradient,
              color: colors.white,
              fontWeight: 600,
              fontSize: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${followPulse})`,
              boxShadow: '0 10px 24px rgba(227,3,100,0.35)',
            }}
          >
            Seguir
          </div>
          <div style={{flex: 1, height: 86, borderRadius: 43, background: colors.cream, fontWeight: 600, fontSize: 36, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            Mensaje
          </div>
          <div style={{width: 86, height: 86, borderRadius: 43, background: colors.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34}}>
            ⌄
          </div>
        </div>

        {/* historias destacadas */}
        <div style={{display: 'flex', justifyContent: 'space-between', padding: '40px 46px 0'}}>
          {HIGHLIGHTS.map((h, i) => {
            const p = spring({frame: frame - 24 - i * 3, fps, config: {damping: 10, stiffness: 160}});
            return (
              <div key={h.label} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, transform: `scale(${p})`, opacity: Math.min(1, p * 1.5)}}>
                <div style={{width: 138, height: 138, borderRadius: '50%', border: `4px solid ${colors.bubble}`, padding: 6, boxSizing: 'border-box'}}>
                  <ProductArt index={h.art} size={118} rounded={60} t={frame} />
                </div>
                <span style={{fontSize: 25, fontWeight: 500}}>{h.label}</span>
              </div>
            );
          })}
        </div>

        {/* pestañas */}
        <div style={{display: 'flex', marginTop: 34, borderBottom: `2px solid ${colors.cream}`, ...s.tabs}}>
          {['▦', '▶', '◎'].map((ic, i) => (
            <div key={ic} style={{flex: 1, textAlign: 'center', fontSize: 40, padding: '16px 0', color: i === 0 ? colors.hot : '#E3A9C4', borderBottom: i === 0 ? `4px solid ${colors.hot}` : 'none'}}>
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
