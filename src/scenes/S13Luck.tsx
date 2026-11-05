/**
 * Escena 13 — "MALA SUERTE": una moneda gira en el aire (motion blur real),
 * queda flotando un instante como en cámara lenta, cae y se queda de canto.
 */
import React from 'react';
import {Camera, Stage} from '../components/Camera';
import {LineDraw} from '../components/LineDraw';
import {MotionBlur} from '../components/MotionBlur';
import {TopLabel} from '../components/TopLabel';
import {useScene} from '../components/SceneContext';
import {breathe, drawGlow, drift, mix, prog} from '../lib/anim';
import {CUES} from '../timings';
import {EASE} from '../theme';

export const COIN = {x: 520, y: 800, r: 90};
const GROUND = 1050;
const EDGE = 14;

const useCoinState = () => {
  const {t, L} = useScene();
  const flip = L(CUES.coinFlip);
  const land = L(CUES.coinLand) - 12;
  const top = 540;
  const fallStart = land - 22;
  // altura
  let y = COIN.y;
  if (t >= flip && t < fallStart) {
    const up = prog(t, flip, 18, EASE.in);
    y = mix(up, COIN.y, top) + drift(t, 10, 70) * up;
  } else if (t >= fallStart) {
    const fp = Math.min(1, (t - fallStart) / (land - fallStart));
    y = mix(fp * fp, top + drift(fallStart, 10, 70), GROUND - COIN.r);
  }
  // giro: rápido al lanzarse, "cámara lenta" arriba, rápido al caer
  const spinSpeed = (tt: number) =>
    tt < flip ? 0 : tt < flip + 18 ? 38 : tt < fallStart ? mix(prog(tt, flip + 18, 20, EASE.in), 38, 9) : 26;
  let raw = 0;
  for (let i = Math.ceil(flip); i <= Math.min(t, land); i++) raw += spinSpeed(i);
  raw += Math.max(0, Math.min(t, land) - Math.floor(Math.min(t, land))) * spinSpeed(t);
  let rawLand = 0;
  for (let i = Math.ceil(flip); i <= land; i++) rawLand += spinSpeed(i);
  const target = 90 + Math.ceil((rawLand - 90) / 360) * 360;
  let theta = raw + (target - rawLand) * prog(t, fallStart, land - fallStart, EASE.stroke);
  // al tocar el piso: tambalea y se queda quieta de canto
  if (t > land) {
    const k = t - land;
    theta = target + 14 * Math.exp(-k / 6) * Math.sin(k / 1.6);
  }
  return {t, y, theta, land, flip};
};

/** La moneda (lee el frame adentro → motion blur por sub-frames). */
const Coin: React.FC = () => {
  const {t, y, theta} = useCoinState();
  const rad = (theta * Math.PI) / 180;
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  const rx = Math.max(0.5, COIN.r * Math.abs(c));
  const off = EDGE * s;
  const k = breathe(t, 0.01, 80);
  const ell = (dx: number, rrx: number, ry: number) =>
    `M ${COIN.x + dx} ${y - ry} A ${rrx} ${ry} 0 1 1 ${COIN.x + dx - 0.01} ${y - ry}`;
  // aparece cuando llega el reloj de LA VIDA (morph de la escena 12)
  const ring = {p: t >= 11 ? 1 : 0, g: 1};
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <g transform={`translate(${COIN.x} ${y}) scale(${k}) translate(${-COIN.x} ${-y})`}>
        {/* canto: segunda cara desplazada + líneas de unión */}
        <LineDraw d={ell(off, rx, COIN.r)} p={ring.p} g={0.4} width={3} opacity={0.5 + 0.5 * Math.abs(s)} />
        <LineDraw d={`M ${COIN.x} ${y - COIN.r} L ${COIN.x + off} ${y - COIN.r} M ${COIN.x} ${y + COIN.r} L ${COIN.x + off} ${y + COIN.r}`} p={ring.p} g={0.4} width={3} opacity={Math.abs(s)} />
        <LineDraw d={ell(0, rx, COIN.r)} p={ring.p} g={ring.g} />
        <LineDraw d={ell(0, rx * 0.68, COIN.r * 0.68)} p={ring.p} g={ring.g * 0.4} width={2.5} opacity={0.65 * Math.abs(c)} />
      </g>
    </svg>
  );
};

export const S13Luck: React.FC = () => {
  const {t, y, land} = useCoinState();
  const ground = drawGlow(t, 10, 24);
  const h = Math.max(0, GROUND - COIN.r - y);
  const shadowW = mix(Math.min(1, h / 500), 80, 30);
  const impact = prog(t, land, 14, EASE.in) * (1 - prog(t, land + 10, 16, EASE.out));
  return (
    <Camera
      punch={0.02 * prog(t, land - 2, 12, EASE.in)}
      art={
        <>
          <Stage>
            <LineDraw d={`M 280 ${GROUND} H 760`} from="center" p={ground.p} g={ground.g * 0.6} width={3} opacity={0.7} />
            <ellipse cx={COIN.x} cy={GROUND + 10} rx={shadowW} ry={5} fill="none" stroke="#fff" strokeWidth={2} opacity={0.2 * ground.p} />
            {impact > 0 && (
              <>
                <LineDraw d={`M ${COIN.x - 30} ${GROUND - 6} l -36 -14`} g={1} width={2.5} opacity={impact} />
                <LineDraw d={`M ${COIN.x + 30} ${GROUND - 6} l 36 -14`} g={1} width={2.5} opacity={impact} />
              </>
            )}
          </Stage>
          <MotionBlur samples={10} shutter={220}>
            <Coin />
          </MotionBlur>
        </>
      }
      text={<TopLabel text="MALA SUERTE" delay={2} />}
    />
  );
};
