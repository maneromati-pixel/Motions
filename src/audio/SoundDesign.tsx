/**
 * Diseño de sonido. Todos los momentos salen de timings.ts, así que si cambian
 * los tiempos, los SFX se mueven solos.
 *  - Voz (si existe /public/voz.mp3, normalizada a -14 LUFS por analyze-voice)
 *  - Pad ambiental a ≈ -28 dB con ducking automático cuando habla la voz
 *  - SFX: whoosh (transiciones), tick (respiraciones), shing (katana),
 *    golpe grave (cortes a negro), acento (espiral→flecha), clink (moneda),
 *    click (tecleo del cierre)
 */
import React from 'react';
import {Sequence, interpolate, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {BLACK_CUTS, BREATHS, CUES, HAS_VOICE, SCENES, SPEECH, TOTAL_FRAMES, USERNAME} from '../timings';
import {VOICE} from '../voice.generated';
import {BIGS} from '../components/BigWord';
import {TRANSITIONS} from '../transitions';
import {OUTRO_TYPING} from '../scenes/S16Outro';

/** Niveles de mezcla (lineal). La voz manda: todo lo demás va bien por debajo. */
/** Música de fondo: archivo y desde qué segundo de la canción arranca (7 s adelantada). */
export const MUSIC = {file: 'music/fondo.mp3', startAtSecond: 7};

export const MIX = {
  voice: 1,
  music: 0.13, // música de fondo (public/music/fondo.mp3, RMS ≈ -11 dBFS) → ≈ -29 dB, leve
  drone: 0.12, // pad oscuro bajado para que no choque con la música
  droneDuck: 0.45, // ≈ -7 dB extra mientras habla la voz
  whoosh: 0.32,
  tick: 0.38,
  shing: 0.55,
  thud: 0.95,
  accent: 0.5,
  clink: 0.42,
  click: 0.3,
};

const sfx = (name: string) => staticFile(`sfx/${name}`);

type Cue = {file: string; at: number; vol: number; dur?: number};

const buildCues = (): Cue[] => {
  const cues: Cue[] = [];
  // whoosh en transiciones con movimiento
  SCENES.forEach((s) => {
    const k = TRANSITIONS[s.id];
    if (k === 'whip' || k === 'sweep') cues.push({file: 'whoosh.wav', at: s.end - 10, vol: MIX.whoosh});
    if (k === 'morph') cues.push({file: 'whoosh.wav', at: s.end - 6, vol: MIX.whoosh * 0.45});
  });
  // tick en cada círculo de respiración
  BREATHS.forEach((b) => cues.push({file: 'tick.wav', at: b, vol: MIX.tick}));
  // katana: tajo + brillo metálico
  cues.push({file: 'whoosh.wav', at: CUES.katanaDraw + 2, vol: MIX.whoosh * 0.9});
  cues.push({file: 'shing.wav', at: CUES.katanaShine, vol: MIX.shing});
  // golpe grave en los cortes a negro
  BLACK_CUTS.forEach((c) => cues.push({file: 'thud.wav', at: c.at, vol: MIX.thud}));
  // espiral que se rompe
  cues.push({file: 'accent.wav', at: CUES.spiralBreak - 10, vol: MIX.accent});
  // moneda: lanzamiento y caída
  cues.push({file: 'whoosh.wav', at: CUES.coinFlip, vol: MIX.whoosh * 0.6});
  cues.push({file: 'clink.wav', at: CUES.coinLand - 12, vol: MIX.clink});
  // palabras grandes: aire muy sutil
  BIGS.forEach((b) => cues.push({file: 'whoosh.wav', at: b.at - 6, vol: MIX.whoosh * 0.35}));
  // cierre: un click por letra + click final
  const outro = SCENES[SCENES.length - 1];
  for (let i = 0; i < USERNAME.length; i++) {
    cues.push({file: 'click.wav', at: outro.start + OUTRO_TYPING.start + i * OUTRO_TYPING.perLetter, vol: MIX.click * (0.8 + ((i * 7) % 5) * 0.08)});
  }
  cues.push({file: 'click.wav', at: outro.start + OUTRO_TYPING.start + USERNAME.length * OUTRO_TYPING.perLetter + 10, vol: MIX.click * 1.4});
  return cues.filter((c) => c.at >= 0 && c.at < TOTAL_FRAMES);
};

export const SFX_CUES = buildCues();

/** Ducking: 1 en silencio, droneDuck cuando suena la voz (rampas de 8 frames). */
const duck = (frame: number) => {
  let d = 0;
  for (const [a, b] of SPEECH) {
    d = Math.max(
      d,
      interpolate(frame, [a - 8, a, b, b + 12], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    );
  }
  return 1 - d * (1 - MIX.droneDuck);
};

export const SoundDesign: React.FC = () => (
  <>
    {HAS_VOICE && VOICE && <Audio src={staticFile(VOICE.file)} volume={MIX.voice} />}
    {/* música de fondo: arranca en el segundo 7 de la canción, con ducking bajo la voz */}
    <Audio
      src={staticFile(MUSIC.file)}
      trimBefore={MUSIC.startAtSecond * 30}
      volume={(f) =>
        MIX.music *
        duck(f) *
        interpolate(f, [0, 15, TOTAL_FRAMES - 60, TOTAL_FRAMES], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
      }
    />
    <Audio
      src={sfx('drone.mp3')}
      volume={(f) =>
        MIX.drone *
        duck(f) *
        interpolate(f, [0, 20, TOTAL_FRAMES - 45, TOTAL_FRAMES], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
      }
    />
    {SFX_CUES.map((c, i) => (
      <Sequence key={i} from={c.at} durationInFrames={c.dur ?? 60} layout="none" name={`sfx ${c.file}`}>
        <Audio src={sfx(c.file)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
