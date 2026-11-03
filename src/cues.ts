import type {Caption} from '@remotion/captions';

// Sincronización: cada escena empieza cuando Whisper detecta su frase en voz.mp3.
// Si una frase no se encuentra, se usa un tiempo de respaldo proporcional.

export const normalize = (s: string): string =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/(\d)[.,\s'](?=\d{3}(\D|$))/g, '$1')
    .replace(/[^a-z0-9%]/g, '');

type Word = {norm: string; startMs: number; endMs: number};

const toWords = (captions: Caption[]): Word[] =>
  captions
    .flatMap((c) => {
      // Whisper a veces junta varias palabras en un token: las repartimos.
      const parts = c.text.trim().split(/\s+/).filter(Boolean);
      const d = (c.endMs - c.startMs) / Math.max(1, parts.length);
      return parts.map((p, i) => ({norm: normalize(p), startMs: c.startMs + i * d, endMs: c.startMs + (i + 1) * d}));
    })
    .filter((w) => w.norm.length > 0);

const find = (words: Word[], alts: string[], afterMs: number): Word | null => {
  for (let i = 0; i < words.length; i++) {
    if (words[i].startMs < afterMs) continue;
    for (const alt of alts) {
      const seq = alt.split(' ').map(normalize);
      if (seq.every((t, k) => words[i + k]?.norm === t)) return words[i];
    }
  }
  return null;
};

export type SceneTiming = {start: number; end: number; cues: Record<string, number>}; // frames absolutos
export type Timeline = SceneTiming[];

type SceneDef = {
  alts: string[];
  fallback: number; // fracción del total
  cues?: Record<string, {alts: string[]; fallback: number}>; // fallback: fracción de la escena
};

// 12 escenas, en orden.
const SCENES: SceneDef[] = [
  {alts: [], fallback: 0},
  {
    alts: ['la diferencia no', 'no es cuanto', 'la diferencia'],
    fallback: 0.07,
    cues: {esCuando: {alts: ['es cuando', 'sino cuando'], fallback: 0.5}},
  },
  {
    alts: ['la primera', 'una empieza', 'la persona a'],
    fallback: 0.14,
    cues: {box: {alts: ['100', 'cien', 'ahorra'], fallback: 0.5}},
  },
  {
    alts: ['la segunda', 'la otra', 'la persona b'],
    fallback: 0.21,
    cues: {
      cuandoGane: {alts: ['cuando gane', 'empezare'], fallback: 0.3},
      strike: {alts: ['35', 'treinta y cinco', 'y empieza'], fallback: 0.7},
    },
  },
  {alts: ['diez anos de', '10 anos de', 'diez anos', '10 anos'], fallback: 0.29},
  {
    alts: ['ponle numeros', 'ahora ponle', 'pongamos numeros', 'ahora'],
    fallback: 0.33,
    cues: {
      grow: {alts: ['8%', '8 %', 'ocho por ciento', '8 por ciento'], fallback: 0.15},
      b: {alts: ['149000', '149 mil', 'ciento cuarenta y nueve'], fallback: 0.7},
      a: {alts: ['349000', '349 mil', 'trescientos cuarenta y nueve'], fallback: 0.85},
    },
  },
  {
    alts: ['aporto apenas', 'aporto', 'puso apenas'],
    fallback: 0.47,
    cues: {termino: {alts: ['y termino', 'termino'], fallback: 0.5}},
  },
  {
    alts: ['eso es el interes', 'eso es', 'interes compuesto'],
    fallback: 0.54,
  },
  {
    alts: ['es como una bola', 'como una bola', 'bola de nieve'],
    fallback: 0.62,
    cues: {curve: {alts: ['al principio', 'despues', 'cada vez'], fallback: 0.45}},
  },
  {
    alts: ['la regla del', 'regla del'],
    fallback: 0.71,
    cues: {
      div: {alts: ['divides', 'divide', 'entre'], fallback: 0.25},
      pct: {alts: ['8%', '8 %', 'ocho', '8'], fallback: 0.45},
      result: {alts: ['duplica', 'nueve anos', '9 anos'], fallback: 0.65},
    },
  },
  {
    alts: ['el mejor momento', 'mejor momento'],
    fallback: 0.83,
    cues: {hoy: {alts: ['es hoy', 'hoy'], fallback: 0.6}},
  },
  {alts: ['sigueme', 'siguenos', 'sigue me'], fallback: 0.95},
];

export const SCENE_COUNT = SCENES.length;

export const buildTimeline = (captions: Caption[], durationInFrames: number, fps: number): Timeline => {
  const words = toWords(captions);
  const totalMs = (durationInFrames / fps) * 1000;
  const toF = (ms: number) => Math.round((ms / 1000) * fps);

  const startsMs: number[] = [];
  let after = 0;
  SCENES.forEach((s, i) => {
    if (i === 0) {
      startsMs.push(0);
      return;
    }
    const hit = find(words, s.alts, after);
    // Si no aparece o rompe el orden, usa el respaldo (sin quedar antes de la anterior).
    let ms = hit ? hit.startMs - 120 : s.fallback * totalMs;
    ms = Math.max(ms, startsMs[i - 1] + 1000);
    startsMs.push(ms);
    after = ms + 200;
  });
  // El cierre dura al menos 3 s.
  startsMs[startsMs.length - 1] = Math.min(startsMs[startsMs.length - 1], totalMs - 3000);

  // Cada momento clave necesita tiempo en pantalla: si cae justo al final de su escena,
  // la escena siguiente se retrasa (sin dejarla con menos de ~2 s).
  SCENES.forEach((s, i) => {
    if (i === SCENES.length - 1) return;
    let lastCue = -Infinity;
    for (const c of Object.values(s.cues ?? {})) {
      const hit = find(words, c.alts, startsMs[i] + 150);
      if (hit && hit.startMs < startsMs[i + 1]) lastCue = Math.max(lastCue, hit.startMs);
    }
    const limit = i + 2 < startsMs.length ? startsMs[i + 2] - 2000 : totalMs - 2200;
    const wanted = lastCue + 1200;
    if (wanted > startsMs[i + 1]) startsMs[i + 1] = Math.max(startsMs[i + 1], Math.min(wanted, limit));
  });

  return SCENES.map((s, i) => {
    const start = toF(startsMs[i]);
    const end = i === SCENES.length - 1 ? durationInFrames : toF(startsMs[i + 1]);
    const cues: Record<string, number> = {};
    for (const [k, c] of Object.entries(s.cues ?? {})) {
      const hit = find(words, c.alts, startsMs[i] + 150);
      const f = hit && toF(hit.startMs) < end ? toF(hit.startMs) : start + Math.round((end - start) * c.fallback);
      cues[k] = f - start; // relativo a la escena
    }
    return {start, end, cues};
  });
};
