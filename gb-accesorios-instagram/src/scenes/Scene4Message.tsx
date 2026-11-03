import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Sparkle} from '../components/Sparkle';
import {colors, fonts} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Palabra que sube desde una máscara
const Word: React.FC<{children: React.ReactNode; at: number; style?: React.CSSProperties}> = ({children, at, style}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 9], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <span style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', padding: '0 12px 14px'}}>
      <span style={{display: 'inline-block', transform: `translateY(${(1 - p) * 110}%) rotate(${(1 - p) * 6}deg)`, ...style}}>{children}</span>
    </span>
  );
};

// PLACA 4 (6,5–8 s): mensaje de marca sobre fondo carbón.
export const Scene4Message: React.FC = () => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [18, 32], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const sub = interpolate(frame, [24, 34], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const bgScale = interpolate(frame, [0, 45], [1.05, 1.18], clamp);

  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, #2b2322 0%, ${colors.carbon} 70%)`, alignItems: 'center', justifyContent: 'center'}}>
      {/* monograma gigante de fondo */}
      <div
        style={{
          position: 'absolute',
          fontFamily: fonts.serif,
          fontWeight: 700,
          fontSize: 980,
          color: 'transparent',
          WebkitTextStroke: `2px ${colors.gold}40`,
          transform: `scale(${bgScale})`,
          letterSpacing: -60,
        }}
      >
        G<i>B</i>
      </div>

      <div style={{textAlign: 'center', marginTop: -80}}>
        <div style={{fontFamily: fonts.serif, fontSize: 150, color: colors.ivory, lineHeight: 1.05}}>
          <Word at={0}>Tu</Word>
          <Word at={4}>estilo,</Word>
        </div>
        <div style={{fontFamily: fonts.serif, fontSize: 150, color: colors.ivory, lineHeight: 1.05}}>
          <Word at={9}>en</Word>
          <Word at={12}>cada</Word>
        </div>
        <div style={{fontFamily: fonts.serif, fontStyle: 'italic', fontWeight: 700, fontSize: 170, lineHeight: 1.05}}>
          <Word at={15} style={{background: 'linear-gradient(135deg,#F0DBA8,#C8A165 50%,#B9776E)', WebkitBackgroundClip: 'text', color: 'transparent'}}>
            detalle
          </Word>
          <Word at={18}>✨</Word>
        </div>
        <div style={{height: 6, width: 560 * line, background: `linear-gradient(90deg, transparent, ${colors.gold}, transparent)`, margin: '18px auto 0'}} />
        <div
          style={{
            fontFamily: fonts.sans,
            fontWeight: 500,
            fontSize: 36,
            letterSpacing: 10,
            color: colors.blush,
            marginTop: 44,
            opacity: sub,
            transform: `translateY(${(1 - sub) * 20}px)`,
          }}
        >
          NOVEDADES QUE ENAMORAN
        </div>
      </div>

      <Sparkle x={850} y={600} size={80} progress={(frame - 14) / 26} />
      <Sparkle x={210} y={1340} size={56} progress={(frame - 20) / 24} color={colors.blush} />
    </AbsoluteFill>
  );
};
