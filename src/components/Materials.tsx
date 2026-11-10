import React from "react";
import { COLORS } from "../config";

/**
 * Materiales SVG compartidos para dar volumen a los objetos:
 * esferas con luz arriba a la izquierda (como los haces del fondo), vidrio esmerilado y arena.
 * Insertar <MaterialDefs /> dentro de cada <svg> que los use.
 */
export const MaterialDefs: React.FC = () => (
  <defs>
    {/* partícula de suciedad: esfera gris mate */}
    <radialGradient id="sph-grey" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stopColor="#E9E2DE" />
      <stop offset="35%" stopColor={COLORS.gris} />
      <stop offset="80%" stopColor="#6E6260" />
      <stop offset="100%" stopColor="#4A3F3E" />
    </radialGradient>
    {/* partícula de gel: esfera azul translúcida con brillo */}
    <radialGradient id="sph-blue" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stopColor="#D9F3FF" />
      <stop offset="25%" stopColor="#5CC4EE" />
      <stop offset="65%" stopColor={COLORS.azulGel} />
      <stop offset="100%" stopColor="#014E73" />
    </radialGradient>
    {/* partícula fina clara */}
    <radialGradient id="sph-cream" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stopColor="#FFFFFF" />
      <stop offset="50%" stopColor={COLORS.crema} />
      <stop offset="100%" stopColor="#B9AFA6" />
    </radialGradient>
    {/* grano de arena: crema translúcido con volumen */}
    <radialGradient id="sph-sand" cx="35%" cy="28%" r="80%">
      <stop offset="0%" stopColor="#FFFBF4" stopOpacity={0.9} />
      <stop offset="40%" stopColor="#EBDDCB" stopOpacity={0.5} />
      <stop offset="100%" stopColor="#8A6A5E" stopOpacity={0.3} />
    </radialGradient>
    {/* halo gelatinoso del flóculo */}
    <radialGradient id="floc-halo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#BFE9FF" stopOpacity={0.32} />
      <stop offset="60%" stopColor="#8FD3F2" stopOpacity={0.14} />
      <stop offset="100%" stopColor="#8FD3F2" stopOpacity={0} />
    </radialGradient>
    {/* vidrio: tanque/carcasa con reflejo lateral */}
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.16} />
      <stop offset="12%" stopColor="#FFFFFF" stopOpacity={0.28} />
      <stop offset="22%" stopColor="#FFFFFF" stopOpacity={0.05} />
      <stop offset="75%" stopColor="#FFFFFF" stopOpacity={0.03} />
      <stop offset="92%" stopColor="#FFFFFF" stopOpacity={0.12} />
      <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.05} />
    </linearGradient>
    {/* agua dentro del tanque: leve velo vertical */}
    <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#FFE9E0" stopOpacity={0.1} />
      <stop offset="100%" stopColor="#FFE9E0" stopOpacity={0.02} />
    </linearGradient>
    {/* gel azul dentro de la cápsula (ícono) */}
    <linearGradient id="gel-fill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#6FD0F5" />
      <stop offset="55%" stopColor={COLORS.azulGel} />
      <stop offset="100%" stopColor="#015D88" />
    </linearGradient>
    <filter id="soft-blur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.4" />
    </filter>
    <filter id="drop" x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#1E0204" floodOpacity="0.45" />
    </filter>
  </defs>
);

/** Esfera con volumen (partícula). */
export const Sphere: React.FC<{
  cx: number;
  cy: number;
  r: number;
  kind: "grey" | "blue" | "cream";
  opacity?: number;
  blur?: boolean;
}> = ({ cx, cy, r, kind, opacity = 1, blur }) => (
  <circle
    cx={cx}
    cy={cy}
    r={Math.max(0, r)}
    fill={`url(#sph-${kind})`}
    opacity={opacity}
    filter={blur ? "url(#soft-blur)" : undefined}
  />
);
