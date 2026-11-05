/**
 * Contexto de escena: cada escena vive en una <Sequence> que arranca PRE frames
 * antes del corte (para transiciones con solape). useScene() devuelve:
 *  - t: frame local relativo al corte (negativo durante el pre-roll)
 *  - dur: duración de la escena (de corte a corte)
 *  - L(globalFrame): convierte un cue global de timings.ts a frame local
 */
import React, {createContext, useContext} from 'react';
import {useCurrentFrame} from 'remotion';
import type {SceneTiming} from '../timings';

export const PRE = 12;
export const POST = 12;

const Ctx = createContext<SceneTiming | null>(null);

export const SceneProvider: React.FC<{scene: SceneTiming; children: React.ReactNode}> = ({scene, children}) => (
  <Ctx.Provider value={scene}>{children}</Ctx.Provider>
);

export const useScene = () => {
  const s = useContext(Ctx);
  const frame = useCurrentFrame();
  if (!s) throw new Error('useScene fuera de una escena');
  const t = frame - PRE;
  return {
    t,
    dur: s.end - s.start,
    start: s.start,
    global: s.start + t,
    L: (g: number) => g - s.start,
  };
};
