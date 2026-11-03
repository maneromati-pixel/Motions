// Guion: tiempos (en segundos) y voz en off de cada escena.
// Lo usan tanto el video (src/Video.tsx) como el generador de subtítulos (scripts/srt.ts).
// Este archivo no importa nada, así Node lo puede leer directo.

export const FPS = 30;
export const DURACION_SEG = 75;

export type EscenaGuion = {id: number; inicio: number; fin: number; voz: string};

export const GUION: EscenaGuion[] = [
  {id: 1, inicio: 0, fin: 3, voz: 'El 90% de la gente usa su sueldo en el orden equivocado.'},
  {id: 2, inicio: 3, fin: 8, voz: 'Por eso hay gente que gana el doble que vos… y llega peor a fin de mes.'},
  {id: 3, inicio: 8, fin: 14, voz: 'Esto es lo que hace casi todo el mundo: cobra, gasta… y si sobra algo, ahorra.'},
  {id: 4, inicio: 14, fin: 19, voz: 'El problema es que nunca sobra nada.'},
  {id: 5, inicio: 19, fin: 24, voz: 'Porque los gastos son como el agua: llenan todo el espacio que les dejás.'},
  {id: 6, inicio: 24, fin: 32, voz: 'El otro 10% lo hace al revés. Cobra… se paga primero a sí mismo… y vive con lo que queda.'},
  {id: 7, inicio: 32, fin: 38, voz: 'Mismo sueldo. Misma persona. Solo cambió el orden.'},
  {id: 8, inicio: 38, fin: 42, voz: 'Ahora ponele números.'},
  {
    id: 9,
    inicio: 42,
    fin: 55,
    voz: "Apartar un 10% de lo que ganás parece nada. Pero si lo hacés todos los meses y lo hacés crecer, en 10 años no tenés 'un poquito'. Tenés una base.",
  },
  {id: 10, inicio: 55, fin: 62, voz: 'La plata que ahorrás no es plata que perdés. Son empleados que trabajan para vos mientras dormís.'},
  {id: 11, inicio: 62, fin: 70, voz: 'No necesitás ganar más para empezar. Necesitás cambiar el orden hoy, con lo que tenés.'},
  {id: 12, inicio: 70, fin: 75, voz: 'Seguime, que acá te voy a enseñar a hacer que tu plata trabaje para vos.'},
];
