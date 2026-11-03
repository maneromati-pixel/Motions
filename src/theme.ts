import { loadFont } from "@remotion/fonts";
import { Easing, interpolate } from "remotion";
import { INTER_WOFF2 } from "./fonts.generated";
import { ENTER } from "./timing";

/**
 * Inter (Google Fonts), subset latin, pesos 500/600/800, descargada de fonts.gstatic.com
 * (public/fonts) y embebida en src/fonts.generated.ts. loadFont usa delayRender, así que
 * ningún frame —incluido el 0— se captura antes de que la tipografía esté lista.
 */
export const fontFamily = "Inter";
for (const weight of ["500", "600", "800"]) {
  loadFont({
    family: fontFamily,
    url: INTER_WOFF2[weight],
    weight,
    format: "woff2",
  });
}

export const C = {
  bg: "#0A0A0A",
  bgCenter: "#151515",
  bgEdge: "#050505",
  white: "#FFFFFF",
  gray: "#8A8A8A",
  dim: "#3A3A3A",
  black: "#000000",
  nightTop: "#0B1020",
  nightBottom: "#141B33",
};

export const GLOW =
  "drop-shadow(0 0 8px rgba(255,255,255,.6)) drop-shadow(0 0 20px rgba(255,255,255,.25))";

/** Zona segura: TikTok tapa ~140px a la derecha y ~400px abajo. */
export const SAFE = {
  right: 140,
  bottom: 400,
  /** Ancho máximo para contenido centrado en x=540 sin invadir el borde derecho. */
  maxCenteredWidth: 800,
  titleY: 230,
};

export const ease = Easing.out(Easing.cubic);

export const type = {
  title: {
    fontFamily,
    fontWeight: 500,
    fontSize: 34,
    letterSpacing: "0.35em",
    textTransform: "uppercase" as const,
  },
  label: {
    fontFamily,
    fontWeight: 600,
    fontSize: 30,
    letterSpacing: "0.3em",
    textTransform: "uppercase" as const,
  },
  figure: {
    fontFamily,
    fontWeight: 800,
    fontSize: 120,
    letterSpacing: "normal",
  },
  micro: {
    fontFamily,
    fontWeight: 500,
    fontSize: 20,
    letterSpacing: "0.3em",
    textTransform: "uppercase" as const,
    color: C.gray,
  },
};

/** Fade + subida de 20px con Easing.out(cubic). */
export const enter = (
  frame: number,
  start: number,
  dur: number = ENTER,
  rise = 20,
) => {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return { opacity: p, transform: `translateY(${(1 - p) * rise}px)`, p };
};

/** Fade + escala 0.9 → 1. */
export const pop = (frame: number, start: number, dur: number = ENTER) => {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return { opacity: p, transform: `scale(${0.9 + 0.1 * p})`, p };
};

export const progress = (
  frame: number,
  start: number,
  end: number,
  easing: (t: number) => number = ease,
) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Formato argentino: punto de miles. */
export const ars = (n: number) =>
  "$" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
