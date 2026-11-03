import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import type {Caption} from '@remotion/captions';
import {COLORS, FADE} from './theme';
import type {Timeline} from './cues';
import {loadFonts} from './fonts';
import {Background} from './ui/Background';
import {Label} from './ui/primitives';
import {Scene01Hook} from './scenes/Scene01Hook';
import {Scene02Cuando} from './scenes/Scene02Cuando';
import {Scene03PersonaA} from './scenes/Scene03PersonaA';
import {Scene04PersonaB} from './scenes/Scene04PersonaB';
import {Scene05Diez} from './scenes/Scene05Diez';
import {Scene06Numeros} from './scenes/Scene06Numeros';
import {Scene07Doble} from './scenes/Scene07Doble';
import {Scene08Compuesto} from './scenes/Scene08Compuesto';
import {Scene09BolaNieve} from './scenes/Scene09BolaNieve';
import {Scene10Regla72} from './scenes/Scene10Regla72';
import {Scene11Hoy} from './scenes/Scene11Hoy';
import {Scene12Sigueme} from './scenes/Scene12Sigueme';
import type {SceneProps} from './scenes/types';

loadFonts();

export type VideoProps = {
  captions: Caption[];
  timeline: Timeline;
};

const SCENES: {name: string; C: React.FC<SceneProps>}[] = [
  {name: '01 Gancho', C: Scene01Hook},
  {name: '02 No es cuánto', C: Scene02Cuando},
  {name: '03 Persona A', C: Scene03PersonaA},
  {name: '04 Persona B', C: Scene04PersonaB},
  {name: '05 Diez años', C: Scene05Diez},
  {name: '06 Números', C: Scene06Numeros},
  {name: '07 El doble', C: Scene07Doble},
  {name: '08 Interés compuesto', C: Scene08Compuesto},
  {name: '09 Bola de nieve', C: Scene09BolaNieve},
  {name: '10 Regla del 72', C: Scene10Regla72},
  {name: '11 Hoy', C: Scene11Hoy},
  {name: '12 Sígueme', C: Scene12Sigueme},
];

// Fade corto de entrada/salida. La escena 1 NO tiene entrada: el frame 0 ya está completo.
const SceneFade: React.FC<{index: number; duration: number; last: boolean; children: React.ReactNode}> = ({
  index,
  duration,
  last,
  children,
}) => {
  const f = useCurrentFrame();
  const inO = index === 0 ? 1 : interpolate(f, [0, FADE], [0, 1], {extrapolateRight: 'clamp'});
  const outO = last ? 1 : interpolate(f, [duration - FADE, duration], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: Math.min(inO, outO)}}>{children}</AbsoluteFill>;
};

export const Video: React.FC<VideoProps> = ({timeline}) => {
  const frame = useCurrentFrame();
  const outro = timeline[timeline.length - 1];
  const navy = timeline.length ? interpolate(frame, [outro.start, outro.start + 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
  const s6 = timeline[5];
  const s7 = timeline[6];

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.black}}>
      <Background navy={navy} />
      <Audio src={staticFile('voz.mp3')} />
      {timeline.map((t, i) => {
        const {name, C} = SCENES[i];
        const duration = t.end - t.start;
        if (duration <= 0) return null;
        return (
          <Sequence key={name} name={name} from={t.start} durationInFrames={duration}>
            <SceneFade index={i} duration={duration} last={i === timeline.length - 1}>
              <C duration={duration} cues={t.cues} />
            </SceneFade>
          </Sequence>
        );
      })}
      {s6 && s7 ? (
        <Sequence name="Aviso rendimiento" from={s6.start} durationInFrames={s7.end - s6.start}>
          <SceneFade index={1} duration={s7.end - s6.start} last={false}>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 300, display: 'flex', justifyContent: 'center'}}>
              <Label size={20} style={{letterSpacing: '0.25em', marginRight: '-0.25em'}}>
                Rendimiento ilustrativo del 8% anual, no garantizado
              </Label>
            </div>
          </SceneFade>
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
