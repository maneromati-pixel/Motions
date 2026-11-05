/**
 * Video.tsx — Línea de tiempo maestra.
 * Cada escena vive en una <Sequence> con PRE/POST frames de solape y el tipo de
 * transición de su corte de SALIDA se define en TRANSITIONS.
 */
import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {Background, FilmGrain} from './components/FilmGrain';
import {GlowDefs} from './components/GlowDefs';
import {KineticCaption} from './components/KineticCaption';
import {BigWordLayer} from './components/BigWord';
import {POST, PRE, SceneProvider} from './components/SceneContext';
import {SoundDesign} from './audio/SoundDesign';
import {BLACK_CUTS, SCENES, type SceneId} from './timings';
import {TRANSITIONS} from './transitions';
import {prog, mix} from './lib/anim';
import {EASE, VIDEO} from './theme';
import {S01Hook} from './scenes/S01Hook';
import {S02Hagakure} from './scenes/S02Hagakure';
import {S03Breaths} from './scenes/S03Breaths';
import {S04Warrior} from './scenes/S04Warrior';
import {S05Calm} from './scenes/S05Calm';
import {S06Spiral} from './scenes/S06Spiral';
import {S07Arrow} from './scenes/S07Arrow';
import {S08Prepared} from './scenes/S08Prepared';
import {S09Lightness} from './scenes/S09Lightness';
import {S10Hiding} from './scenes/S10Hiding';
import {S11Face} from './scenes/S11Face';
import {S12Life} from './scenes/S12Life';
import {S13Luck} from './scenes/S13Luck';
import {S14Prudence} from './scenes/S14Prudence';
import {S15Prudent} from './scenes/S15Prudent';
import {S16Outro} from './scenes/S16Outro';

const COMPONENTS: Record<SceneId, React.FC> = {
  hook: S01Hook,
  hagakure: S02Hagakure,
  breaths: S03Breaths,
  warrior: S04Warrior,
  calm: S05Calm,
  spiral: S06Spiral,
  arrow: S07Arrow,
  prepared: S08Prepared,
  lightness: S09Lightness,
  hiding: S10Hiding,
  face: S11Face,
  life: S12Life,
  luck: S13Luck,
  prudence: S14Prudence,
  prudent: S15Prudent,
  outro: S16Outro,
};

const WHIP = 8; // medio ancho de la ventana del whip (frames)
const SWEEP = 9;

/** Estilo de una escena según dónde está respecto de sus cortes de entrada/salida. */
const sceneStyle = (g: number, i: number): {style: React.CSSProperties; blur: number; visible: boolean} => {
  const s = SCENES[i];
  const prev = i > 0 ? TRANSITIONS[SCENES[i - 1].id] : undefined;
  const next = TRANSITIONS[s.id];
  let y = 0;
  let blur = 0;
  let clip: string | undefined;
  let opacity = 1;
  let visible = true;

  // entrada
  if (g < s.start + PRE) {
    if (prev === 'whip') {
      const p = prog(g, s.start - WHIP, WHIP * 2, EASE.stroke);
      y = mix(p, VIDEO.height, 0);
      blur = Math.sin(p * Math.PI) * 26;
      if (g < s.start - WHIP) visible = false;
    } else if (prev === 'sweep') {
      const p = prog(g, s.start - SWEEP, SWEEP * 2, EASE.stroke);
      clip = `inset(0 ${(1 - p) * 100}% 0 0)`;
      if (g < s.start - SWEEP) visible = false;
    } else if (prev === 'cut') {
      if (g < s.start) visible = false;
    } else if (prev === 'dissolve') {
      opacity = prog(g, s.start - 6, 18, EASE.in);
    }
  }
  // salida
  if (g >= s.end - POST) {
    if (next === 'whip') {
      const p = prog(g, s.end - WHIP, WHIP * 2, EASE.stroke);
      y = mix(p, 0, -VIDEO.height);
      blur = Math.sin(p * Math.PI) * 26;
      if (g >= s.end + WHIP) visible = false;
    } else if (next === 'sweep') {
      const p = prog(g, s.end - SWEEP, SWEEP * 2, EASE.stroke);
      clip = `inset(0 0 0 ${p * 100}%)`;
      if (g >= s.end + SWEEP) visible = false;
    } else if (next === 'cut') {
      if (g >= s.end) visible = false;
    } else if (next === 'dissolve') {
      opacity = 1 - prog(g, s.end - 10, 22, EASE.in);
    }
  }
  return {style: {transform: `translateY(${y}px)`, clipPath: clip, opacity}, blur, visible};
};

/** Trazo de luz vertical que cruza la pantalla en las transiciones 'sweep'. */
const SweepLines: React.FC = () => {
  const g = useCurrentFrame();
  return (
    <>
      {SCENES.filter((s) => TRANSITIONS[s.id] === 'sweep').map((s) => {
        const p = prog(g, s.end - SWEEP, SWEEP * 2, EASE.stroke);
        if (p <= 0 || p >= 1) return null;
        const x = p * VIDEO.width;
        return (
          <svg key={s.id} width={VIDEO.width} height={VIDEO.height} style={{position: 'absolute', inset: 0}}>
            <g opacity={Math.sin(p * Math.PI)}>
              <line x1={x} y1={0} x2={x} y2={VIDEO.height} stroke="#fff" strokeWidth={10} filter="url(#gFar)" opacity={0.6} />
              <line x1={x} y1={0} x2={x} y2={VIDEO.height} stroke="#fff" strokeWidth={4} filter="url(#gNear)" />
              <line x1={x} y1={0} x2={x} y2={VIDEO.height} stroke="#fff" strokeWidth={2.5} />
            </g>
          </svg>
        );
      })}
    </>
  );
};

/** Cortes secos a negro. */
const BlackCuts: React.FC = () => {
  const g = useCurrentFrame();
  const on = BLACK_CUTS.some((c) => g >= c.at && g < c.at + c.dur);
  return on ? <AbsoluteFill style={{backgroundColor: '#000'}} /> : null;
};

const SceneLayer: React.FC<{i: number}> = ({i}) => {
  const frame = useCurrentFrame();
  const s = SCENES[i];
  const g = frame + s.start - PRE;
  const {style, blur, visible} = sceneStyle(g, i);
  const Comp = COMPONENTS[s.id];
  if (!visible) return null;
  const id = `whipblur-${i}`;
  return (
    <AbsoluteFill style={{...style, filter: blur > 0.5 ? `url(#${id})` : undefined}}>
      {blur > 0.5 && (
        <svg width={0} height={0} style={{position: 'absolute'}}>
          <filter id={id} x="-10%" y="-30%" width="120%" height="160%">
            <feGaussianBlur stdDeviation={`0 ${blur}`} />
          </filter>
        </svg>
      )}
      <SceneProvider scene={s}>
        <Comp />
      </SceneProvider>
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => {
  const g = useCurrentFrame();
  const outro = SCENES[SCENES.length - 1];
  const night = prog(g, outro.start - 10, 26, EASE.camera);
  return (
    <AbsoluteFill>
      <Background tintAmount={night} />
      <GlowDefs />
      {SCENES.map((s, i) => (
        <Sequence key={s.id} name={s.id} from={s.start - PRE} durationInFrames={s.end - s.start + PRE + POST} layout="none">
          <SceneLayer i={i} />
        </Sequence>
      ))}
      <SweepLines />
      <BigWordLayer />
      <KineticCaption />
      <FilmGrain />
      <BlackCuts />
      <SoundDesign />
    </AbsoluteFill>
  );
};
