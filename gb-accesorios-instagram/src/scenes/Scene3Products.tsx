import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {PRODUCTS, ProductArt} from '../components/Products';
import {Sparkle} from '../components/Sparkle';
import {colors, fonts} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const TILE = 300;
const GAP = 18;
const CARD = 640;
const CARD_GAP = 60;
const CAROUSEL = [1, 0, 3, 6, 5]; // Carteras, Aros, Lentes, Pulseras, Anillos

// PLACA 3 (4–6.5 s): grilla 3x3 que gira tile por tile, se dispersa y da paso a un carrusel
// que avanza a tiempo con la música (cada 15 frames = 1 negra a 120 BPM).
export const Scene3Products: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleIn = interpolate(frame, [0, 12], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const titleSwap = interpolate(frame, [28, 36], [0, 1], clamp);

  // --- grilla ---
  const gridExit = interpolate(frame, [27, 38], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const gridW = TILE * 3 + GAP * 2;

  // --- carrusel ---
  const enter = spring({frame: frame - 30, fps, config: {damping: 17, mass: 0.8}});
  const step1 = spring({frame: frame - 45, fps, config: {damping: 15, stiffness: 140}});
  const step2 = spring({frame: frame - 60, fps, config: {damping: 15, stiffness: 140}});
  const pos = step1 + step2; // índice de la tarjeta centrada (0 → 2)
  const carouselX = (1 - enter) * 1100;

  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${colors.ivory} 0%, ${colors.nude} 100%)`, overflow: 'hidden'}}>
      {/* títulos (cambian de "grilla" a "carrusel") */}
      <div style={{position: 'absolute', top: 170, width: '100%', textAlign: 'center', opacity: titleIn, transform: `translateY(${(1 - titleIn) * 30}px)`}}>
        <div style={{position: 'relative', height: 150}}>
          <div style={{position: 'absolute', width: '100%', opacity: 1 - titleSwap, transform: `translateY(${-titleSwap * 40}px)`}}>
            <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 96, color: colors.carbon}}>Lo nuevo ✨</div>
          </div>
          <div style={{position: 'absolute', width: '100%', opacity: titleSwap, transform: `translateY(${(1 - titleSwap) * 40}px)`}}>
            <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 96, color: colors.carbon}}>Elegí tu favorito</div>
          </div>
        </div>
        <div style={{fontFamily: fonts.sans, fontWeight: 600, letterSpacing: 9, fontSize: 30, color: colors.roseGold}}>
          BIJOU · CARTERAS · LENTES · RELOJES
        </div>
      </div>

      {/* GRILLA 3x3 */}
      {gridExit < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: (1080 - gridW) / 2,
            top: 600,
            width: gridW,
            display: 'grid',
            gridTemplateColumns: `repeat(3, ${TILE}px)`,
            gap: GAP,
            perspective: 1400,
          }}
        >
          {PRODUCTS.map((p, i) => {
            const r = Math.floor(i / 3);
            const c = i % 3;
            const d = (r + c) * 3;
            const flip = spring({frame: frame - d, fps, config: {damping: 14, stiffness: 120}});
            const dx = (c - 1) * 500 * gridExit;
            const dy = (r - 1) * 500 * gridExit;
            return (
              <div
                key={p.name}
                style={{
                  position: 'relative',
                  transform: `translate(${dx}px, ${dy}px) rotateY(${(1 - flip) * 90}deg) scale(${1 - gridExit * 0.6})`,
                  opacity: Math.min(1, flip * 2) * (1 - gridExit),
                  borderRadius: 28,
                  overflow: 'hidden',
                  boxShadow: '0 16px 30px rgba(120,70,50,0.18)',
                }}
              >
                <ProductArt index={i} size={TILE} t={frame} />
                <div
                  style={{
                    position: 'absolute',
                    left: 18,
                    bottom: 16,
                    fontFamily: fonts.sans,
                    fontWeight: 600,
                    fontSize: 22,
                    letterSpacing: 3,
                    color: colors.carbon,
                    background: '#ffffffcc',
                    padding: '6px 14px',
                    borderRadius: 30,
                  }}
                >
                  {p.name.toUpperCase()}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* CARRUSEL */}
      {frame >= 28 ? (
        <div style={{position: 'absolute', top: 610, left: 0, width: 1080, height: 1000, transform: `translateX(${carouselX}px)`}}>
          {CAROUSEL.map((idx, k) => {
            const dist = k - pos;
            const x = 540 - CARD / 2 + dist * (CARD + CARD_GAP);
            const sc = interpolate(Math.abs(dist), [0, 1], [1, 0.8], clamp);
            const rot = interpolate(dist, [-1, 0, 1], [8, 0, -8], clamp);
            const p = PRODUCTS[idx];
            return (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  left: x,
                  top: 0,
                  width: CARD,
                  transform: `scale(${sc}) rotate(${rot}deg)`,
                  opacity: interpolate(Math.abs(dist), [0, 1.6], [1, 0.35], clamp),
                }}
              >
                <div style={{borderRadius: 44, overflow: 'hidden', boxShadow: '0 30px 60px rgba(120,70,50,0.28)', border: `6px solid ${colors.white}`}}>
                  <ProductArt index={idx} size={CARD - 12} t={frame} />
                </div>
                <div style={{textAlign: 'center', marginTop: 34}}>
                  <div style={{fontFamily: fonts.serif, fontWeight: 700, fontSize: 70, color: colors.carbon}}>{p.name}</div>
                  <div style={{fontFamily: fonts.sans, fontWeight: 500, fontSize: 30, letterSpacing: 4, color: colors.roseGold, marginTop: 6}}>
                    NUEVOS MODELOS
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* indicador del carrusel */}
      <div style={{position: 'absolute', bottom: 240, width: '100%', display: 'flex', justifyContent: 'center', gap: 16, opacity: enter}}>
        {CAROUSEL.map((_, k) => {
          const active = 1 - Math.min(1, Math.abs(k - pos));
          return <div key={k} style={{width: 18 + 36 * active, height: 18, borderRadius: 9, background: active > 0.5 ? colors.gold : '#d8c3b8'}} />;
        })}
      </div>

      <Sparkle x={860} y={560} size={70} progress={(frame - 36) / 24} />
      <Sparkle x={200} y={1180} size={50} progress={(frame - 40) / 24} color={colors.roseGold} />
      <Sparkle x={840} y={1260} size={44} progress={(frame - 52) / 22} />
    </AbsoluteFill>
  );
};
