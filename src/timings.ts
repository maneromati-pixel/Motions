/**
 * timings.ts — TODOS los tiempos del video viven acá.
 *
 * Cómo funciona:
 *  1. SCRIPT es el guion dividido en "chunks" de subtítulo (máx. 2 líneas).
 *     - *palabra* marca la palabra clave del chunk (blanco puro + glow).
 *     - `big` hace saltar esa palabra clave a tamaño grande en el centro.
 *     - `scene` indica en qué escena arranca ese chunk (el corte cae en la pausa previa).
 *  2. Si existe una voz analizada (src/voice.generated.ts, creada por
 *     `npm run analyze-voice`), se usan sus tiempos reales por palabra.
 *     Si no, se estima a WORDS_PER_SECOND con duración proporcional a las sílabas
 *     y pausas en comas / puntos.
 *  3. Escenas, subtítulos, SFX y ducking se calculan desde acá: si cambiás un texto
 *     o la velocidad, todo se reacomoda solo.
 */
import {VOICE} from './voice.generated';

export const FPS = 30;

// ─── Parámetros editables ────────────────────────────────────────────────────
/** Velocidad estimada de locución (palabras/seg, pausas incluidas). */
export const WORDS_PER_SECOND = 2.5;
/** Pausas (seg) que se agregan después de la puntuación. */
export const PAUSE = {comma: 0.2, period: 0.42, chunk: 0.05};
/** Tiempo de movimiento antes de la primera palabra (el gancho se mueve desde el frame 1). */
export const LEAD_IN = 0.45;
/** La frase final queda en pantalla este tiempo extra. */
export const FINAL_HOLD = 2;
/** Duración del cierre "Sígueme". */
export const OUTRO_SECONDS = 5;
/** Usuario que se escribe en la barra de búsqueda del cierre. */
export const USERNAME = '@zerum00';

export type SceneId =
  | 'hook'
  | 'hagakure'
  | 'breaths'
  | 'warrior'
  | 'calm'
  | 'spiral'
  | 'arrow'
  | 'prepared'
  | 'lightness'
  | 'hiding'
  | 'face'
  | 'life'
  | 'luck'
  | 'prudence'
  | 'prudent'
  | 'outro';

export type Chunk = {
  text: string;
  scene?: SceneId; // si está, este chunk abre una escena nueva
  big?: string; // palabra que salta al centro en grande
  bigAccent?: boolean; // ...en rojo
};

// ─── Guion ───────────────────────────────────────────────────────────────────
export const SCRIPT: Chunk[] = [
  {text: 'Cuanto más tardas en decidir, *peor* decides.', scene: 'hook'},
  {text: 'Yamamoto Tsunetomo, el samurái que dictó el *Hagakure*,', scene: 'hagakure'},
  {text: 'decía que una *decisión* debe tomarse', scene: 'breaths'},
  {text: 'en el espacio de *siete respiraciones*.'},
  // (la locución actual no incluye "El guerrero decide rápido porque ha pensado antes."
  //  — si se agrega, volver a poner aquí ese chunk con scene: 'warrior' y big: 'ANTES')
  {text: 'En su libro recoge una *regla* de los antiguos.', scene: 'calm'},
  {text: 'Cuando las cosas se hacen *con calma*,'},
  {text: '*7 de cada 10* salen mal.'},
  {text: 'Hoy pensamos que *darle vueltas* a todo', scene: 'spiral'},
  {text: 'es madurez. Lo llamamos ser *reflexivo*.', big: 'REFLEXIVO'},
  {text: 'Pero Tsunetomo defendía exactamente *lo contrario*.', scene: 'arrow', big: 'LO CONTRARIO'},
  {text: 'Un samurái no decidía rápido *por impulso*.', scene: 'prepared'},
  {text: 'Decidía rápido porque ya lo había *pensado antes*.'},
  {text: '*Piensa* las cosas antes', scene: 'lightness'},
  {text: 'y resuélvelas *con ligereza* cuando llegue el momento.'},
  {text: 'Tú crees que tardas en decidirte', scene: 'hiding'},
  {text: 'porque eres *cuidadoso*.'},
  {text: 'Pero lo único que estás haciendo es *esconderte*.', big: 'ESCONDERTE', bigAccent: true},
  {text: 'No tienes huevos para *afrontar* esa decisión.', scene: 'face'},
  {text: 'Por eso, muchas veces, *la vida*', scene: 'life'},
  {text: 'acaba *decidiendo por ti*.'},
  {text: 'Y a esa decisión', scene: 'luck'},
  {text: 'que la vida toma por ti,'},
  {text: 'la llamas *mala suerte*.', big: 'MALA SUERTE'},
  {text: 'Has de ser *prudente*. Pero cuidado,', scene: 'prudence'},
  {text: 'ser prudente no es *tardar más* que nadie en decidir.', scene: 'prudent'},
];

