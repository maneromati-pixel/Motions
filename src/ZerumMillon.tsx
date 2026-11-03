import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {p} from './anim';
import {At, Background, Micro} from './components/primitives';
import {ensureFonts} from './fonts';
import {Chart} from './scenes/Chart';
import {Comparison} from './scenes/Comparison';
import {Finale} from './scenes/Finale';
import {HookAndCondition} from './scenes/HookAndCondition';
import {Instrument} from './scenes/Instrument';
import {C, PALETTES, SAFE, setPalette} from './theme';
import {T} from './timeline';
import {VOICE_CLIPS, VOICE_FILE, VOICE_PAD} from './voice';

ensureFonts();

/** Disclaimer permanente desde los 10 s, por encima de la zona segura inferior. */
const Disclaimer: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const op = p(frame / fps, T.disclaimer, 0.6);
  if (op <= 0) return null;
  return (
    <div style={{opacity: op}}>
      <At x={SAFE.cx} y={1424}>
        <Micro size={18} color={C.disclaimer} tracking={0.2} weight={500}>
          Rendimiento estimado 8% anual · No garantizado
        </Micro>
      </At>
      <At x={SAFE.cx} y={1456}>
        <Micro size={18} color={C.disclaimer} tracking={0.2} weight={500}>
          No es asesoramiento financiero
        </Micro>
      </At>
    </div>
  );
};

/** Voz en off: cada frase recortada del archivo y ubicada sobre su imagen. */
const Voice: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <>
      {VOICE_CLIPS.map((c) => {
        const pre = Math.min(VOICE_PAD.before, c.from, c.at);
        const from = Math.round((c.from - pre) * fps);
        const to = Math.round((c.to + VOICE_PAD.after) * fps);
        const fade = 3; // frames, evita clics en los cortes
        return (
          <Sequence key={c.at} from={Math.round((c.at - pre) * fps)} durationInFrames={to - from} layout="none">
            <Audio
              src={staticFile(VOICE_FILE)}
              trimBefore={from}
              trimAfter={to}
              volume={(f) => Math.min(1, f / fade, (to - from - f) / fade)}
            />
          </Sequence>
        );
      })}
    </>
  );
};

const Film: React.FC<{mode: keyof typeof PALETTES}> = ({mode}) => {
  setPalette(mode);
  return (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Background />
    <HookAndCondition />
    <Instrument />
    <Comparison />
    <Chart />
    <Finale />
    <Disclaimer />
    <Voice />
  </AbsoluteFill>
  );
};

export const ZerumMillon: React.FC = () => <Film mode="color" />;
/** Versión blanco y negro. */
export const ZerumMillonBN: React.FC = () => <Film mode="bn" />;
