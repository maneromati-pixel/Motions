/**
 * Etiqueta superior: MAYÚSCULAS, 27px bold, tracking 0.35em, blanco 85%, y ≈ 15%.
 * Las letras entran escalonadas (1 frame) con el tracking cerrándose apenas.
 * Texto entre [corchetes] usa el color de acento. Ej: "TÚ VS [LA VIDA]".
 */
import React from 'react';
import {COLORS, EASE, SAFE, TYPE, VIDEO} from '../theme';
import {drift, mix, prog} from '../lib/anim';
import {useScene} from './SceneContext';
import {textGlow} from './Glow';

export const TopLabel: React.FC<{text: string; delay?: number; exitAt?: number}> = ({text, delay = 0, exitAt}) => {
  const {t, dur, global} = useScene();
  const end = exitAt ?? dur - 12;
  const out = prog(t, end, 10, EASE.out);
  let accent = false;
  const chars: {c: string; accent: boolean}[] = [];
  for (const c of text) {
    if (c === '[') accent = true;
    else if (c === ']') accent = false;
    else chars.push({c, accent});
  }
  const spacing = mix(prog(t, delay, 30, EASE.in), 0.5, 0.35);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        width: SAFE.centerX * 2,
        top: VIDEO.height * TYPE.label.y,
        transform: `translateY(-50%) translateY(${mix(out, 0, -14) + drift(global, 1.5, 180)}px)`,
        textAlign: 'center',
        fontFamily: TYPE.family,
        fontWeight: TYPE.label.weight,
        fontSize: TYPE.label.size,
        letterSpacing: `${spacing}em`,
        paddingLeft: `${spacing}em`, // compensa el tracking final para centrar ópticamente
        whiteSpace: 'nowrap',
        opacity: 1 - out,
      }}
    >
      {chars.map((ch, i) => {
        const p = prog(t, delay + i * 1, TYPE_IN, EASE.in);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: p * (ch.accent ? 1 : TYPE.label.opacity),
              transform: `translateY(${mix(p, 10, 0)}px)`,
              color: ch.accent ? COLORS.accent : COLORS.white,
              textShadow: ch.accent ? textGlow(0.8, '200,16,46') : textGlow(0.25),
              whiteSpace: 'pre',
            }}
          >
            {ch.c}
          </span>
        );
      })}
    </div>
  );
};
const TYPE_IN = 16;