// ─── Cálculo de tiempos por palabra ──────────────────────────────────────────
export type Word = {
  text: string; // texto visible (con puntuación)
  key: boolean; // es palabra clave
  start: number; // seg
  end: number; // seg
  chunk: number;
  index: number; // índice dentro del chunk
};

const SPOKEN: Record<string, string> = {'7': 'siete', '10': 'diez'};

/** Conteo aproximado de sílabas en español (grupos vocálicos). */
const syllables = (w: string) => {
  const clean = (SPOKEN[w.replace(/[^\w]/g, '')] ?? w).toLowerCase();
  const groups = clean.match(/[aeiouáéíóúü]+/g);
  return Math.max(1, groups ? groups.length : 1);
};

const tokenize = (text: string) => {
  const out: {text: string; key: boolean}[] = [];
  let inKey = false;
  for (const raw of text.split(/\s+/)) {
    const opens = raw.startsWith('*');
    if (opens) inKey = true;
    const closes = raw.replace(/[.,;:]+$/, '').endsWith('*');
    out.push({text: raw.replace(/\*/g, ''), key: inKey});
    if (closes) inKey = false;
  }
  return out;
};

const tokens = SCRIPT.map((c) => tokenize(c.text));

const estimateWords = (): Word[] => {
  const all = tokens.flat();
  let totalPause = 0;
  tokens.forEach((ws) =>
    ws.forEach((w) => {
      if (/[.]$/.test(w.text)) totalPause += PAUSE.period;
      else if (/[,;:]$/.test(w.text)) totalPause += PAUSE.comma;
    })
  );
  totalPause += PAUSE.chunk * tokens.length;
  const speech = all.length / WORDS_PER_SECOND - totalPause;
  const secPerSyl = speech / all.reduce((a, w) => a + syllables(w.text), 0);

  const words: Word[] = [];
  let t = LEAD_IN;
  tokens.forEach((ws, ci) => {
    ws.forEach((w, wi) => {
      const d = syllables(w.text) * secPerSyl;
      words.push({...w, start: t, end: t + d, chunk: ci, index: wi});
      t += d;
      if (/[.]$/.test(w.text)) t += PAUSE.period;
      else if (/[,;:]$/.test(w.text)) t += PAUSE.comma;
    });
    t += PAUSE.chunk;
  });
  return words;
};

/** Tiempos reales de la voz (si se analizó) o estimados. */
export const WORDS: Word[] = VOICE
  ? tokens.flatMap((ws, ci) =>
      ws.map((w, wi) => {
        const v = VOICE!.words[ci]?.[wi];
        return {...w, start: v?.[0] ?? 0, end: v?.[1] ?? 0, chunk: ci, index: wi};
      })
    )
  : estimateWords();

export const HAS_VOICE = Boolean(VOICE);

// ─── Helpers de frames ───────────────────────────────────────────────────────
export const f = (sec: number) => Math.round(sec * FPS);

export const chunkWords = (ci: number) => WORDS.filter((w) => w.chunk === ci);
export const chunkStart = (ci: number) => chunkWords(ci)[0].start;
export const chunkEnd = (ci: number) => {
  const ws = chunkWords(ci);
  return ws[ws.length - 1].end;
};

/**
 * Frame (global) en que la voz dice `phrase` (busca desde el chunk `from`).
 * Ej: cue('siete') → frame donde empieza "siete".
 */
export const cue = (phrase: string, from = 0, which: 'start' | 'end' = 'start') => {
  const target = phrase.toLowerCase().split(/\s+/);
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, '');
  for (let i = 0; i < WORDS.length; i++) {
    if (WORDS[i].chunk < from) continue;
    if (target.every((t, k) => WORDS[i + k] && norm(WORDS[i + k].text) === norm(t))) {
      return f(which === 'start' ? WORDS[i].start : WORDS[i + target.length - 1].end);
    }
  }
  throw new Error(`cue(): no encontré "${phrase}" en el guion`);
};

