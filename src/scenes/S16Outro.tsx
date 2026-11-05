/**
 * Escena 16 — Cierre: el fondo vira a azul noche, aparece "SÍGUEME" y una barra
 * de búsqueda blanca con lupa donde se escribe el usuario letra por letra
 * (cursor titilando, click sonoro por letra — ver OUTRO_TYPING).
 */
import React from 'react';
import {Stage} from '../components/Camera';
import {LineDraw} from '../components/LineDraw';
import {TopLabel} from '../components/TopLabel';
import {useScene} from '../components/SceneContext';
import {textGlow} from '../components/Glow';
import {breathe, mix, prog, settle} from '../lib/anim';
import {USERNAME} from '../timings';
import {COLORS, EASE, TYPE, VIDEO} from '../theme';

export const OUTRO_TYPING = {start: 26, perLetter: 3};

const BAR = {x: 520, y: 860, w: 760, h: 116};

export const S16Outro: React.FC = () => {
  const {t} = useScene();
  const bar = settle(t, 8);
  const typed = Math.max(0, Math.min(USERNAME.length, Math.floor((t - OUTRO_TYPING.start) / OUTRO_TYPING.perLetter) + 1));
  const doneAt = OUTRO_TYPING.start + USERNAME.length * OUTRO_TYPING.perLetter;
  const cursorOn = t < doneAt ? true : Math.floor((t - doneAt) / 9) % 2 === 0;
  const sub = prog(t, doneAt + 4, 14, EASE.in);
  const k = breathe(t, 0.012, 80);
  const lens = prog(t, 14, 14, EASE.stroke);
  const lx = BAR.x - BAR.w / 2 + 62;
  return (
    <>
      <TopLabel text="SÍGUEME" delay={2} exitAt={9999} />
      <div
        style={{
          position: 'absolute',
          left: BAR.x - BAR.w / 2,
          top: BAR.y - BAR.h / 2,
          width: BAR.w,
          height: BAR.h,
          borderRadius: BAR.h / 2,
          background: COLORS.white,
          transform: `scale(${mix(bar, 0.86, 1) * k})`,
          opacity: prog(t, 6, 10, EASE.in),
          boxShadow: `0 0 30px rgba(255,255,255,${0.18 * bar}), 0 0 90px rgba(140,160,255,${0.12 * bar})`,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 118,
          boxSizing: 'border-box',
          fontFamily: TYPE.family,
          fontSize: 50,
          fontWeight: 600,
          color: '#0D0F1F',
          letterSpacing: '0.01em',
        }}
      >
        <span>{USERNAME.slice(0, typed)}</span>
        <span
          style={{
            display: 'inline-block',
            width: 4,
            height: 56,
            marginLeft: 6,
            background: '#0D0F1F',
            opacity: t >= OUTRO_TYPING.start - 6 && cursorOn ? 1 : 0,
          }}
        />
      </div>
      {/* lupa (encima de la barra, trazo oscuro) */}
      <Stage style={{transform: `scale(${mix(bar, 0.86, 1) * k})`, transformOrigin: `${BAR.x}px ${BAR.y}px`}}>
        <LineDraw d={`M ${lx - 6} ${BAR.y - 6} m -21 0 a 21 21 0 1 0 42 0 a 21 21 0 1 0 -42 0`} p={lens} g={0} color="#0D0F1F" width={5} />
        <LineDraw d={`M ${lx + 9} ${BAR.y + 9} l 18 18`} p={prog(t, 22, 8, EASE.stroke)} g={0} color="#0D0F1F" width={5} />
      </Stage>
      <div
        style={{
          position: 'absolute',
          left: BAR.x - TYPE.caption.maxWidth / 2,
          width: TYPE.caption.maxWidth,
          top: VIDEO.height * TYPE.caption.y,
          transform: `translateY(-50%) translateY(${mix(sub, 6, 0)}px)`,
          textAlign: 'center',
          fontFamily: TYPE.family,
          fontSize: TYPE.caption.size,
          fontWeight: TYPE.caption.weight,
          color: COLORS.white,
          opacity: sub * 0.85,
          textShadow: textGlow(sub * 0.4),
        }}
      >
        Sígueme para más.
      </div>
    </>
  );
};
