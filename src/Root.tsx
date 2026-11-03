import React from "react";
import { Composition } from "remotion";
import { ClientePerfecto } from "./Video";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./timing";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="ClientePerfecto"
    component={ClientePerfecto}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
