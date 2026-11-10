import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../config";
import { easeInOut, prog } from "./anim";

/**
 * Transiciones con temática de agua. Se montan dentro de una <Sequence>
 * cuya duración es la de la transición; el corte de escena ocurre en el medio.
 */

/** Ola: una masa de agua sube desde abajo con cresta de espuma, tapa la pantalla y sigue de largo. */
export const OlaTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const p = prog(frame, 0, d, easeInOut);
  const H = 2600; // alto de la masa de agua (más que la pantalla)
  // borde superior de la masa: desde abajo de la pantalla hasta bien arriba
  const topY = 1920 + 80 - p * (1920 + H);
  const botY = topY + H;
  const ph = frame * 0.32;

  const wave = (y: number, amp: number, k: number, phase: number, dir: 1 | -1) => {
    const pts: string[] = [];
    for (let x = -40; x <= 1120; x += 40) {
      const yy = y + Math.sin(x * k + phase) * amp + Math.sin(x * k * 2.3 + phase * 1.7) * amp * 0.35;
      pts.push(`${x},${yy.toFixed(1)}`);
    }
    return dir === 1 ? pts.join(" L") : pts.reverse().join(" L");
  };
  const body = `M${wave(topY, 34, 0.009, ph, 1)} L1120,${botY} ${"L" + wave(botY, 40, 0.008, -ph, -1)} Z`;

  // burbujas atrapadas dentro del agua
  const bubbles = new Array(26).fill(0).map((_, i) => {
    const bx = random(`ob-x-${i}`) * 1080;
    const by = topY + 120 + random(`ob-y-${i}`) * (H - 240) - frame * (4 + random(`ob-v-${i}`) * 6);
    const r = 6 + random(`ob-r-${i}`) * 18;
    return { bx, by, r };
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="ola-agua" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7FD6F6" />
            <stop offset="18%" stopColor={COLORS.azulGel} />
            <stop offset="60%" stopColor="#0A6FA6" />
            <stop offset="100%" stopColor="#5CC4EE" />
          </linearGradient>
          <radialGradient id="ola-burbuja" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.9} />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.45} />
          </radialGradient>
        </defs>
        <path d={body} fill="url(#ola-agua)" />
        {/* reflejos de luz dentro del agua */}
        {[0, 1, 2].map((k) => (
          <path
            key={k}
            d={`M${wave(topY + 160 + k * 420, 22, 0.011, ph * 1.3 + k, 1)}`}
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity={0.18}
            strokeWidth={10 - k * 2}
          />
        ))}
        {bubbles.map((b, i) =>
          b.by > topY + 40 && b.by < botY - 40 ? (
            <circle key={i} cx={b.bx} cy={b.by} r={b.r} fill="url(#ola-burbuja)" />
          ) : null,
        )}
        {/* cresta de espuma */}
        <path d={`M${wave(topY, 34, 0.009, ph, 1)}`} fill="none" stroke={COLORS.crema} strokeOpacity={0.95} strokeWidth={10} strokeLinecap="round" />
        <path d={`M${wave(topY + 22, 30, 0.009, ph + 0.6, 1)}`} fill="none" stroke="#FFFFFF" strokeOpacity={0.4} strokeWidth={5} />
        <path d={`M${wave(botY, 40, 0.008, -ph, 1)}`} fill="none" stroke={COLORS.crema} strokeOpacity={0.7} strokeWidth={6} />
      </svg>
    </AbsoluteFill>
  );
};

/**
 * Reflejo: un haz ancho de luz refractada por el agua (cáusticas) cruza en diagonal,
 * de izquierda a derecha. En el centro del recorrido cubre la pantalla con un velo luminoso
 * y ahí ocurre el cambio de escena. Sobrio, sin elementos sueltos.
 */
export const ReflejoTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const p = prog(frame, 0, d, easeInOut);
  // la banda recorre de -1600 a +1600 px en diagonal
  const x = -1700 + p * 3400;
  const peak = Math.sin(p * Math.PI);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="reflejo-banda" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#B4544F" stopOpacity={0} />
            <stop offset="30%" stopColor="#B4544F" stopOpacity={0.9} />
            <stop offset="46%" stopColor="#F3D9CC" stopOpacity={0.97} />
            <stop offset="54%" stopColor="#F3D9CC" stopOpacity={0.97} />
            <stop offset="70%" stopColor="#B4544F" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#B4544F" stopOpacity={0} />
          </linearGradient>
          <filter id="reflejo-causticas" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.011" numOctaves={1} seed={3} />
            <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1 0 0 0 0" />
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0 0 0 0 0.8 0 0 0 0.8 0 0 0 0 0" />
            </feComponentTransfer>
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
          <linearGradient id="reflejo-mask-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#000" />
            <stop offset="30%" stopColor="#fff" />
            <stop offset="70%" stopColor="#fff" />
            <stop offset="100%" stopColor="#000" />
          </linearGradient>
          <mask id="reflejo-mask" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="6000" height="6000">
            <rect x={-600} y={-1200} width={2400} height={4400} fill="url(#reflejo-mask-g)" />
          </mask>
        </defs>
        <g transform={`translate(${x} 0) rotate(18 540 960)`}>
          {/* velo luminoso cálido */}
          <rect x={-600} y={-1200} width={2400} height={4400} fill="url(#reflejo-banda)" />
          {/* red de luz cáustica, como sol atravesando el agua */}
          <g mask="url(#reflejo-mask)" style={{ mixBlendMode: "screen" }} opacity={0.3}>
            <rect
              x={-600}
              y={-1200 - frame * 3}
              width={2400}
              height={4800}
              filter="url(#reflejo-causticas)"
            />
          </g>
        </g>
        {/* leve destello general en el pico */}
        <rect width={1080} height={1920} fill="#FFF3EA" opacity={peak * 0.12} />
      </svg>
    </AbsoluteFill>
  );
};
