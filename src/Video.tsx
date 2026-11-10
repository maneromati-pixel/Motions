import React from "react";
import { AbsoluteFill, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { CONTACTO, CROSSFADE, FONT, SCENES, SFX, SFX_VOLUME, TRANSITIONS, s } from "./config";
import { Background } from "./components/Background";
import { SceneFade } from "./components/SceneFade";
import { MTransition } from "./components/MTransition";
import { OlaTransition, ReflejoTransition } from "./components/WaterTransitions";
import { Gancho } from "./scenes/Gancho";
import { Presentacion } from "./scenes/Presentacion";
import { ComoActua } from "./scenes/ComoActua";
import { Beneficios } from "./scenes/Beneficios";
import { ComoSeUsa } from "./scenes/ComoSeUsa";
import { Cierre } from "./scenes/Cierre";

loadFont({ family: FONT, url: staticFile("fonts/montserrat-latin-400-normal.woff2"), weight: "400" });
loadFont({ family: FONT, url: staticFile("fonts/montserrat-latin-600-normal.woff2"), weight: "600" });

export type ContactProps = { telefono: string; instagram: string };

export type VideoProps = {
  /** Música opcional (URL o ruta dentro de /public, p. ej. "musica.mp3"). Sin audio el video funciona igual. */
  musicSrc?: string;
  /** Teléfono del cierre. */
  telefono?: string;
  /** Usuario de Instagram del cierre. */
  instagram?: string;
};

const ORDER: { key: keyof typeof SCENES; C: React.FC<ContactProps> }[] = [
  { key: "gancho", C: Gancho },
  { key: "presentacion", C: Presentacion },
  { key: "comoActua", C: ComoActua },
  { key: "beneficios", C: Beneficios },
  { key: "comoSeUsa", C: ComoSeUsa },
  { key: "cierre", C: Cierre },
];

// cortes cubiertos por una transición (ola, burbujas o trazo M)
const M_CUTS = new Set<number>(TRANSITIONS.map((m) => m.at));
const TRANSITION_C = { ola: OlaTransition, reflejo: ReflejoTransition, trazoM: MTransition };

export const AlquimiaPowerFloc: React.FC<VideoProps> = ({ musicSrc, telefono = CONTACTO.telefono, instagram = CONTACTO.instagram }) => {
  const { durationInFrames } = useVideoConfig();
  const half = s(CROSSFADE / 2);
  const resolveSrc = (src: string) => (/^(https?:|data:|blob:)/.test(src) ? src : staticFile(src));

  return (
    <AbsoluteFill style={{ backgroundColor: "#6B1D20" }}>
      <Background />
      {ORDER.map(({ key, C }, i) => {
        const sc = SCENES[key];
        const first = i === 0;
        const last = i === ORDER.length - 1;
        // con una transición el fundido es más largo y queda oculto detrás de ella
        const inHalf = M_CUTS.has(sc.from) ? s(0.35) : half;
        const nextFrom = last ? null : SCENES[ORDER[i + 1].key].from;
        const outHalf = nextFrom !== null && M_CUTS.has(nextFrom) ? s(0.35) : half;
        const from = first ? 0 : s(sc.from) - inHalf;
        const to = last ? durationInFrames : s(sc.to) + outHalf;
        return (
          <Sequence key={key} name={key} from={from} durationInFrames={to - from}>
            <SceneFade fadeIn={first ? 0 : inHalf * 2} fadeOut={last ? 0 : outHalf * 2}>
              <C telefono={telefono} instagram={instagram} />
            </SceneFade>
          </Sequence>
        );
      })}
      {TRANSITIONS.map((m, i) => {
        const T = TRANSITION_C[m.tipo];
        return (
          <Sequence key={`t${i}`} name={`Transición ${m.tipo}`} from={s(m.at - m.duration / 2)} durationInFrames={s(m.duration)}>
            <T />
            {/* sonido sutil de la transición */}
            <Audio src={staticFile(SFX[m.tipo])} volume={SFX_VOLUME} />
          </Sequence>
        );
      })}
      {musicSrc ? (
        <Audio
          src={resolveSrc(musicSrc)}
          volume={(f) =>
            interpolate(f, [0, 15, durationInFrames - 45, durationInFrames], [0, 0.8, 0.8, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      ) : null}
    </AbsoluteFill>
  );
};
