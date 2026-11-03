/**
 * Mapa temporal (segundos). Montado a ~120 BPM → 1 beat = 0,5 s.
 * Sincronizado con la voz en off (ver src/voice.ts): cada cifra aparece cuando la voz la dice.
 */
export const T = {
  // 0 · HOOK (visible desde el frame 0)
  hookSub: 1.2, // "Y SOLO PUSISTE 108.000."
  sheen: 2.2, // brillo especular único

  // 1 · LA CONDICIÓN
  cond: 6.2,

  // 2 · EL TIEMPO TRABAJANDO
  work: 11.0,
  disclaimer: 10.0,
  // conteos: [inicio, fin] por tramo de edad; luego hold
  segs: [
    [12.0, 14.2], // 20 → 30
    [14.6, 16.8], // 30 → 40
    [17.2, 19.4], // 40 → 50
    [19.8, 21.8], // 50 → 60
    [22.2, 24.2], // 60 → 65, luego pausa > 1 s
  ] as Array<[number, number]>,

  // 3 · QUIÉN LO HIZO
  split: 25.8,
  splitVos: 26.6, // "Tú pusiste ciento ocho mil"
  splitInt: 28.4, // "Los otros novecientos cuarenta y siete mil"
  splitSolo: 31.2, // "los hizo el tiempo"

  // 4 · EL COSTO DE ESPERAR (corte rítmico deliberado)
  cut: 33.0,
  cmpAporte: 33.6, // "Mismo aporte"
  cmpResult: 34.8,
  cmpEspera: 36.8, // "Esa espera le costó…"

  // 5 · EL VALLE
  valley: 41.0, // la línea de piso empieza a convertirse en eje
  curveStart: 42.2,
  abandon: 45.2, // "Ahí es donde casi todos abandonan"
  valleyStop: 49.2,

  // 6 · LA CURVA
  climb: 49.6,
  climbEnd: 54.2,

  // 7 · DECISIÓN + CIERRE
  close: 55.6,
  closeHoy: 58.7, // "El segundo mejor es hoy"
  pill: 60.3,
  typeStart: 61.1,
  typeStep: 0.11,
  still: 62.0, // último segundo quieto
} as const;
