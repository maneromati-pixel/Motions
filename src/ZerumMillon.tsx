import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {p} from './anim';
import {At, Background, Micro} from './components/primitives';
import {ensureFonts} from './fonts';
import {Chart} from './scenes/Chart';
import {Comparison} from './scenes/Comparison';
import {Finale} from './scenes/Finale';
import {HookAndCondition} from './scenes/HookAndCondition';
import {Instrument} from './scenes/Instrument';
import {C, SAFE} from './theme';
import {T} from './timeline';

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

export const ZerumMillon: React.FC = () => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Background />
    <HookAndCondition />
    <Instrument />
    <Comparison />
    <Chart />
    <Finale />
    <Disclaimer />
  </AbsoluteFill>
);
