import React from "react";
import { Img, staticFile } from "remotion";

/** Datos de los recortes (scripts/cutouts.py): lienzo con sombra y objeto sin sombra (padding 90 px). */
export const OBJECTS = {
  capsula: { src: "img/capsula.png", mask: "img/capsula_noshadow.png", w: 635, h: 627, ow: 455, oh: 447 },
  gel: { src: "img/gel.png", mask: "img/gel_noshadow.png", w: 565, h: 590, ow: 385, oh: 410 },
} as const;

type Props = {
  kind: keyof typeof OBJECTS;
  /** ancho en pantalla del lienzo (incluye sombra) */
  width: number;
  /** posición del centro */
  x: number;
  y: number;
  /** 0–1: recorrido del reflejo de luz sobre la superficie */
  sheen?: number;
  /** inclinación 3D en grados */
  tiltX?: number;
  tiltY?: number;
  rotate?: number;
  scale?: number;
  opacity?: number;
  /** sombra de contacto debajo del objeto (0–1) */
  contact?: number;
  style?: React.CSSProperties;
};

/**
 * Producto fotográfico con tratamiento realista: perspectiva 3D, sombra de contacto,
 * reflejo especular que recorre la superficie (enmascarado con la silueta) y leve viñeteo de borde.
 */
export const RealObject: React.FC<Props> = ({
  kind,
  width,
  x,
  y,
  sheen = -1,
  tiltX = 0,
  tiltY = 0,
  rotate = 0,
  scale = 1,
  opacity = 1,
  contact = 1,
  style,
}) => {
  const o = OBJECTS[kind];
  const k = width / o.w;
  const height = o.h * k;
  const maskUrl = `url(${staticFile(o.mask)})`;
  const maskSize = `${(o.ow / o.w) * 100}% ${(o.oh / o.h) * 100}%`;
  const maskStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    maskImage: maskUrl,
    WebkitMaskImage: maskUrl,
    maskSize,
    WebkitMaskSize: maskSize,
    maskPosition: "center",
    WebkitMaskPosition: "center",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
  };
  const sheenPos = -60 + sheen * 220; // % del recorrido

  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y - height / 2,
        width,
        height,
        opacity,
        perspective: 1400,
        ...style,
      }}
    >
      {/* sombra de contacto: elipse difusa apoyada debajo */}
      <div
        style={{
          position: "absolute",
          left: "22%",
          right: "16%",
          top: "74%",
          height: "16%",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(25,2,4,0.55) 0%, rgba(25,2,4,0) 70%)",
          filter: "blur(10px)",
          opacity: contact,
          transform: `scale(${scale})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotate(${rotate}deg) scale(${scale})`,
          transformStyle: "preserve-3d",
        }}
      >
        <Img src={staticFile(o.src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        {/* sombreado de volumen: luz arriba-izquierda, borde inferior-derecho más oscuro */}
        <div
          style={{
            ...maskStyle,
            background:
              "radial-gradient(ellipse 75% 75% at 35% 30%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 55%, rgba(20,0,10,0.28) 100%)",
            mixBlendMode: "multiply",
          }}
        />
        {/* reflejo especular que recorre la superficie */}
        {sheen >= 0 && (
          <div
            style={{
              ...maskStyle,
              background: `linear-gradient(115deg, rgba(255,255,255,0) ${sheenPos - 14}%, rgba(255,255,255,0.55) ${sheenPos}%, rgba(255,255,255,0) ${sheenPos + 14}%)`,
              mixBlendMode: "screen",
            }}
          />
        )}
      </div>
    </div>
  );
};
