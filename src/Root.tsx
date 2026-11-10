import React from "react";
import { Composition } from "remotion";
import { AlquimiaPowerFloc, VideoProps } from "./Video";
import { CONTACTO, FPS, HEIGHT, TOTAL_SECONDS, WIDTH } from "./config";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PowerFloc-9x16"
      component={AlquimiaPowerFloc}
      durationInFrames={Math.round(TOTAL_SECONDS * FPS)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{ musicSrc: undefined, telefono: CONTACTO.telefono, instagram: CONTACTO.instagram } satisfies VideoProps}
    />
  );
};
