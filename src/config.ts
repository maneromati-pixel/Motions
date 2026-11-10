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
  problema: { from: 4, to: 11 },
  presentacion: { from: 11, to: 16 },
  comoActua: { from: 16, to: 26 },
  beneficios: { from: 26, to: 35 },
  comoSeUsa: { from: 35, to: 46 },
  cierre: { from: 46, to: 51.5 },
} as const;

export const TOTAL_SECONDS = 51.5;

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
    textos: [1.2, 4.9, 8.0], // "Aglomera" → "El filtro retiene" → "Agua cristalina"
    disolucion: [0.8, 3.0], // el gel se deshace en partículas azules
    floculacion: [2.8, 5.0], // las partículas se agrupan
    retencion: [5.2, 7.6], // los flóculos bajan y el filtro los retiene
  },
  /** duración de la animación de dibujo/acción de cada ícono (s) */
  iconos: { dibujo: 0.9, accion: [0.4, 1.4] },
  beneficios: { inicio: 0.75, porItem: 2.75 },
  comoSeUsa: { pasos: [0.3, 2.3, 4.3, 6.3], dosis: 7.3, nota: 8.1 },
  gancho: { estallido: [0, 0.7], palabras: 0.15, entrePalabras: 0.12, golpe: 2.2 },
  presentacion: { solucion: 0.15 },
  cierre: { haz: [0.1, 1.6], titulo: 0.4, tarjeta: 1.9, eslogan: 2.5, contacto: 3.1 },
};

export const TEXTS = {
  /** Hook en dos líneas; la palabra destacada ondula como agua turbia. */
  gancho: ["¿El agua de tu pileta", "está turbia?"],
  ganchoDestacada: "turbia?",
  solucion: "Tenemos la solución",
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
  /** Eslogan de Alquimia */
  eslogan: "Tenemos lo que necesitás",
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
