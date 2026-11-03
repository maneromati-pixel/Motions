/**
 * Voz en off (ElevenLabs, "Sofia – Natural Conversations", español neutro).
 * El audio original dura 52,6 s y tiene una frase por bloque, separadas por silencios
 * (detectados con ffmpeg silencedetect, −38 dB). Cada bloque se recorta del archivo y se
 * ubica en el video para que la voz caiga sobre su imagen.
 *
 * `from`/`to`: inicio y fin del habla en el archivo (s).  `at`: dónde empieza a hablar en el video (s).
 */
export const VOICE_FILE = 'audio/voz.mp3';

export const VOICE_CLIPS: Array<{from: number; to: number; at: number; text: string}> = [
  {from: 0.0, to: 6.12, at: 0.0, text: 'Un millón cincuenta y cuatro mil… / Y de tu bolsillo pusiste solo ciento ocho mil.'},
  {from: 6.54, to: 10.74, at: 6.7, text: '¿Cómo? Doscientos dólares al mes, desde los veinte años. Nada más.'},
  {from: 11.16, to: 13.17, at: 12.4, text: 'A los treinta, tienes treinta y seis mil.'},
  {from: 13.57, to: 15.58, at: 15.0, text: 'A los cuarenta, ciento diecisiete mil.'},
  {from: 15.9, to: 18.44, at: 17.6, text: 'A los cincuenta, casi trescientos mil.'},
  {from: 19.0, to: 21.59, at: 22.1, text: 'Y a los sesenta y cinco… superas el millón.'},
  {from: 22.11, to: 27.85, at: 26.55, text: 'Tú pusiste ciento ocho mil. Los otros novecientos cuarenta y siete mil… los hizo el tiempo.'},
  {from: 28.29, to: 34.83, at: 33.3, text: 'Mismo aporte. Pero uno empezó diez años después. Esa espera le costó casi seiscientos mil dólares.'},
  {from: 35.29, to: 40.29, at: 42.4, text: 'Los primeros años, parece que no pasa nada. Ahí es donde casi todos abandonan.'},
  {from: 40.69, to: 45.93, at: 49.6, text: 'Pero esto no es una línea recta. Es exponencial. Lo grande pasa al final.'},
  {from: 46.35, to: 50.81, at: 55.9, text: 'El mejor momento para empezar fue a los dieciocho. El segundo mejor es hoy.'},
  {from: 51.23, to: 52.33, at: 60.6, text: 'Guárdalo y sígueme.'},
];

/** Margen para no cortar ataques ni colas de respiración (s). */
export const VOICE_PAD = {before: 0.08, after: 0.14};

/**
 * Música de fondo. Arranca desde el segundo 8 del tema y queda como colchón:
 * el tema viene a −9 LUFS y la voz a −22, así que la música va ~15 dB por debajo
 * de la voz mientras habla (ducking) y un poco más arriba en los silencios.
 */
export const MUSIC = {
  file: 'audio/musica.mp3',
  startAt: 8, // s del tema que suenan en el frame 0
  volSpeech: 0.04, // ≈ −28 dB: debajo de la voz
  volGap: 0.08, // ≈ −22 dB: en los silencios
  duckRamp: 0.3, // s de rampa al bajar/subir
  fadeIn: 0.4,
  fadeOut: 2.0,
};

/** 0..1: cuánto está hablando la voz en el segundo `t` (con rampas suaves). */
export const speechAmount = (t: number) => {
  let a = 0;
  for (const c of VOICE_CLIPS) {
    const s = c.at - 0.15;
    const e = c.at + (c.to - c.from) + 0.2;
    const r = MUSIC.duckRamp;
    const k = Math.min(1, Math.max(0, (t - (s - r)) / r), Math.max(0, (e + r - t) / r));
    a = Math.max(a, k);
  }
  return a;
};
