/**
 * Mapa temporal (segundos). Montado a ~120 BPM → 1 beat = 0,5 s.
 * Los acentos (cada edad, el split, el corte, la curva) caen sobre el beat.
 */
export const T = {
  // 0 · HOOK
  hookSub: 1.2, // "Y SOLO PUSISTE 108.000."
  sheen: 2.2, // brillo especular único

  // 1 · LA CONDICIÓN
  cond: 5.0,

  // 2 · EL TIEMPO TRABAJANDO
  work: 10.0,
  disclaimer: 10.0,
  // conteos: [inicio, fin] por tramo de edad; luego hold ~0,65 s
  segs: [
    [11.0, 13.2],
    [13.85, 16.05],
    [16.7, 18.9],
    [19.55, 21.75],
    [22.4, 24.4], // 60 → 65, luego pausa > 1 s
  ] as Array<[number, number]>,

  // 3 · QUIÉN LO HIZO
  split: 26.0,

  // 4 · EL COSTO DE ESPERAR (corte rítmico deliberado)
  cut: 32.0,

  // 5 · EL VALLE
  valley: 40.4, // la línea de piso empieza a convertirse en eje
  curveStart: 41.6,
  valleyStop: 48.6,

  // 6 · LA CURVA
  climb: 49.0,
  climbEnd: 53.6,

  // 7 · DECISIÓN + CIERRE
  close: 56.0,
  pill: 59.0,
  typeStart: 59.9,
  typeStep: 0.14,
  still: 61.0, // último segundo quieto
} as const;
