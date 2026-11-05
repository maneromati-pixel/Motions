/**
 * Escena 3 — "7 RESPIRACIONES": siete círculos se completan uno a uno al ritmo
 * de una respiración (inhalar = expandir, exhalar = contraer). Contador 1→7 y
 * un anillo grande que respira detrás del número. Tick sonoro en cada círculo.
 * Salida: el círculo 7 viaja y se convierte en la tsuba (guarda) de la katana.
 */
import React from 'react';
import {Camera, Stage} from '../components/Camera';
import {LineDraw} from '../components/LineDraw';
import {TopLabel} from '../components/TopLabel';
import {BigNumber} from '../components/BigNumber';
import {useScene} from '../components/SceneContext';
import {drawGlow, mix, prog, settle} from '../lib/anim';
import {BREATHS, BREATH_LEN} from '../timings';
import {EASE} from '../theme';

const ROW_Y = 990;
const GAP = 108;
const R = 36;
export const CIRCLE_X = (i: number) => 520 + (i - 3) * GAP;
/** posición de la tsuba en la escena 4 (destino del morph) */
export const TSUBA = {x: 330, y: 960, r: 30};

const circle = (x: number, y: number, r: number) =>
  `M ${x} ${y - r} A ${r} ${r} 0 1 1 ${x - 0.01} ${y - r}`;

export const S03Breaths: React.FC = () => {
  const {t, dur, L} = useScene();
  const breaths = BREATHS.map(L);
  const current = breaths.filter((b) => t >= b).length; // 0..7
  const exit = prog(t, dur - 10, 12, EASE.out);

  // respiración actual: 0→1→0 (inhala, exhala)
  const bi = Math.max(0, current - 1);
  const bp = current === 0 ? 0 : Math.min(1, (t - breaths[bi]) / BREATH_LEN);
  const inhale = Math.sin(Math.PI * Math.min(1, bp));

  // morph del círculo 7 hacia la tsuba
  const m = prog(t, dur - 6, 16, EASE.stroke);

  return (
    <Camera
      art={
        <Stage>
          {/* anillo que respira alrededor del contador */}
          <g opacity={(1 - exit) * prog(t, -4, 14, EASE.in)}>
            <LineDraw
              d={circle(520, 700, 150 + inhale * 22)}
              p={prog(t, -6, 22, EASE.stroke)}
              g={0.4 + inhale * 0.6}
              width={2}
              opacity={0.35 + inhale * 0.25}
            />
          </g>
          {Array.from({length: 7}, (_, i) => {
            const x = CIRCLE_X(i);
            const b = breaths[i];
            const ghostIn = prog(t, -8 + i * 3, 14, EASE.in);
            const lt = t - b;
            const draw = prog(lt, 0, BREATH_LEN * 0.9, EASE.stroke);
            const glow = prog(lt, 5, 14, EASE.in);
            const breath = lt >= 0 && lt < BREATH_LEN ? Math.sin((Math.PI * lt) / BREATH_LEN) : 0;
            const pop = lt >= 0 ? settle(lt, 0) : 0;
            const isLast = i === 6;
            const fade = isLast ? 0 : exit;
            const x2 = isLast ? mix(m, x, TSUBA.x) : x;
            const y2 = isLast ? mix(m, ROW_Y, TSUBA.y) - Math.sin(m * Math.PI) * 120 : ROW_Y;
            const r2 = (isLast ? mix(m, R, TSUBA.r) : R) * (1 + breath * 0.18) * mix(Math.min(1, pop), 0.9, 1);
            return (
              <g key={i} opacity={1 - fade}>
                {/* círculo guía punteado */}
                <circle cx={x} cy={ROW_Y} r={R} fill="none" stroke="#fff" strokeOpacity={0.22 * ghostIn * (1 - draw)} strokeWidth={2} strokeDasharray="2 9" strokeLinecap="round" />
                <LineDraw d={circle(x2, y2, r2)} p={draw} g={glow * (0.8 + breath * 0.6)} />
              </g>
            );
          })}
        </Stage>
      }
      text={
        <>
          <TopLabel text="7 RESPIRACIONES" delay={-8} />
          {current > 0 && (
            <div style={{opacity: 1 - exit}}>
              {/* número anterior saliendo hacia arriba + número nuevo entrando */}
              {current > 1 && (
                <BigNumber
                  key={`p${current}`}
                  value={String(current - 1)}
                  label="RESPIRACIONES"
                  hideLabel
                  x={520}
                  y={700}
                  t={t - breaths[current - 2]}
                  exit={breaths[current - 1] - breaths[current - 2] - 1}
                />
              )}
              <BigNumber
                key={`c${current}`}
                value={String(current)}
                label="RESPIRACIONES"
                x={520}
                y={700}
                t={t - breaths[current - 1]}
                labelT={t - breaths[0]}
              />
            </div>
          )}
        </>
      }
    />
  );
};
