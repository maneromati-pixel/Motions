/**
 * ÚNICA fuente de verdad del ritmo del video.
 * Todo está en frames a 30 fps. Para ajustar al locutor, cambiá estos números:
 * las escenas se encadenan solas a partir de SCENES.
 */
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** Fade a negro al final de cada escena (frames). */
export const SCENE_FADE = 6;
/** Duración estándar de una entrada (fade + subida). */
export const ENTER = 12;
/** Escalonado entre elementos de una lista. */
export const STAGGER = 7;

export const SCENES = {
  hook: 120, //       0–4 s
  sueldo: 120, //     4–8 s
  quien: 240, //      8–16 s
  plan: 210, //      16–23 s
  vaso: 150, //      23–28 s
  pocos: 180, //     28–34 s
  mismo: 150, //     34–39 s
  numeros: 300, //   39–49 s
  curva: 150, //     49–54 s
  cierre: 120, //    54–58 s
} as const;

export type SceneKey = keyof typeof SCENES;

export const TOTAL_FRAMES = Object.values(SCENES).reduce((a, b) => a + b, 0);

/** Beats internos de cada escena (frames relativos al inicio de la escena). */
export const BEATS = {
  hook: {
    subtitle: 45, // "Y NO SOS VOS" a los 1,5 s
    twinklePeriod: 18,
  },
  sueldo: {
    title: 0,
    person: 8,
    fillStart: 22,
    fillEnd: 85,
  },
  quien: {
    title: 0,
    bar: 4,
    firstBox: 24,
    boxGap: 34, // cada caja + su tramo de barra
    drainDur: 18,
    zero: 170,
  },
  plan: {
    title: 0,
    companies: 12,
    person: 40,
    lines: 60,
    text1: 80,
    text2: 140,
  },
  vaso: {
    title: 0,
    glass: 6,
    firstCoin: 14,
    coinGap: 1.15, // frames entre monedas (puede ser fraccional)
    overflowGap: 3,
  },
  pocos: {
    title: 0,
    cobro: 12,
    arrow1: 28,
    ahorro: 38,
    arrow2: 70,
    gastos: 82,
  },
  mismo: {
    title: 0,
    line: 8,
    people: 14,
    flows: 30,
    dimLeft: 95,
  },
  numeros: {
    intro: 0,
    introOut: 52,
    blocks: 62,
    yearsStart: 78,
    yearsEnd: 240,
    base: 252,
  },
  curva: {
    axes: 4,
    curveStart: 18,
    curveEnd: 95,
    text1: 60,
    text2: 92,
  },
  cierre: {
    title: 6,
    pill: 16,
    typeStart: 34,
    typeSpeed: 4, // frames por letra
  },
} as const;

/** Frame de inicio de cada escena dentro del video completo. */
export const sceneStart = (key: SceneKey): number => {
  let acc = 0;
  for (const k of Object.keys(SCENES) as SceneKey[]) {
    if (k === key) return acc;
    acc += SCENES[k];
  }
  return acc;
};
