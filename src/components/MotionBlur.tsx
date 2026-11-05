/**
 * <MotionBlur>: motion blur real por sub-frames (@remotion/motion-blur).
 * Envolver SOLO el elemento que se mueve rápido (katana, moneda): los hijos deben
 * leer el frame con useCurrentFrame()/useScene() por dentro para que cada muestra
 * se renderice en un instante distinto.
 */
import React from 'react';
import {CameraMotionBlur} from '@remotion/motion-blur';

export const MotionBlur: React.FC<{children: React.ReactNode; samples?: number; shutter?: number}> = ({
  children,
  samples = 8,
  shutter = 200,
}) => (
  <CameraMotionBlur samples={samples} shutterAngle={shutter}>
    {children}
  </CameraMotionBlur>
);
