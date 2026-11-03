import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE, inOut, lerp, money, p} from '../anim';
import {At, GoldText, Headline, Micro, Mono} from '../components/primitives';
import {contributedAtAge, DATA, totalAtAge} from '../data';
import {C, SAFE} from '../theme';
import {T} from '../timeline';

/** Geometría compartida de la barra (la usa también la escena 2 para la caída del "USD 200"). */
export const BAR = {x: SAFE.left, y: 800, w: SAFE.width, h: 44, r: 6} as const;

const K = BAR.w / DATA.totalAt65; // px por dólar (escala honesta, lineal)

/** Edad continua según el reloj: cuenta con easing y se detiene en cada checkpoint. */
const ageAt = (t: number) => {
  const cps = DATA.checkpoints;
  let age: number = cps[0].age;
  T.segs.forEach(([s, e], i) => {
    if (t >= s) age = lerp(cps[i].age, cps[i + 1].age, p(t, s, e - s, EASE));
  });
  return age;
};

/**
 * 10–26 s EL TIEMPO TRABAJANDO  +  26–32 s QUIÉN LO HIZO.
 * Una sola barra apilada: blanco = lo que pusiste, dorado = lo que hizo el interés.
 * En el split, la barra final se agranda y se separa en dos bloques.
 */
export const Instrument: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  if (t < T.work || t >= T.cut) return null; // el corte de T.cut es seco, a propósito

  const W = T.work;
  const S = T.split;

  const age = ageAt(t);
  const total = Math.round(totalAtAge(age) / 100) * 100;
  const contrib = Math.round(contributedAtAge(age) / 100) * 100;
  const interest = Math.max(0, total - contrib);

  // ── entradas escena central (superpuestas, nunca en el mismo frame)
  const headerOp = inOut(t, W + 0.25, 0.6, S, 0.45);
  const labelsOp = inOut(t, W + 0.45, 0.7, S + 0.05, 0.45);
  const valuesOp = inOut(t, W + 0.55, 0.7, S + 0.1, 0.45);
  const valuesUp = 14 * p(t, S + 0.1, 0.45);
  const trackDraw = p(t, W + 0.6, 0.9);
  const trackOp = 1 - p(t, S + 0.1, 0.5);
  const seed = p(t, W + 0.55, 0.4);
  const row1 = inOut(t, W + 0.85, 0.7, S, 0.4);
  const row2 = inOut(t, W + 1.0, 0.7, S + 0.06, 0.4);
  const rowsDown = 16 * p(t, S, 0.45);

  // ── split
  const ks = p(t, S + 0.2, 1.15);
  const kg = p(t, S + 0.35, 1.0);
  const barY = lerp(BAR.y, 905, ks);
  const barH = lerp(BAR.h, 300, ks);
  const gap = lerp(0, 22, kg);
  const radius = lerp(BAR.r, 14, ks);

  const whiteW = Math.max(10 * seed, contrib * K);
  const goldW = Math.max(0, interest * K - gap);
  const goldX = BAR.x + whiteW + gap;

  const vosIn = p(t, T.splitVos, 0.8);
  const intIn = p(t, T.splitInt, 0.9);
  const vosCount = p(t, T.splitVos, 0.9);
  const intCount = p(t, T.splitInt, 1.1);
  const soloIn = p(t, T.splitSolo, 0.9);

  const header = (
    <span style={{display: 'inline-flex', alignItems: 'center', gap: 22}}>
      <Mono size={26} color={C.text} weight={500}>
        USD 200 / MES
      </Mono>
      <Micro size={22} color={C.text2} align="left">
        · Desde los 20
      </Micro>
    </span>
  );

  return (
    <>
      <At x={SAFE.cx} y={330} tf={`translateY(${8 * (1 - headerOp)}px)`} style={{opacity: headerOp}}>
        {header}
      </At>

      {/* TOTAL / EDAD */}
      <At x={BAR.x} y={498} ax={0} style={{opacity: labelsOp}}>
        <Micro align="left">Total</Micro>
      </At>
      <At x={BAR.x + BAR.w} y={498} ax={1} style={{opacity: labelsOp}}>
        <Micro align="right">Edad</Micro>
      </At>
      <At x={BAR.x - 4} y={590 - valuesUp} ax={0} style={{opacity: valuesOp}}>
        <Mono size={100}>{money(total)}</Mono>
      </At>
      <At x={BAR.x + BAR.w + 4} y={590 - valuesUp} ax={1} style={{opacity: valuesOp}}>
        <Mono size={100} color={C.text}>
          {Math.floor(age + 0.02)}
        </Mono>
      </At>

      {/* Pista */}
      <div
        style={{
          position: 'absolute',
          left: BAR.x,
          top: BAR.y - BAR.h / 2,
          width: BAR.w,
          height: BAR.h,
          borderRadius: BAR.r,
          boxShadow: `inset 0 0 0 1.5px ${C.off}`,
          transform: `scaleX(${trackDraw})`,
          transformOrigin: '0% 50%',
          opacity: trackOp,
        }}
      />

      {/* Barra apilada (luego bloques separados) */}
      <div
        style={{
          position: 'absolute',
          left: BAR.x,
          top: barY - barH / 2,
          width: whiteW,
          height: barH,
          background: C.mine,
          borderRadius: `${radius}px ${gap > 0.5 ? radius : 0}px ${gap > 0.5 ? radius : 0}px ${radius}px`,
          opacity: seed,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: goldX,
          top: barY - barH / 2,
          width: goldW,
          height: barH,
          background: `linear-gradient(180deg, ${C.goldHi} 0%, ${C.gold} 45%, ${C.goldDeep} 140%)`,
          borderRadius: `${gap > 0.5 ? radius : 0}px ${radius}px ${radius}px ${gap > 0.5 ? radius : 0}px`,
          boxShadow: `0 0 ${lerp(14, 60, ks)}px rgba(${C.glow},${lerp(0.22, 0.28, ks) * C.glowAmt})`,
        }}
      />

      {/* Marcas de edad: el espaciado creciente ES la exponencial */}
      {DATA.checkpoints.slice(1).map((cp, i) => {
        const at = T.segs[i][1] - 0.35;
        const op = inOut(t, at, 0.5, S, 0.4);
        const x = BAR.x + cp.total * K;
        const last = i === DATA.checkpoints.length - 2;
        return (
          <React.Fragment key={cp.age}>
            <div
              style={{
                position: 'absolute',
                left: x - 0.75,
                top: BAR.y + BAR.h / 2 + 10,
                width: 1.5,
                height: 14,
                background: C.text2,
                opacity: op,
              }}
            />
            <At x={last ? x + 1 : x} y={BAR.y + BAR.h / 2 + 46} ax={last ? 1 : 0.5} style={{opacity: op}}>
              <Mono size={20} color={C.text2} weight={400}>
                {cp.age}
              </Mono>
            </At>
          </React.Fragment>
        );
      })}

      {/* Leyenda */}
      {[
        {y: 980, op: row1, label: 'Lo que pusiste', value: contrib, gold: false},
        {y: 1060, op: row2, label: 'Lo que hizo el interés', value: interest, gold: true},
      ].map((r) => (
        <React.Fragment key={r.label}>
          <div
            style={{
              position: 'absolute',
              left: BAR.x,
              top: r.y + rowsDown - 7,
              width: 14,
              height: 14,
              borderRadius: 3,
              background: r.gold ? C.gold : C.mine,
              opacity: r.op,
            }}
          />
          <At x={BAR.x + 32} y={r.y + rowsDown} ax={0} style={{opacity: r.op}}>
            <Micro align="left" size={21} tracking={0.24}>
              {r.label}
            </Micro>
          </At>
          <At x={BAR.x + BAR.w + 2} y={r.y + rowsDown} ax={1} style={{opacity: r.op}}>
            {r.gold ? (
              <Mono size={44}>
                <GoldText glow={0.5}>{money(r.value)}</GoldText>
              </Mono>
            ) : (
              <Mono size={44} color={C.mine}>{money(r.value)}</Mono>
            )}
          </At>
        </React.Fragment>
      ))}

      {/* ── Split: VOS · $108K  /  INTERÉS · $947K */}
      <At x={BAR.x} y={664 + 12 * (1 - vosIn)} ax={0} style={{opacity: vosIn}}>
        <Micro align="left">Vos</Micro>
      </At>
      <At x={BAR.x - 3} y={714 + 12 * (1 - vosIn)} ax={0} style={{opacity: vosIn}}>
        <Mono size={60} color={C.mine}>{`$${Math.round((DATA.contributedAt65 / 1000) * vosCount)}K`}</Mono>
      </At>
      <At x={BAR.x + BAR.w} y={536 + 14 * (1 - intIn)} ax={1} style={{opacity: intIn}}>
        <Micro align="right">Interés</Micro>
      </At>
      <At x={BAR.x + BAR.w + 6} y={652 + 14 * (1 - intIn)} ax={1} style={{opacity: intIn}}>
        <Mono size={168} weight={500}>
          <GoldText glow={0.9}>{`$${Math.round((DATA.interestAt65 / 1000) * intCount)}K`}</GoldText>
        </Mono>
      </At>
      <At x={SAFE.cx} y={1160 + 16 * (1 - soloIn)} style={{opacity: soloIn}}>
        <Headline size={46} tracking={0.1}>
          Tu plata trabajó sola.
        </Headline>
      </At>
    </>
  );
};
