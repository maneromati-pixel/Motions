import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {colors} from '../theme';

// Cuadriculado ondulado del logo, animado (las ondas "flamean" suavemente).
export const CheckerBg: React.FC<{
  light?: string;
  dark?: string;
  cell?: number;
  amp?: number;
  speed?: number;
  opacity?: number;
}> = ({light = colors.cream, dark = colors.blush, cell = 180, amp = 38, speed = 1, opacity = 1}) => {
  const frame = useCurrentFrame();
  const t = (frame / 30) * speed;
  const W = 1080;
  const H = 1920;
  const cols = Math.ceil(W / cell) + 3;
  const rows = Math.ceil(H / cell) + 3;
  const sub = 5; // subdivisiones por lado para que los bordes sean curvos

  const warp = (x: number, y: number): [number, number] => [
    x + amp * Math.sin(y / 260 + t * 1.6) + amp * 0.5 * Math.sin((x + y) / 400 + t),
    y + amp * Math.sin(x / 230 - t * 1.3) + amp * 0.4 * Math.cos((x - y) / 380 + t * 0.8),
  ];

  const cells: string[] = [];
  for (let r = -1; r < rows; r++) {
    for (let c = -1; c < cols; c++) {
      if ((r + c) % 2 !== 0) continue;
      const x0 = c * cell - cell;
      const y0 = r * cell - cell;
      const pts: string[] = [];
      const edge = (ax: number, ay: number, bx: number, by: number) => {
        for (let i = 0; i < sub; i++) {
          const k = i / sub;
          const [wx, wy] = warp(ax + (bx - ax) * k, ay + (by - ay) * k);
          pts.push(`${wx.toFixed(1)},${wy.toFixed(1)}`);
        }
      };
      edge(x0, y0, x0 + cell, y0);
      edge(x0 + cell, y0, x0 + cell, y0 + cell);
      edge(x0 + cell, y0 + cell, x0, y0 + cell);
      edge(x0, y0 + cell, x0, y0);
      cells.push(pts.join(' '));
    }
  }

  return (
    <AbsoluteFill style={{background: light, opacity}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {cells.map((p, i) => (
          <polygon key={i} points={p} fill={dark} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
