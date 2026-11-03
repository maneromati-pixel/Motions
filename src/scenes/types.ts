export type SceneProps = {
  /** Duración de la escena en frames */
  duration: number;
  /** Momentos clave (frames relativos al inicio de la escena), detectados en la voz */
  cues: Record<string, number>;
};
