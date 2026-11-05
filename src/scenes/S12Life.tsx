/**
 * Escena 12 — "TÚ VS LA VIDA" (acento rojo en "LA VIDA"): dos relojes.
 * La aguja de "TÚ" frena con ease-out; la de "LA VIDA" sigue, con glow creciente.
 * Salida: el reloj de LA VIDA viaja al centro y se achica → la moneda de la escena 13.
 */
import React from 'react';
import {Camera, Stage} from '../components/Camera';
import {LineDraw} from '../components/LineDraw';
import {TopLabel} from '../components/TopLabel';
import {useScene} from '../components/SceneContext';
import {breathe, drawGlow, mix, prog} from '../lib/anim';
import {CUES} from '../timings';
import {COLORS, DUR, EASE, TYPE} from '../theme';
import {textGlow} from '../components/Glow';
import {COIN} from './S13Luck';

const R = 128;
const Y = 840;
const LEFT = 320;
const RIGHT = 720;

const circle = (x: number, y: number, r: number) => `M ${x} ${y - r} A ${r} ${r} 0 1 1 ${x - 0.01} ${y - r}`;

const Clock: React.FC<{x: number; y: number; r: number; t: number; angle: number; hand: string; glow: number; delay: number; dimTicks?: number; handOp?: number}> = ({
  x,
  y,
  r,
  t,
  angle,
  hand,
  glow,
  delay,
  dimTicks = 1,
  handOp = 1,
}) => {
  const ring = drawGlow(t, delay, 22);
  const rad = ((angle - 90) * Math.PI) / 180;
  const hp = prog(t, delay + 14, 12, EASE.stroke);
  return (
    <g>
      <LineDraw d={circle(x, y, r)} p={ring.p} g={ring.g * (0.5 + glow * 0.3)} />
      {Array.from({length: 12}, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const r1 = r - 14;
        const r2 = r - (i % 3 === 0 ? 30 : 22);
        const d = drawGlow(t, delay + 6 + i * 1.2, 8);
        return (
          <LineDraw
            key={i}
            d={`M ${x + Math.cos(a) * r1} ${y + Math.sin(a) * r1} L ${x + Math.cos(a) * r2} ${y + Math.sin(a) * r2}`}
            p={d.p}
            g={d.g * 0.3}
            width={i % 3 === 0 ? 3 : 2}
            opacity={0.6 * dimTicks}
          />
        );
      })}
      <LineDraw d={`M ${x} ${y} L ${x + Math.cos(rad) * (r - 38)} ${y + Math.sin(rad) * (r - 38)}`} p={hp} g={0.6 + glow * 1.6} color={hand} width={4.5} boost={1 + glow} opacity={handOp} />
      <circle cx={x} cy={y} r={5} fill={hand} opacity={hp * handOp} />
    </g>
  );
};

const MiniLabel: React.FC<{x: number; text: string; color: string; t: number; delay: number; glow?: number}> = ({x, text, color, t, delay, glow = 0}) => {
  const p = prog(t, delay, 16, EASE.in);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 200,
        width: 400,
        top: Y + R + 44,
        textAlign: 'center',
        fontFamily: TYPE.family,
        fontSize: 24,
        fontWeight: 700,
        letterSpacing: '0.4em',
        paddingLeft: '0.4em',
        color,
        opacity: p * 0.9,
        transform: `translateY(${mix(p, 8, 0)}px)`,
        textShadow: textGlow(glow, color === COLORS.accent ? '200,16,46' : '255,255,255'),
      }}
    >
      {text}
    </div>
  );
};

export const S12Life: React.FC = () => {
  const {t, dur, L} = useScene();
  const life = L(CUES.lifeClock);
  // TÚ: arranca y frena con ease-out hasta detenerse
  const you = 40 + 200 * prog(t, 0, Math.max(30, life - 4), EASE.in);
  // LA VIDA: sigue constante y acelera un poco
  const lifeAngle = 40 + t * 5.5 + Math.max(0, t - life) * Math.max(0, t - life) * 0.04;
  const lifeGlow = prog(t, life - 6, dur - life, EASE.camera);
  // morph hacia la moneda
  const m = prog(t, dur - 4, 16, EASE.stroke);
  const leftOut = prog(t, dur - 10, 10, EASE.out);
  const rx = mix(m, RIGHT, COIN.x);
  const ry = mix(m, Y, COIN.y);
  const rr = mix(m, R, COIN.r);
  const k = breathe(t, 0.012, 90);
  return (
    <Camera
      art={
        <>
          <Stage>
            <g opacity={1 - leftOut} transform={`translate(${LEFT} ${Y}) scale(${k}) translate(${-LEFT} ${-Y})`}>
              <Clock x={LEFT} y={Y} r={R} t={t} angle={you} hand={COLORS.line} glow={0} delay={-6} dimTicks={mix(prog(t, life, 20, EASE.in), 1, 0.5)} />
            </g>
            <g opacity={1}>
              <Clock x={rx} y={ry} r={rr} t={t} angle={lifeAngle} hand={COLORS.accent} glow={lifeGlow * (1 - m)} delay={-6 + DUR.stagger} dimTicks={1 - m} handOp={1 - m} />
            </g>
          </Stage>
          <div style={{opacity: 1 - leftOut}}>
            <MiniLabel x={LEFT} text="TÚ" color={COLORS.white} t={t} delay={4} />
            <MiniLabel x={RIGHT} text="LA VIDA" color={COLORS.accent} t={t} delay={8} glow={lifeGlow} />
          </div>
        </>
      }
      text={<TopLabel text="TÚ VS [LA VIDA]" delay={-4} />}
    />
  );
};
