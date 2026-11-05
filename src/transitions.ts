import type {SceneId} from './timings';

/**
 * Transición de SALIDA de cada escena (hacia la siguiente):
 *  - morph:  las escenas resuelven la forma compartida (círculo→tsuba, espiral→flecha…)
 *  - whip:   paneo vertical rápido con motion blur direccional
 *  - sweep:  un trazo de luz cruza la pantalla y arrastra la escena nueva
 *  - cut:    corte seco (BLACK_CUTS agrega negro + golpe grave)
 *  - dissolve: solo para el viraje de color final
 */
export type TransitionKind = 'morph' | 'whip' | 'sweep' | 'cut' | 'dissolve';
export const TRANSITIONS: Partial<Record<SceneId, TransitionKind>> = {
  hook: 'whip',
  hagakure: 'sweep',
  breaths: 'morph',
  warrior: 'morph',
  calm: 'whip',
  spiral: 'morph',
  arrow: 'whip',
  prepared: 'sweep',
  lightness: 'whip',
  hiding: 'cut',
  face: 'cut',
  life: 'morph',
  luck: 'whip',
  prudence: 'cut',
  prudent: 'dissolve',
};

