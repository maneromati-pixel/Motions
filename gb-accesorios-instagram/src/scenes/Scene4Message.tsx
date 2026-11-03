import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CheckerBg} from '../components/CheckerBg';
import {Heart} from '../components/Heart';
import {Sparkle} from '../components/Sparkle';
import {bubbleText, colors, fonts} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Palabra que salta con rebote
const Word: React.FC<{children: React.ReactNode; at: number; style?: React.CSSProperties}> = ({children, at, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - at, fps, config: {damping: 9, stiffness: 190}});
  return (
    <span
      style={{
        display: 'inline-block',
        margin: '0 14px',
        transform: `translateY(${(1 - p) * 120}px) scale(${p}) rotate(${(1 - p) * -12}deg)`,
        opacity: Math.min(1, p * 2),
        ...style,
      }}
    >
      {children}
    </span>
  );
};

// PLACA 4 (6,5–8 s): mensaje de marca sobre fondo magenta.
export const Scene4Message: React.FC = () => {
  const frame = useCurrentFrame();
  const sub = interpolate(frame, [24, 34], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const beat = 1 + 0.06 * Math.exp(-((frame % 15) / 4)); // late con la negra (15 frames)

  const white = bubbleText(16, colors.white, colors.hotDark, '#7A0035');
  const pink = bubbleText(18, colors.bubble, colors.white, colors.hotDark);

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
      <CheckerBg light={colors.hot} dark="#D10059" amp={40} speed={1.2} />

      {/* corazón gigante que late detrás */}
      <div style={{position: 'absolute', transform: `scale(${beat}) rotate(-8deg)`, opacity: 0.35}}>
        <Heart size={1100} fill={colors.heart} stroke={colors.white} />
      </div>

      <div style={{textAlign: 'center', marginTop: -60, lineHeight: 1.12}}>
        <div style={{fontSize: 150, ...white}}>
          <Word at={0}>tu</Word>
          <Word at={4}>estilo,</Word>
        </div>
        <div style={{fontSize: 150, ...white}}>
          <Word at={9}>en</Word>
          <Word at={12}>cada</Word>
        </div>
        <div style={{fontSize: 176, ...pink}}>
          <Word at={16}>detalle</Word>
        </div>
        <div
          style={{
            fontFamily: fonts.round,
            fontWeight: 600,
            fontSize: 44,
            letterSpacing: 8,
            color: colors.white,
            marginTop: 40,
            opacity: sub,
            transform: `translateY(${(1 - sub) * 20}px)`,
          }}
        >
          NOVEDADES QUE ENAMORAN 💖
        </div>
      </div>

      <Sparkle x={860} y={560} size={90} progress={(frame - 14) / 26} color={colors.white} />
      <Sparkle x={200} y={1380} size={70} progress={(frame - 20) / 24} color={colors.white} />
      <Sparkle x={170} y={620} size={50} progress={(frame - 26) / 18} color={colors.bubble} />
    </AbsoluteFill>
  );
};
