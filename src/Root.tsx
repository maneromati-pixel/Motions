import React from "react";
import { Composition } from "remotion";
import { AlquimiaPowerFloc, VideoProps } from "./Video";
import { DEFAULT_CONTACT, FPS, HEIGHT, TOTAL_SECONDS, WIDTH } from "./config";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PowerFloc-9x16"
      component={AlquimiaPowerFloc}
      durationInFrames={TOTAL_SECONDS * FPS}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{ musicSrc: undefined, contacto: DEFAULT_CONTACT } satisfies VideoProps}
    />
  );
};
