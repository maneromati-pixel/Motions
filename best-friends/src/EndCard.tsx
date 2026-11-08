import React from "react";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/fonts";

loadFont({ family: "Space Mono", url: staticFile("SpaceMono-Bold.woff2"), weight: "700" });

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

const NOTE =
  "M25 5 h7 c0.6 4.6 3.9 8 8.6 8.4 v7.2 c-3.2 0.1 -6.2 -0.9 -8.6 -2.6 V31 a10.5 10.5 0 1 1 -10.5 -10.5 c0.6 0 1.2 0.05 1.8 0.15 v7.4 a3.4 3.4 0 1 0 1.7 2.95 Z";

const TikTokIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path d={NOTE} fill="#25f4ee" transform="translate(-1.6 -1.6)" />
    <path d={NOTE} fill="#fe2c55" transform="translate(1.6 1.6)" />
    <path d={NOTE} fill="#ffffff" />
  </svg>
);

/** Closing card: "SEGUINOS" + TikTok handle. Lives inside a <Sequence>, so frame 0 = card start. */
export const EndCard: React.FC<{ handle: string }> = ({ handle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const typed = Math.floor(interpolate(frame, [0.5 * fps, 1.2 * fps], [0, handle.length], clamp));
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Silkscreen",
        textAlign: "center",
        gap: 46,
      }}
    >
      <div
        style={{
          fontSize: 64,
          letterSpacing: 10,
          color: "#a9a8ae",
          opacity: interpolate(frame, [0, 0.4 * fps], [0, 1], clamp),
          translate: interpolate(frame, [0, 0.5 * fps], ["0px 30px", "0px 0px"], { ...clamp, easing: ease }),
        }}
      >
        SEGUINOS
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 30,
          opacity: interpolate(frame, [0.3 * fps, 0.7 * fps], [0, 1], clamp),
          scale: interpolate(frame, [0.3 * fps, 0.8 * fps], [0.85, 1], { ...clamp, easing: ease }),
        }}
      >
        <TikTokIcon size={104} />
        <div style={{ fontFamily: "Space Mono", fontSize: 84, fontWeight: 700, letterSpacing: 2, color: "#ffffff" }}>
          {handle.split("").map((ch, i) => (
            <span key={i} style={{ opacity: i < typed ? 1 : 0 }}>
              {ch}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
