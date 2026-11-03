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

/**
 * Duraciones sincronizadas con la voz (public/audio/voz.mp3, 52,5 s).
 * Cada escena arranca justo antes de su frase; los comentarios marcan el segundo
 * del audio donde empieza. Si se regraba la voz, ajustá estos cortes.
 */
export const SCENES = {
  hook: 105, //     0,0 s  "Alguien gana con tu sueldo… y no eres tú."
  sueldo: 96, //    3,5 s  "Día de pago. Tu cuenta, al cien por ciento."
  quien: 207, //    6,7 s  "Pero en pocos días se lo llevan… y llegas a cero."
  radar: 236, //   13,6 s  "Y está lo que no ves… pero todos los meses."
  plan: 159, //    21,45 s "Las empresas tienen un plan… Tú no."
  gente: 118, //   26,75 s "La mayoría ahorra cero. Muy pocos llegan al diez por ciento."
  piensan: 174, // 30,7 s  "Y esos pocos hacen algo distinto… lo que queda."
  mismo: 78, //    36,5 s  "Mismo sueldo. Solo cambia el orden."
  numeros: 240, // 39,1 s  "Pongamos números… pero tienes una base."
  curva: 110, //   47,1 s  "Si no le das un destino a tu dinero… alguien más se lo da."
  cierre: 135, //  50,75 s "Sígueme para aprender a hacerlo." (+ cola de música)
} as const;

/** Mezcla de audio (volúmenes lineales sobre archivos normalizados a -16 LUFS). */
export const AUDIO = {
  voice: 1,
  musicUnderVoice: 0.13, // ~ -18 dB debajo de la voz
  musicOutro: 0.38, // sube cuando termina la voz
  voiceEnd: Math.round(52.6 * 30), // frame donde termina la voz
  musicFadeIn: 12,
  musicFadeOut: 36,
};

export type SceneKey = keyof typeof SCENES;

export const TOTAL_FRAMES = Object.values(SCENES).reduce((a, b) => a + b, 0);

/** Beats internos de cada escena (frames relativos al inicio de la escena). */
export const BEATS = {
  hook: {
    // título palabra por palabra: "Alguien" ya está en el frame 0, el resto entra rápido
    titleWords: [0, 3, 6, 9, 12], // Alguien · gana · con · TU · SUELDO
    titleStep: 4, // frames entre palabras del remate
    subtitle: 68, // "y no eres tú." (voz 2,3 s)
  },
  sueldo: {
    title: 0,
    person: 6,
    fillStart: 14,
    fillEnd: 70, // "cien por ciento"
  },
  quien: {
    title: 0,
    bar: 4,
    firstBox: 62, // "suscripciones"
    boxGap: 26,
    drainDur: 16,
    zero: 170, // "y llegas a cero"
  },
  radar: {
    title: 0,
    person: 6,
    radar: 10,
    sweepStart: 43, // COMISIONES aparece con "comisiones"
    sweepSpeed: 3.5, // grados por frame
    text: 159, // "Pequeños…"
  },
  plan: {
    title: 0,
    companies: 6,
    person: 36,
    lines: 46,
    text1: 76, // "Saben cuánto vas a gastar"
    text2: 132, // "Tú no."
  },
  gente: {
    title: 0,
    axis: 2,
    dots: 4,
    dotGap: 0.5,
    crowdPill: 36, // "ahorra cero"
    you: 84, // "diez por ciento"
    text: 90,
  },
  piensan: {
    title: 0,
    ground: 2,
    people: 12, // "esos pocos"
    cobro: 70, // "cuando cobran"
    arrow1: 78,
    diamond: 84,
    no: 96,
    ahorra: 102, // "primero ahorran"
    ret: 114,
    si: 124,
    resto: 128, // "después gastan lo que queda"
    link: 140,
  },
  mismo: {
    title: 0,
    line: 2,
    people: 4,
    flows: 12,
    dimLeft: 44, // "solo cambia el orden"
  },
  numeros: {
    intro: 0, // "Pongamos números"
    introOut: 30,
    blocks: 36,
    yearsStart: 42, // "Ahorrando el diez por ciento…"
    yearsEnd: 150, // "…cuarenta y ocho mil"
    base: 200, // "pero tienes una base"
  },
  curva: {
    axes: 0,
    curveStart: 6,
    curveEnd: 80,
    text1: 4, // "Si no le das un destino…"
    text2: 72, // "alguien más se lo da"
  },
  cierre: {
    title: 4,
    pill: 12,
    typeStart: 24,
    typeSpeed: 3, // frames por letra
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
