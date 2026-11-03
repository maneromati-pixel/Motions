import React from "react";
import { AbsoluteFill, Audio, interpolate, Series, staticFile } from "remotion";
import { Scene01Hook } from "./scenes/Scene01Hook";
import { Scene02Sueldo } from "./scenes/Scene02Sueldo";
import { Scene03Quien } from "./scenes/Scene03Quien";
import { Scene04Radar } from "./scenes/Scene04Radar";
import { Scene05Plan } from "./scenes/Scene05Plan";
import { Scene06Gente } from "./scenes/Scene06Gente";
import { Scene07Piensan } from "./scenes/Scene07Piensan";
import { Scene08Mismo } from "./scenes/Scene08Mismo";
import { Scene09Numeros } from "./scenes/Scene09Numeros";
import { Scene10Curva } from "./scenes/Scene10Curva";
import { Scene11Cierre } from "./scenes/Scene11Cierre";
import { C } from "./theme";
import { AUDIO, SCENES, SceneKey, TOTAL_FRAMES } from "./timing";

const ORDER: [SceneKey, React.FC][] = [
  ["hook", Scene01Hook],
  ["sueldo", Scene02Sueldo],
  ["quien", Scene03Quien],
  ["radar", Scene04Radar],
  ["plan", Scene05Plan],
  ["gente", Scene06Gente],
  ["piensan", Scene07Piensan],
  ["mismo", Scene08Mismo],
  ["numeros", Scene09Numeros],
  ["curva", Scene10Curva],
  ["cierre", Scene11Cierre],
];

/** Música: entra suave, queda baja debajo de la voz, sube en el cierre y se desvanece. */
const musicVolume = (f: number) =>
  interpolate(
    f,
    [0, AUDIO.musicFadeIn, AUDIO.voiceEnd - 6, AUDIO.voiceEnd + 12, TOTAL_FRAMES - AUDIO.musicFadeOut, TOTAL_FRAMES],
    [0, AUDIO.musicUnderVoice, AUDIO.musicUnderVoice, AUDIO.musicOutro, AUDIO.musicOutro, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

/** Voz (ElevenLabs) + canción de fondo, desde public/audio. */
export const ClientePerfecto: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.paper }}>
    <Audio src={staticFile("audio/voz.mp3")} volume={AUDIO.voice} />
    <Audio src={staticFile("audio/musica.mp3")} volume={musicVolume} startFrom={AUDIO.musicStartAt} />
    <Series>
      {ORDER.map(([key, Comp]) => (
        <Series.Sequence key={key} durationInFrames={SCENES[key]}>
          <Comp />
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);
