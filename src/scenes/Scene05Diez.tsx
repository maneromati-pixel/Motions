import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS, GLOW} from '../theme';
import {appear, ramp, useIn} from '../ui/anim';
import {BigText, Center, Label} from '../ui/primitives';

const X0 = 110;
const X1 = 970;
const X25 = 300;
const X35 = 780;

export const Scene05Diez: React.FC = () => {
  const frame = useCurrentFrame();
  const line = ramp(frame, 0, 14);
  const seg = ramp(frame, 12, 30);
  const pText = useIn(22);
  const tick = (x: number, label: string, on: number) => (
    <div style={{position: 'absolute', left: x, top: 0, transform: 'translateX(-50%)', opacity: on, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{width: 2, height: 46, background: COLORS.white, marginTop: -22}} />
      <BigText size={64} glow="soft" style={{marginTop: 26}}>
        {label}
      </BigText>
    </div>
  );
  return (
    <Center>
      <BigText size={150} glow="strong" style={{...appear(pText), marginBottom: 30}}>
        10 AÑOS
      </BigText>
      <Label style={{...appear(pText), marginBottom: 110}}>De diferencia</Label>
      <div style={{position: 'relative', width: 1080, height: 140}}>
        <div style={{position: 'absolute', left: X0, top: 0, height: 2, width: (X1 - X0) * line, background: COLORS.dark}} />
        <div
          style={{
            position: 'absolute',
            left: X25,
            top: -3,
            height: 8,
            borderRadius: 4,
            width: (X35 - X25) * seg,
            background: COLORS.white,
            boxShadow: GLOW.boxStrong,
          }}
        />
        {tick(X25, '25', ramp(frame, 6, 12))}
        {tick(X35, '35', ramp(frame, 10, 16))}
      </div>
    </Center>
  );
};
