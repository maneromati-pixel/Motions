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
  hook: 120, //      0–4 s   gancho (texto visible desde el frame 0)
  sueldo: 120, //    4–8 s   tu sueldo
  quien: 210, //     8–15 s  quién se lo lleva
  radar: 180, //    15–21 s  lo que no ves (nueva)
  plan: 180, //     21–27 s  ellos planean tu dinero
  gente: 150, //    27–32 s  cuánto ahorra la gente (nueva)
  piensan: 180, //  32–38 s  lo que hacen pocos: diagrama de decisión (nueva)
  mismo: 120, //    38–42 s  mismo sueldo
  numeros: 270, //  42–51 s  pongamos números: escalera (nueva)
  curva: 150, //    51–56 s  curva
  cierre: 120, //   56–60 s  sígueme
} as const;

export type SceneKey = keyof typeof SCENES;

export const TOTAL_FRAMES = Object.values(SCENES).reduce((a, b) => a + b, 0);

/** Beats internos de cada escena (frames relativos al inicio de la escena). */
export const BEATS = {
  hook: {
    subtitle: 45, // "Y NO ERES TÚ" a los 1,5 s
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
    firstBox: 22,
    boxGap: 30, // cada caja + su tramo de barra
    drainDur: 18,
    zero: 150,
  },
  radar: {
    title: 0,
    person: 6,
    radar: 10,
    sweepStart: 20,
    sweepSpeed: 4.2, // grados por frame
    text: 120,
  },
  plan: {
    title: 0,
    companies: 10,
    person: 40,
    lines: 56,
    text1: 76,
    text2: 126,
  },
  gente: {
    title: 0,
    axis: 6,
    dots: 18,
    dotGap: 1.3,
    crowdPill: 78,
    you: 96,
    text: 108,
  },
  piensan: {
    title: 0,
    ground: 4,
    cobro: 10,
    arrow1: 22,
    diamond: 30,
    no: 50,
    ahorra: 56,
    ret: 70,
    si: 84,
    resto: 92,
    people: 104,
    link: 120,
  },
  mismo: {
    title: 0,
    line: 6,
    people: 10,
    flows: 22,
    dimLeft: 72,
  },
  numeros: {
    intro: 0,
    introOut: 48,
    blocks: 56,
    yearsStart: 66,
    yearsEnd: 220,
    base: 228,
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
