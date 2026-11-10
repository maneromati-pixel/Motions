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
  problema: { from: 4, to: 9 },
  presentacion: { from: 9, to: 14 },
  comoActua: { from: 14, to: 21 },
  beneficios: { from: 21, to: 27 },
  comoSeUsa: { from: 27, to: 34 },
  cierre: { from: 34, to: 38 },
} as const;

export const TOTAL_SECONDS = 38;

/** Fundido cruzado entre escenas (s). */
export const CROSSFADE = 0.4;

/** Transiciones con el trazo de la "M": momento del corte (s) y duración total (s). */
export const M_TRANSITIONS = [
  { at: SCENES.presentacion.from, duration: 1.4 },
  { at: SCENES.beneficios.from, duration: 1.4 },
];

/** Tiempos internos (segundos relativos al inicio de cada escena). */
export const TIMING = {
  comoActua: {
    textos: [0.9, 3.3, 5.3], // "Aglomera" → "El filtro retiene" → "Agua cristalina"
    disolucion: [0.5, 2.0], // el gel se deshace en partículas azules
    floculacion: [1.8, 3.4], // las partículas se agrupan
    retencion: [3.4, 5.0], // los flóculos bajan y el filtro los retiene
  },
  beneficios: { inicio: 0.75, porItem: 1.75 },
  comoSeUsa: { pasos: [0.2, 1.5, 2.8, 4.1], dosis: 4.7, nota: 5.2 },
  cierre: { haz: [0.1, 1.6], titulo: 0.4, tarjeta: 1.9 },
};

export const TEXTS = {
  gancho: "¿Agua turbia aunque filtrás?",
  problema: "Las partículas más finas atraviesan el filtro.",
  producto: "MAK Power Floc Gel",
  productoSub: "Floculación en filtro",
  comoActua: ["Aglomera", "El filtro retiene", "Agua cristalina"],
  beneficios: [
    "Potencia filtros de arena, cuarzo y antracita",
    "No agota el filtro antes de tiempo",
    "Ideal con limpiafondos automático",
  ],
  pasos: [
    "Filtro limpio y en marcha",
    "Destapá la cápsula",
    "Al canasto del skimmer",
    "Filtrado completo",
  ],
  dosis: "1 cápsula = hasta 150.000 L · Una por semana",
  notaAlternativa: "Sin skimmer: canaleta de desborde o canasto de la bomba.",
  cierre: "Transparencia superlativa.",
};

/** Texto de contacto por defecto (editable también como prop `contacto`). */
export const DEFAULT_CONTACT = "[WHATSAPP / @USUARIO]";

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
