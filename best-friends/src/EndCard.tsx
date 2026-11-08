import React from "react";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/fonts";

loadFont({ family: "Space Mono", url: staticFile("SpaceMono-Bold.woff2"), weight: "700" });

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

const InstagramIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x={4} y={4} width={40} height={40} rx={12} stroke="#ffffff" strokeWidth={4} />
    <circle cx={24} cy={24} r={9} stroke="#ffffff" strokeWidth={4} />
    <circle cx={35} cy={13} r={2.6} fill="#d9232c" />
  </svg>
);

/** Closing card: "SEGUINOS" + Instagram handle. Lives inside a <Sequence>, so frame 0 = card start. */
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
        <InstagramIcon size={104} />
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