// ─── Escenas ────────────────────────────────────────────────────────────────
export type SceneTiming = {id: SceneId; start: number; end: number; firstChunk: number};

const sceneStarts = SCRIPT.map((c, i) => ({c, i})).filter(({c}) => c.scene);

const lastWordEnd = WORDS[WORDS.length - 1].end;

/** Palabras grandes: frame en que la voz dice la palabra clave del chunk marcado con `big`. */
export const BIG_MOMENTS = SCRIPT.flatMap((c, ci) => {
  if (!c.big) return [];
  const kw = WORDS.find((w) => w.chunk === ci && w.key)!;
  return [{text: c.big, accent: !!c.bigAccent, at: f(kw.start), chunk: ci}];
});
/** Una palabra grande necesita al menos este tiempo antes del corte (si no, el corte se demora: J-cut). */
export const BIG_MIN_HOLD = 32;

export const SCENES: SceneTiming[] = [
  ...sceneStarts.map(({c, i}, k) => {
    // El corte cae en el medio de la pausa previa a la frase.
    const cutAt = (ci: number) => (chunkEnd(ci - 1) + chunkStart(ci)) / 2;
    const start = k === 0 ? 0 : f(cutAt(i));
    const next = sceneStarts[k + 1];
    let end = next ? f(cutAt(next.i)) : f(lastWordEnd + FINAL_HOLD);
    // J-cut: si una palabra grande cae justo antes del corte, el corte espera.
    for (const b of BIG_MOMENTS) if (b.at < end && b.at >= start && end - b.at < BIG_MIN_HOLD) end = b.at + BIG_MIN_HOLD;
    return {id: c.scene!, start, end, firstChunk: i};
  }),
];
// cada escena empieza donde terminó la anterior (después del J-cut)
for (let k = 1; k < SCENES.length; k++) SCENES[k].start = SCENES[k - 1].end;
const outroStart = SCENES[SCENES.length - 1].end;
SCENES.push({id: 'outro', start: outroStart, end: outroStart + f(OUTRO_SECONDS), firstChunk: -1});

export const scene = (id: SceneId) => SCENES.find((s) => s.id === id)!;
export const TOTAL_FRAMES = SCENES[SCENES.length - 1].end;

/** Intervalos (frames) en que suena la voz → ducking de la música. */
export const SPEECH: [number, number][] = SCRIPT.map((_, ci) => [f(chunkStart(ci)), f(chunkEnd(ci))]);

// ─── Cues internos de escenas (compartidos con el diseño de sonido) ───────────
/** Las 7 respiraciones: reparten el tramo "decía que ... siete respiraciones". */
export const BREATHS = (() => {
  const s = scene('breaths');
  const a = s.start + 8;
  const b = cue('respiraciones.', 0, 'end');
  const step = (b - a) / 7;
  return Array.from({length: 7}, (_, i) => Math.round(a + step * i));
})();
export const BREATH_LEN = Math.round((BREATHS[1] - BREATHS[0]) * 0.95);

/**
 * Cortes secos a negro (frames globales). El negro arranca en el corte y termina
 * justo cuando entra la primera palabra de la escena siguiente (mín. 8 frames).
 */
const blackCut = (id: SceneId) => {
  const s = scene(id);
  const end = f(chunkStart(s.firstChunk));
  const at = Math.min(s.start, end - 8);
  return {at, dur: end - at};
};
export const BLACK_CUTS = [
  blackCut('life'), // después de "afrontar esa decisión"
  blackCut('prudent'), // antes de la tesis final
];

/** Momentos de los SFX y acentos visuales (frames globales). */
export const CUES = {
  hookZoom: f(chunkStart(0)),
  bowlsFall: cue('7'),
  calm: cue('con calma,'),
  spiralBreak: cue('defendía'),
  impulse: cue('impulso.'),
  preparedAppear: f(chunkStart(SCRIPT.findIndex((c) => c.text.startsWith('Decidía')))),
  prepared: cue('pensado antes.'),
  peekUp: cue('cuidadoso.'),
  peek: cue('esconderte.'),
  waveRise: cue('afrontar'),
  lifeClock: cue('la vida', SCRIPT.findIndex((c) => c.scene === 'life')),
  coinFlip: scene('luck').start + 16,
  coinLand: cue('mala suerte.'),
  scaleSettle: cue('cuidado,'),
  pathStart: scene('prudent').start + 6,
};
