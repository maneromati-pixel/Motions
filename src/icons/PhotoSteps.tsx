import React from "react";
import { Img, staticFile } from "remotion";
import { COLORS } from "../config";
import { MaterialDefs } from "../components/Materials";
import { RealObject } from "../components/RealObject";
import { easeInOut } from "../components/anim";
import { IconProps } from "./LineIcons";

/**
 * Pasos 2 y 3 con las fotos reales del producto (cápsula y disco de gel),
 * con la misma interfaz que los íconos de línea.
 */

/** ② Destapá la cápsula: la tapa de aluminio se despega en 3D y deja ver el gel. */
export const StepDestapar: React.FC<IconProps> = ({ draw, anim, frame, size = 480 }) => {
  const a = easeInOut(anim);
  const capW = size * 0.98;
  const gelW = capW * 0.95; // disco de gel visible bajo la tapa
  return (
    <div style={{ position: "relative", width: size, height: size, opacity: draw }}>
      {/* el gel azul aparece debajo de la tapa */}
      <RealObject
        kind="gel"
        width={gelW}
        x={size / 2 + 4}
        y={size / 2 + 14}
        tiltX={20}
        tiltY={-6}
        sheen={a > 0.4 ? (a - 0.4) / 0.6 : -1}
        opacity={0.4 + 0.6 * a}
        contact={0.8}
      />
      {/* tapa de aluminio: bisagra arriba, se levanta hacia atrás */}
      <div
        style={{
          position: "absolute",
          inset: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "50% 20%",
            transform: `translate(${a * 130}px, ${-a * 55}px) rotate(${a * 18}deg) scaleY(${1 - a * 0.45}) skewX(${-a * 8}deg)`,
            opacity: 1 - Math.max(0, a - 0.8) * 3,
          }}
        >
          <RealObject
            kind="capsula"
            width={capW}
            x={size / 2}
            y={size / 2}
            rotate={-6 + Math.sin(frame / 28) * 1.5}
            sheen={Math.min(1, anim * 1.6)}
            contact={1 - a}
          />
        </div>
      </div>
    </div>
  );
};

/** ③ Al canasto del skimmer: el gel cae dentro de una canasta con volumen. */
export const StepSkimmer: React.FC<IconProps> = ({ draw, anim, size = 480 }) => {
  const a = easeInOut(anim);
  const k = size / 400;
  const gelW = 210 * k;
  const gelY = (40 + a * 210) * k; // centro del gel
  const rimY = 215;
  const back = (
    <svg width={size} height={size} viewBox="0 0 400 400" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <MaterialDefs />
      {/* agua del skimmer detrás */}
      <ellipse cx={200} cy={rimY} rx={130} ry={24} fill="#1E0204" opacity={0.35 * draw} />
      <path d="M95,215 L120,355 Q122,365 132,365 L268,365 Q278,365 280,355 L305,215 Z" fill="url(#glass)" opacity={draw} />
      <path d="M95,215 L120,355 Q122,365 132,365 L268,365 Q278,365 280,355 L305,215 Z" fill="#2A0507" opacity={0.25 * draw} />
    </svg>
  );
  const front = (
    <svg width={size} height={size} viewBox="0 0 400 400" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <MaterialDefs />
      <g filter="url(#drop)" opacity={draw}>
        {/* rejilla de la canasta */}
        {[130, 165, 200, 235, 270].map((x) => (
          <line key={x} x1={x} y1={222} x2={x - (x - 200) * 0.12} y2={358} stroke={COLORS.crema} strokeOpacity={0.4} strokeWidth={3} />
        ))}
        {[255, 295, 335].map((y) => {
          const inset = ((y - 215) / 150) * 25;
          return <line key={y} x1={95 + inset} y1={y} x2={305 - inset} y2={y} stroke={COLORS.crema} strokeOpacity={0.4} strokeWidth={3} />;
        })}
        <path d="M95,215 L120,355 Q122,365 132,365 L268,365 Q278,365 280,355 L305,215" fill="none" stroke={COLORS.crema} strokeOpacity={0.9} strokeWidth={7} strokeLinejoin="round" />
        {/* aro frontal con volumen */}
        <ellipse cx={200} cy={rimY} rx={132} ry={24} fill="none" stroke={COLORS.crema} strokeOpacity={0.9} strokeWidth={7} />
        <path d="M80,212 Q200,250 320,212" fill="none" stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={4} />
      </g>
    </svg>
  );
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {back}
      {/* disco de gel cayendo, en perspectiva */}
      <div style={{ position: "absolute", inset: 0, perspective: 900 }}>
        <Img
          src={staticFile("img/gel.png")}
          style={{
            position: "absolute",
            width: gelW,
            left: size / 2 - gelW / 2,
            top: gelY - (gelW * 590) / 565 / 2,
            transform: `rotateX(${30 + a * 30}deg) rotate(${(1 - a) * -18}deg)`,
            opacity: draw,
          }}
        />
      </div>
      {front}
    </div>
  );
};
