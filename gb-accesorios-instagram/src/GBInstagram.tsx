import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile} from 'remotion';
import timeline from './timeline.json';
import {Wipe} from './components/Wipe';
import {Scene1Logo} from './scenes/Scene1Logo';
import {Scene2Profile} from './scenes/Scene2Profile';
import {Scene3Products} from './scenes/Scene3Products';
import {Scene4Message} from './scenes/Scene4Message';
import {Scene5CTA} from './scenes/Scene5CTA';

const {scenes, cuts, sfx, durationInFrames} = timeline;

// Duración aproximada (en frames) de cada efecto, para calcular el "ducking" de la música
const sfxLength: Record<string, number> = {pop: 8, shimmer: 30, whoosh: 18, tap: 6, ding: 30};
const sfxVolume: Record<string, number> = {pop: 0.9, shimmer: 0.55, whoosh: 0.7, tap: 1, ding: 0.75};

// Volumen de la música: fade-in corto, baja ~40% mientras suena un efecto, fade-out final.
const musicVolume = (f: number) => {
  let duck = 1;
  for (const [name, frames] of Object.entries(sfx)) {
    for (const start of frames) {
      const end = start + sfxLength[name];
      const d = interpolate(f, [start - 3, start, end, end + 6], [1, 0.6, 0.6, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      duck = Math.min(duck, d);
    }
  }
  const fadeIn = interpolate(f, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(f, [durationInFrames - 18, durationInFrames - 1], [1, 0], {extrapolateLeft: 'clamp'});
  return 0.85 * duck * fadeIn * fadeOut;
};

export const GBInstagram: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#F7F1EB'}}>
      <Sequence from={scenes.logo.from} durationInFrames={scenes.logo.duration} name="1 · Logo">
        <Scene1Logo />
      </Sequence>
      <Sequence from={scenes.perfil.from} durationInFrames={scenes.perfil.duration} name="2 · Perfil IG">
        <Scene2Profile />
      </Sequence>
      <Sequence from={scenes.productos.from} durationInFrames={scenes.productos.duration} name="3 · Productos">
        <Scene3Products />
      </Sequence>
      <Sequence from={scenes.mensaje.from} durationInFrames={scenes.mensaje.duration} name="4 · Mensaje">
        <Scene4Message />
      </Sequence>
      <Sequence from={scenes.cierre.from} durationInFrames={scenes.cierre.duration} name="5 · Cierre CTA">
        <Scene5CTA />
      </Sequence>

      {/* transiciones: barrido centrado en cada corte */}
      {cuts.map((c, i) => (
        <Sequence key={c} from={c - 9} durationInFrames={20} name={`Transición ${i + 1}`}>
          <Wipe variant={i} />
        </Sequence>
      ))}

      {/* AUDIO */}
      <Audio src={staticFile('audio/music.wav')} volume={musicVolume} />
      {Object.entries(sfx).flatMap(([name, frames]) =>
        frames.map((f) => (
          <Sequence key={`${name}-${f}`} from={f} name={`sfx ${name}`}>
            <Audio src={staticFile(`audio/${name}.wav`)} volume={sfxVolume[name]} />
          </Sequence>
        )),
      )}
    </AbsoluteFill>
  );
};
