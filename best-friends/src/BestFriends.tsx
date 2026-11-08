import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { Scene } from "./Scene";
import { Overlay } from "./Overlay";
import { Fade } from "./Fade";
import { EndCard } from "./EndCard";

export const BestFriends: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#111012" }}>
      <Scene />
      <Overlay />
      <Fade />
      <Sequence from={14 * fps} name="TikTok">
        <EndCard handle="@zerum00" />
      </Sequence>
      <Audio
        src={staticFile("cancion.mp3")}
        trimBefore={7 * fps}
        volume={(f) =>
          interpolate(f, [0, 0.3 * fps, durationInFrames - 1 * fps, durationInFrames], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
    </AbsoluteFill>
  );
};
