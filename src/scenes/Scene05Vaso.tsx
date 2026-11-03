import React from "react";
import { random, useCurrentFrame } from "remotion";
import { Coin } from "../components/Coin";
import { Scene } from "../components/Scene";
import { Title } from "../components/Text";
import { C, enter, GLOW, progress } from "../theme";
import { BEATS, SCENES } from "../timing";

const B = BEATS.vaso;
const R = 30;
const G = 1.6; // gravedad px/frame²
const DROP_FROM = 300; // y de aparición
// Vaso (trapecio abierto arriba)
const TOP_Y = 560;
const BOT_Y = 1180;
const TOP_W = 440;
const BOT_W = 320;
const WALL = 6;

const halfWidthAt = (y: number) => {
  const t = (y - TOP_Y) / (BOT_Y - TOP_Y);
  return (TOP_W + (BOT_W - TOP_W) * t) / 2;
};

type CoinPlan = { x0: number; x: number; y: number; start: number; overflow?: { x: number; y: number } };

/** Precalcula el empaquetado hexagonal dentro del vaso y el orden de caída. */
const plan = (() => {
  const coins: CoinPlan[] = [];
  const rowH = R * 2 * 0.87;
  let row = 0;
  let order = 0;
  for (let y = BOT_Y - WALL - R; y > TOP_Y + R * 0.6; y -= rowH, row++) {
    const hw = halfWidthAt(y) - WALL - R - 2;
    const n = Math.floor((hw * 2 - R) / (R * 2)) + 1;
    const span = (n - 1) * R * 2;
    const shift = row % 2 ? R * 0.5 : -R * 0.5; // desfasaje hexagonal
    const xs = Array.from({ length: n }, (_, k) => 540 - span / 2 + k * R * 2 + (n > 1 ? shift * 0.6 : 0));
    // orden aleatorio dentro de la fila
    const idx = xs.map((_, k) => k).sort((a, b) => random(`s${row}-${a}`) - random(`s${row}-${b}`));
    for (const k of idx) {
      coins.push({ x0: xs[k] + (random(`j${row}${k}`) - 0.5) * 30, x: xs[k], y, start: Math.round(B.firstCoin + order * B.coinGap) });
      order++;
    }
  }
  // desborde: caen sobre el borde y ruedan afuera hasta el piso
  const lastStart = Math.round(B.firstCoin + order * B.coinGap);
  const floorY = BOT_Y - R;
  const outside = [
    { x: 240, y: floorY }, { x: 845, y: floorY }, { x: 300, y: floorY - 4 }, { x: 785, y: floorY - 4 },
    { x: 272, y: floorY - 52 }, { x: 815, y: floorY - 52 }, { x: 180, y: floorY }, { x: 905 - 0, y: floorY },
  ];
  outside.forEach((o, i) => {
    const left = o.x < 540;
    coins.push({
      x0: 540 + (left ? -1 : 1) * (60 + random(`ox${i}`) * 80),
      x: o.x,
      y: o.y,
      start: lastStart + 4 + i * B.overflowGap,
      overflow: { x: 540 + (left ? -1 : 1) * (TOP_W / 2 - 10), y: TOP_Y - R - 30 },
    });
  });
  return coins;
})();

/** Caída libre hasta el destino, con un asentamiento mínimo (sin rebote exagerado). */
const fallPos = (c: CoinPlan, f: number): { x: number; y: number; rot: number } | null => {
  const t = f - c.start;
  if (t < 0) return null;
  const rot = (random(`r${c.x}${c.y}`) - 0.5) * 60;
  if (!c.overflow) {
    const dist = c.y - DROP_FROM;
    const tHit = Math.sqrt((2 * dist) / G);
    if (t < tHit) {
      const k = t / tHit;
      return { x: c.x0 + (c.x - c.x0) * k, y: DROP_FROM + 0.5 * G * t * t, rot: rot * k };
    }
    const s = t - tHit;
    const settle = s < 6 ? -Math.sin((s / 6) * Math.PI) * 7 : 0;
    return { x: c.x, y: c.y + settle, rot };
  }
  // desborde: cae hasta el borde del vaso y sigue en parábola hacia afuera
  const o = c.overflow;
  const d1 = o.y - DROP_FROM;
  const t1 = Math.sqrt((2 * d1) / G);
  if (t < t1) {
    const k = t / t1;
    return { x: c.x0 + (o.x - c.x0) * k, y: DROP_FROM + 0.5 * G * t * t, rot: rot * k };
  }
  const v0 = G * t1 * 0.35; // pierde energía al tocar el borde
  const d2 = c.y - o.y;
  const t2 = (-v0 + Math.sqrt(v0 * v0 + 2 * G * d2)) / G;
  const s = t - t1;
  if (s < t2) {
    return { x: o.x + (c.x - o.x) * (s / t2), y: o.y + v0 * s + 0.5 * G * s * s, rot: rot + (s / t2) * (c.x < 540 ? -200 : 200) };
  }
  return { x: c.x, y: c.y, rot: rot + (c.x < 540 ? -200 : 200) };
};

export const Scene05Vaso: React.FC = () => {
  const frame = useCurrentFrame();
  const t = enter(frame, B.title);
  const glass = progress(frame, B.glass, B.glass + 14);
  const htw = TOP_W / 2;
  const hbw = BOT_W / 2;
  const glassPath = `M${540 - htw - 10},${TOP_Y - 40} L${540 - hbw},${BOT_Y} Q${540 - hbw},${BOT_Y + 0} ${540 - hbw + 12},${BOT_Y} L${540 + hbw - 12},${BOT_Y} Q${540 + hbw},${BOT_Y} ${540 + hbw},${BOT_Y} L${540 + htw + 10},${TOP_Y - 40}`;
  return (
    <Scene duration={SCENES.vaso}>
      <div style={{ opacity: t.opacity, transform: t.transform }}>
        <Title>TUS GASTOS</Title>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {/* piso */}
        <line x1={150} y1={BOT_Y + 2} x2={930} y2={BOT_Y + 2} stroke={C.dim} strokeWidth={2} opacity={glass} />
        <g style={{ filter: GLOW }}>
          {plan.map((c, i) => {
            const p = fallPos(c, frame);
            if (!p) return null;
            return <Coin key={i} x={p.x} y={p.y} r={R} rotate={p.rot} />;
          })}
        </g>
        <path
          d={glassPath}
          fill="none"
          stroke={C.white}
          strokeWidth={4}
          strokeLinejoin="round"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - glass}
          style={{ filter: GLOW }}
        />
      </svg>
    </Scene>
  );
};
