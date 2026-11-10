/**
 * Configuración única del video: tiempos, textos, contacto y paleta.
 * Todos los tiempos están en segundos y se convierten a frames con `s()`.
 */
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const s = (seconds: number) => Math.round(seconds * FPS);

/** Escenas: inicio y fin en segundos. */
export const SCENES = {
  gancho: { from: 0, to: 4 },
  presentacion: { from: 4, to: 9 },
  comoActua: { from: 9, to: 20 },
  beneficios: { from: 20, to: 24 },
  comoSeUsa: { from: 24, to: 35 },
  cierre: { from: 35, to: 41.5 },
} as const;

export const TOTAL_SECONDS = 41.5;

/** Fundido cruzado entre escenas (s). */
export const CROSSFADE = 0.4;

/**
 * Transiciones entre escenas: momento del corte (s), duración total (s) y tipo.
 * - "ola": una ola de agua cruza la pantalla de abajo hacia arriba
 * - "reflejo": un haz de luz refractada por el agua cruza en diagonal y tapa el corte
 * - "trazoM": el trazo de la "M" del logo (firma de marca)
 */
export type TransitionType = "ola" | "reflejo" | "trazoM";
export const TRANSITIONS: { at: number; duration: number; tipo: TransitionType }[] = [
  { at: SCENES.presentacion.from, duration: 1.3, tipo: "ola" },
  { at: SCENES.comoActua.from, duration: 1.2, tipo: "reflejo" },
  { at: SCENES.beneficios.from, duration: 1.3, tipo: "ola" },
  { at: SCENES.comoSeUsa.from, duration: 1.2, tipo: "reflejo" },
  { at: SCENES.cierre.from, duration: 1.4, tipo: "trazoM" },
];

/** Sonidos sutiles de cada tipo de transición (archivos en public/sfx, generados con scripts/sfx.py). */
export const SFX: Record<TransitionType, string> = {
  ola: "sfx/ola.wav",
  reflejo: "sfx/reflejo.wav",
  trazoM: "sfx/trazo_m.wav",
};
/** Volumen de los efectos (0–1). */
export const SFX_VOLUME = 0.55;

/** Tiempos internos (segundos relativos al inicio de cada escena). */
export const TIMING = {
  comoActua: {
    textos: [1.2, 4.9, 8.0], // "Aglomera" → "El filtro retiene" → "Agua cristalina"
    disolucion: [0.8, 3.0], // el gel se deshace en partículas azules
    floculacion: [2.8, 5.0], // las partículas se agrupan
    retencion: [5.2, 7.6], // los flóculos bajan y el filtro los retiene
    pileta: 7.9, // entra la pileta con agua cristalina
  },
  /** duración de la animación de dibujo/acción de cada ícono (s) */
  iconos: { dibujo: 0.9, accion: [0.4, 1.4] },
  beneficios: { inicio: 0.75, porItem: 2.75 },
  comoSeUsa: { pasos: [0.3, 2.3, 4.3, 6.3], dosis: 7.3, nota: 8.1 },
  gancho: { estallido: [0, 0.7], palabras: 0.15, entrePalabras: 0.12, golpe: 2.2 },
  presentacion: { solucion: 0.15 },
  cierre: { haz: [0.1, 1.5], tarjeta: 0.5, eslogan: 1.2, contacto: [1.9, 2.3, 2.7] },
};

export const TEXTS = {
  /** Hook en dos líneas; la palabra destacada ondula como agua turbia. */
  gancho: ["¿El agua de tu pileta", "está turbia?"],
  ganchoDestacada: "turbia?",
  solucion: "Tranqui, tenemos la solución",
  producto: "MAK Power Floc Gel",
  productoSub: "Clarificador en gel",
  comoActua: ["Junta la suciedad", "El filtro la atrapa", "¡Y queda cristalina!"],
  beneficios: [
    "Tu filtro no se gasta antes de tiempo",
  ],
  pasos: [
    "Filtro limpio y prendido",
    "Destapá la cápsula",
    "Ponela en el canasto del skimmer",
    "Dejá filtrar un ciclo completo",
  ],
  dosis: "1 cápsula rinde hasta 150.000 L · Una por semana y listo",
  notaAlternativa: "¿No tenés skimmer? Va en la canaleta de desborde o en el canasto de la bomba.",
  /** Eslogan de Alquimia */
  eslogan: "Tenemos lo que necesitás",
  contactoLlamado: "Contactanos al",
  contactoLocal: "o pasate por el local",
};

/** Datos de contacto del cierre (editables también como props `telefono` e `instagram`). */
export const CONTACTO = {
  telefono: "3364 51-9437",
  instagram: "@alquimia583",
};

/** Paleta cerrada (muestreada de los assets). */
export const COLORS = {
  // bordó de fondo.jpg (percentiles de luminancia 5 / 50 / 95)
  bordoOscuro: "#531113",
  bordo: "#6B1D20",
  bordoClaro: "#973A3A",
  // textos
  crema: "#FAF4EB",
  blanco: "#FFFFFF",
  // azul del producto: disco de gel / tapa de aluminio
  azulGel: "#018CC7",
  azulTapa: "#2949A4",
  // rojo de los puntos del logo (solo detalles)
  rojo: "#DB1631",
  // azul del trazo "M" del logo
  azulLogo: "#0088DD",
  // partículas de suciedad
  gris: "#B3A9A6",
};

export const FONT = "Montserrat";
