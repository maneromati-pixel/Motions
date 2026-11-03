import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS, FONT, GLOW} from '../theme';
import {appear, useIn} from '../ui/anim';
import {Center, Label} from '../ui/primitives';

export const USUARIO = '@TU_USUARIO';

export const Scene12Sigueme: React.FC = () => {
  const frame = useCurrentFrame();
  const pLabel = useIn(4);
  const pBar = useIn(10);
  const typeStart = 22;
  const chars = Math.max(0, Math.min(USUARIO.length, Math.floor((frame - typeStart) / 2.5)));
  const cursorOn = Math.floor(frame / 15) % 2 === 0 || (chars > 0 && chars < USUARIO.length);
  return (
    <Center>
      <Label color={COLORS.white} glow size={44} style={{...appear(pLabel), marginBottom: 80}}>
        Sígueme
      </Label>
      <div
        style={{
          ...appear(pBar),
          width: 880,
          height: 150,
          borderRadius: 75,
          background: COLORS.white,
          boxShadow: GLOW.box,
          display: 'flex',
          alignItems: 'center',
          padding: '0 56px',
          boxSizing: 'border-box',
          gap: 34,
        }}
      >
        <svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke={COLORS.black} strokeWidth={2.4} strokeLinecap="round">
          <circle cx={10.5} cy={10.5} r={7} />
          <path d="M16 16 L21.5 21.5" />
        </svg>
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 60, color: COLORS.black, letterSpacing: '0.04em', display: 'flex', alignItems: 'center'}}>
          {USUARIO.slice(0, chars)}
          <span style={{display: 'inline-block', width: 5, height: 68, marginLeft: 6, background: COLORS.black, opacity: cursorOn ? 1 : 0}} />
        </div>
      </div>
    </Center>
  );
};
