import React from 'react';
import {colors} from '../theme';

// Destello de 4 puntas (el "✦" de la marca)
export const Sparkle: React.FC<{
  x: number;
  y: number;
  size: number;
  progress: number; // 0..1 ciclo de vida (aparece, brilla, se va)
  color?: string;
  rotate?: number;
}> = ({x, y, size, progress, color = colors.hot, rotate = 0}) => {
  if (progress <= 0 || progress >= 1) return null;
  const s = Math.sin(Math.PI * progress);
  return (
    <svg
      width={size}
      height={size}
      viewBox="-50 -50 100 100"
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        transform: `scale(${s}) rotate(${rotate + progress * 90}deg)`,
        opacity: s,
        overflow: 'visible',
      }}
    >
      <path d="M0 -50 C 6 -10 10 -6 50 0 C 10 6 6 10 0 50 C -6 10 -10 6 -50 0 C -10 -6 -6 -10 0 -50 Z" fill={color} />
    </svg>
  );
};
