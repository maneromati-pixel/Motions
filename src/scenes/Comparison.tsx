import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {inOut, money, p} from '../anim';
import {At, GoldText, Headline, Micro, Mono, PersonIcon} from '../components/primitives';
import {DATA} from '../data';
import {C} from '../theme';
import {T} from '../timeline';

/** Geometría del piso compartido: esta línea se convierte en el eje TIEMPO del gráfico. */
export const GROUND = {x1: 130, x2: 890, y: 820} as const;

/**
 * 32–41 s EL COSTO DE ESPERAR. Entra con corte seco (deliberado, sobre el beat).
 * Dos personas sobre la misma línea, mismo aporte, diez años de diferencia.
 */
export const Comparison: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const X = T.cut;
  const OUT = T.valley;
  if (t < X || t > OUT + 1.2) return null;

  const L = 300;
  const R = 720;

  // Salida escalonada hacia abajo: la línea queda sola y se vuelve eje.
  const out = (d: number) => p(t, OUT + d, 0.5);
  const drop = (d: number) => 22 * out(d);

  const aporteL = inOut(t, T.cmpAporte, 0.6);
  const aporteR = inOut(t, T.cmpAporte + 0.08, 0.6);
  const resL = p(t, T.cmpResult, 0.6);
  const resR = p(t, T.cmpResult + 0.25, 0.6);
  const cntL = p(t, T.cmpResult, 1.3);
  const cntR = p(t, T.cmpResult + 0.25, 1.3);
  const esperaIn = p(t, T.cmpEspera, 0.8);
  const costIn = p(t, T.cmpEspera + 0.15, 0.9);

  const col = (x: number, d: number, children: React.ReactNode, y: number, op: number, rise = 0) => (
    <At x={x} y={y + rise + drop(d)} style={{opacity: op * (1 - out(d))}}>
      {children}
    </At>
  );

  return (
    <>
      {/* Etiquetas: presentes en el corte */}
      {col(L, 0, <Micro color={C.text} size={22} tracking={0.24}>Empezó a los 20</Micro>, 598, 1)}
      {col(R, 0.04, <Micro color={C.text2} size={22} tracking={0.24}>Empezó a los 30</Micro>, 598, 1)}

      {/* Personas paradas sobre el piso */}
      <At x={L} y={GROUND.y - 4} ay={1} tf={`translateY(${drop(0.08)}px)`} style={{opacity: 1 - out(0.08)}}>
        <PersonIcon height={170} color={C.text} />
      </At>
      <At x={R} y={GROUND.y - 4} ay={1} tf={`translateY(${drop(0.12)}px)`} style={{opacity: 1 - out(0.12)}}>
        <PersonIcon height={170} color={C.text2} />
      </At>

      {/* Mismo aporte */}
      {col(L, 0.14, <Mono size={30} color={C.text}>USD 200 / MES</Mono>, 880, aporteL, 10 * (1 - aporteL))}
      {col(R, 0.18, <Mono size={30} color={C.text}>USD 200 / MES</Mono>, 880, aporteR, 10 * (1 - aporteR))}

      {/* Resultado a los 65 */}
      {col(L, 0.2, <Micro size={18}>A los 65</Micro>, 962, resL, 10 * (1 - resL))}
      {col(R, 0.24, <Micro size={18}>A los 65</Micro>, 962, resR, 10 * (1 - resR))}
      {col(
        L,
        0.24,
        <Mono size={56}>
          <GoldText glow={0.8}>{money(Math.round((DATA.totalAt65 * cntL) / 100) * 100)}</GoldText>
        </Mono>,
        1024,
        resL,
        10 * (1 - resL),
      )}
      {col(
        R,
        0.28,
        <Mono size={56} color={C.text2}>
          {money(Math.round((DATA.lateStarter.totalAt65 * cntR) / 100) * 100)}
        </Mono>,
        1024,
        resR,
        10 * (1 - resR),
      )}

      {/* El costo */}
      {col(510, 0.3, <Headline size={34} tracking={0.14}>10 años de espera</Headline>, 1168, esperaIn, 12 * (1 - esperaIn))}
      {col(
        510,
        0.34,
        <Mono size={82} weight={500}>{`= ${'−'}${money(DATA.waitCost)}`}</Mono>,
        1254,
        costIn,
        12 * (1 - costIn),
      )}
    </>
  );
};
