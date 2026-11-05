/**
 * Subtítulos cinéticos palabra por palabra, sincronizados con WORDS (timings.ts).
 *  - Cada palabra aparece cuando la voz la dice (nunca antes): opacidad 0→1 + subida 6px.
 *  - La palabra clave va en blanco puro, más peso y glow; el resto al 75%.
 *  - Al entrar el chunk siguiente, el anterior sale hacia arriba con fade
 *    (2–3 frames de superposición con la primera palabra nueva).
 *  - 44px semibold, y ≈ 62%, máx. 2 líneas.
 */
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS, DUR, EASE, SAFE, TYPE, VIDEO} from '../theme';
import {SCRIPT, WORDS, f, chunkWords, SCENES} from '../timings';
import {mix, prog} from '../lib/anim';
import {textGlow} from './Glow';
import {BIGS} from './BigWord';

const OVERLAP = 3;

const chunkTimes = SCRIPT.map((_, ci) => {
  const ws = chunkWords(ci);
  const start = f(ws[0].start);
  const next = ci + 1 < SCRIPT.length ? f(chunkWords(ci + 1)[0].start) : null;
  // el último chunk se queda hasta el final de su escena (frase final + 2 s)
  const lastSceneEnd = SCENES[SCENES.length - 2].end;
  const exitStart = next !== null ? next - DUR.captionOut + OVERLAP : lastSceneEnd - DUR.captionOut;
  return {start, exitStart};
});

export const KineticCaption: React.FC = () => {
  const frame = useCurrentFrame();
  const active = chunkTimes
    .map((c, ci) => ({...c, ci}))
    .filter((c) => frame >= c.start - 1 && frame < c.exitStart + DUR.captionOut);

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {active.map(({ci, exitStart}) => {
        const out = prog(frame, exitStart, DUR.captionOut, EASE.out);
        const ws = WORDS.filter((w) => w.chunk === ci);
        const isBig = BIGS.some((b) => b.at === f(ws.find((w) => w.key)?.start ?? -1));
        return (
          <div
            key={ci}
            style={{
              position: 'absolute',
              left: SAFE.centerX - TYPE.caption.maxWidth / 2,
              width: TYPE.caption.maxWidth,
              top: VIDEO.height * TYPE.caption.y,
              transform: `translateY(-50%) translateY(${mix(out, 0, -10)}px)`,
              opacity: 1 - out,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              columnGap: '0.26em',
              rowGap: 6,
              fontFamily: TYPE.family,
              fontSize: TYPE.caption.size,
              lineHeight: 1.22,
              textAlign: 'center',
            }}
          >
            {ws.map((w, i) => {
              const s = f(w.start);
              const p = prog(frame, s, DUR.wordRise, EASE.in);
              // la palabra clave se "enciende" un poco después de aparecer
              const glow = w.key ? prog(frame, s + 3, 12, EASE.in) : 0;
              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    opacity: p * (w.key ? 1 : TYPE.caption.restOpacity),
                    transform: `translateY(${mix(p, 6, 0)}px)`,
                    fontWeight: w.key ? 800 : TYPE.caption.weight,
                    color: COLORS.white,
                    textShadow: textGlow(glow * (isBig ? 0.5 : 0.9)),
                  }}
                >
                  {w.text}
                </span>
              );
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
