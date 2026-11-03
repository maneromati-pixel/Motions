import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE_SINE, inOut, lerp, mixColor, p} from '../anim';
import {At, GoldText, Micro, Mono, PersonIcon} from '../components/primitives';
import {C, FONT, MONO_ADV, SAFE} from '../theme';
import {T} from '../timeline';
import {BAR} from './Instrument';

/**
 * 0–5 s HOOK  +  5–10 s LA CONDICIÓN.
 * La cifra del hook es visible al 100% desde el frame 0 (sin fade de entrada) y luego
 * se encoge y sube hasta convertirse en la microetiqueta de la escena 2.
 */
export const HookAndCondition: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  if (t > T.work + 1.2) return null;

  const cx = SAFE.cx;

  // ── Hook → microetiqueta ─────────────────────────────────────────
  const breathe = p(t, 0, T.cond, EASE_SINE); // empuje casi imperceptible
  const k1 = p(t, T.cond, 1.15);
  const k2 = p(t, T.cond + 0.08, 1.15); // "A LOS 65." arranca un pelín después
  const goalOut = p(t, T.work, 0.5); // se retira cuando arranca la escena central

  const numScale = lerp(1 + 0.012 * breathe, 0.34, k1);
  const numY = lerp(720, 316, k1) - 14 * goalOut;
  const subScale = lerp(1, 0.42, k2);
  const subY = lerp(846, 364, k2) - 14 * goalOut;
  const sheen = t >= T.sheen && t <= T.sheen + 1.3 ? (t - T.sheen) / 1.3 : -1;

  const titleOp = 1 - p(t, T.cond, 0.45);
  const subLine = inOut(t, T.hookSub, 0.6, T.cond, 0.45);
  const subLineY = 1000 + 14 * (1 - p(t, T.hookSub, 0.6)) + 18 * p(t, T.cond, 0.45);

  // ── Escena 2: persona + USD 200 / MES ───────────────────────────
  const iconDraw = p(t, T.cond + 0.7, 1.0);
  const iconOut = p(t, T.work, 0.45);
  const iconOp = (t < T.cond + 0.7 ? 0 : 1) * (1 - iconOut);
  const iconScale = 0.94 + 0.06 * p(t, T.cond + 0.7, 1.0) - 0.08 * iconOut;

  const amtIn = p(t, T.cond + 1.05, 0.8);
  const amtSize = 84;
  const ch = amtSize * (MONO_ADV - 0.02); // avance real con tracking −0.02em
  const full = 'USD 200 / MES';
  const left0 = cx - (full.length * ch) / 2;
  const usdCx = left0 + 3.5 * ch; // centro de "USD 200"
  const amtY0 = 864 + 24 * (1 - amtIn);

  // "USD 200" cae en la barra y se vuelve su primera astilla blanca
  const fall = p(t, T.work + 0.1, 0.7);
  const usdX = lerp(usdCx, BAR.x + 8, fall);
  const usdY = lerp(amtY0, BAR.y, fall);
  const usdScale = lerp(1, 0.16, fall);
  const usdOp = amtIn * (1 - p(t, T.work + 0.45, 0.35));
  const perOp = amtIn * (1 - p(t, T.work, 0.3));

  const desdeIn = p(t, T.cond + 1.4, 0.8);
  const desdeUp = p(t, T.work, 0.6);
  const desdeOp = desdeIn * (1 - p(t, T.work + 0.1, 0.4));

  return (
    <>
      {/* Título (portada) */}
      <At x={cx} y={520} tf={`translateY(${-20 * (1 - titleOp)}px)`} style={{opacity: titleOp}}>
        <Micro size={24} color={C.text2}>
          El millón empieza a los 20
        </Micro>
      </At>

      {/* USD 1.054.900 */}
      <At
        x={cx}
        y={numY}
        tf={`scale(${numScale})`}
        style={{opacity: 1 - goalOut, fontFamily: FONT.mono, fontWeight: 500, lineHeight: 1}}
      >
        <GoldText glow={lerp(1, 0.55, k1)} sheen={sheen}>
          <span style={{fontSize: 58, letterSpacing: '0.02em', marginRight: 22, verticalAlign: '0.62em'}}>USD</span>
          <span style={{fontSize: 128, letterSpacing: '-0.03em'}}>1.054.900</span>
        </GoldText>
      </At>

      {/* A LOS 65. */}
      <At
        x={cx}
        y={subY}
        tf={`scale(${subScale})`}
        style={{opacity: 1 - goalOut}}
      >
        <span
          style={{
            fontFamily: FONT.sans,
            fontWeight: 800,
            fontSize: 66,
            letterSpacing: '0.1em',
            paddingLeft: '0.1em',
            color: mixColor(C.text, C.text2, k2),
            lineHeight: 1,
          }}
        >
          A LOS 65.
        </span>
      </At>

      {/* Y SOLO PUSISTE 108.000. */}
      <At x={cx} y={subLineY} style={{opacity: subLine}}>
        <span style={{display: 'inline-flex', alignItems: 'baseline', gap: 18, color: C.text2}}>
          <span style={{fontFamily: FONT.sans, fontWeight: 600, fontSize: 36, letterSpacing: '0.14em'}}>
            Y SOLO PUSISTE
          </span>
          <Mono size={42} color={C.text2} weight={500}>
            108.000.
          </Mono>
        </span>
      </At>

      {/* Persona */}
      <At x={cx} y={650} tf={`scale(${iconScale})`} style={{opacity: iconOp}}>
        <PersonIcon height={190} draw={iconDraw} stroke={3} />
      </At>

      {/* USD 200 */}
      <At x={usdX} y={usdY} tf={`scale(${usdScale})`} style={{opacity: usdOp}}>
        <Mono size={amtSize}>USD 200</Mono>
      </At>
      {/* / MES */}
      <At x={left0 + 8 * ch} y={amtY0} ax={0} style={{opacity: perOp}}>
        <Mono size={amtSize} color={C.text}>
          {'/ MES'}
        </Mono>
      </At>

      {/* DESDE LOS 20 → sube a la cabecera */}
      <At x={cx} y={lerp(962 + 16 * (1 - desdeIn), 330, desdeUp)} style={{opacity: desdeOp}}>
        <Micro size={24} color={C.text2}>
          Desde los 20
        </Micro>
      </At>
    </>
  );
};
