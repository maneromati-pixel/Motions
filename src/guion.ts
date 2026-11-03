// Guion: duración de cada escena, de qué tramo de la locución sale su audio y las frases (para el .srt).
// Lo usan el video (src/Video.tsx), los subtítulos (scripts/srt.ts) y el armado de la voz (scripts/voz.ts).
// Este archivo no importa nada, así Node lo puede leer directo.
//
// - dur: segundos que dura la escena en el video final
// - diseno: segundos para los que se diseñaron las animaciones (no tocar: se escalan solas a `dur`)
// - corte: [desde, hasta] en segundos dentro de audio/voz-original.mp3
// - frases: [desde, hasta, texto], tiempos en voz-original.mp3

export const FPS = 30;

export type Frase = [number, number, string];
export type EscenaGuion = {id: number; dur: number; diseno: number; corte: [number, number]; frases: Frase[]};

export const GUION: EscenaGuion[] = [
  {id: 1, dur: 4.0, diseno: 3, corte: [0, 4.01], frases: [[0, 3.6, 'El 90% de la gente usa su sueldo en el orden equivocado.']]},
  {
    id: 2, dur: 4.25, diseno: 5, corte: [4.01, 8.25],
    frases: [[4.13, 6.22, 'Por eso hay gente que gana el doble que vos…'], [6.52, 7.9, 'y llega peor a fin de mes.']],
  },
  {
    id: 3, dur: 5.4, diseno: 6, corte: [8.25, 13.61],
    frases: [[8.37, 9.97, 'Esto es lo que hace casi todo el mundo:'], [10.38, 13.27, 'cobra, gasta… y si sobra algo, ahorra.']],
  },
  {id: 4, dur: 3.3, diseno: 5, corte: [13.61, 16.4], frases: [[13.73, 16.13, 'El problema es que nunca sobra nada.']]},
  {
    id: 5, dur: 4.5, diseno: 5, corte: [16.4, 20.89],
    frases: [[16.52, 18.22, 'Porque los gastos son como el agua:'], [18.59, 20.62, 'llenan todo el espacio que les dejás.']],
  },
  {
    id: 6, dur: 6.0, diseno: 8, corte: [20.89, 26.82],
    frases: [
      [21.01, 22.91, 'El otro 10% lo hace al revés.'],
      [23.24, 25.33, 'Cobra… se paga primero a sí mismo…'],
      [25.65, 26.6, 'y vive con lo que queda.'],
    ],
  },
  {
    id: 7, dur: 4.0, diseno: 6, corte: [26.82, 30.74],
    frases: [[26.94, 28.99, 'Mismo sueldo. Misma persona.'], [29.32, 30.47, 'Solo cambió el orden.']],
  },
  {id: 8, dur: 2.5, diseno: 4, corte: [30.74, 32.22], frases: [[30.86, 32.06, 'Ahora ponele números.']]},
  {
    id: 9, dur: 10.5, diseno: 13, corte: [32.22, 41.85],
    frases: [
      [32.34, 34.84, 'Apartar un 10% de lo que ganás parece nada.'],
      [35.23, 38.2, 'Pero si lo hacés todos los meses y lo hacés crecer,'],
      [38.2, 40.12, "en 10 años no tenés 'un poquito'."],
      [40.5, 41.6, 'Tenés una base.'],
    ],
  },
  {
    id: 10, dur: 5.5, diseno: 7, corte: [41.85, 47.3],
    frases: [
      [41.96, 44.4, 'La plata que ahorrás no es plata que perdés.'],
      [44.4, 47.14, 'Son empleados que trabajan para vos mientras dormís.'],
    ],
  },
  {
    id: 11, dur: 5.5, diseno: 8, corte: [47.3, 52.77],
    frases: [[47.42, 49.22, 'No necesitás ganar más para empezar.'], [49.52, 52.6, 'Necesitás cambiar el orden hoy, con lo que tenés.']],
  },
  {
    id: 12, dur: 5.0, diseno: 5, corte: [52.77, 56.61],
    frases: [[52.89, 56.45, 'Seguime, que acá te voy a enseñar a hacer que tu plata trabaje para vos.']],
  },
];

// Línea de tiempo en frames (cada escena arranca donde termina la anterior)
export const LINEA = (() => {
  let desde = 0;
  return GUION.map((e) => {
    const frames = Math.round(e.dur * FPS);
    const r = {...e, desdeF: desde, frames, escala: (e.diseno * FPS) / frames};
    desde += frames;
    return r;
  });
})();

export const TOTAL_FRAMES = LINEA.reduce((a, e) => a + e.frames, 0);
