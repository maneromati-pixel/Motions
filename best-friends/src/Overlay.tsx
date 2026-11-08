import React from "react";
import { Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import { T } from "./timing";

const fontFamily = "Silkscreen";
loadFont({ family: fontFamily, url: staticFile("Silkscreen-Regular.woff2"), weight: "400" });
loadFont({ family: fontFamily, url: staticFile("Silkscreen-Bold.woff2"), weight: "700" });

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Typewriter: React.FC<{ lines: string[]; range: readonly [number, number]; style?: React.CSSProperties }> = ({
  lines,
  range,
  style,
}) => {
  const frame = useCurrentFrame();
  const total = lines.join("").length;
  const shown = Math.floor(interpolate(frame, range as unknown as number[], [0, total], clamp));
  let used = 0;
  return (
    <div style={style}>
      {lines.map((line, i) => {
        const visible = Math.max(0, Math.min(line.length, shown - used));
        used += line.length;
        return (
          <div key={i}>
            {line.split("").map((ch, j) => (
              <span key={j} style={{ opacity: j < visible ? 1 : 0 }}>
                {ch}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};

const ageAt = (frame: number) => {
  if (frame < T.age2[0]) {
    return interpolate(frame, T.age1 as unknown as number[], [18, 30], {
      ...clamp,
      easing: Easing.inOut(Easing.sin),
    });
  }
  return interpolate(frame, T.age2 as unknown as number[], [30, 70], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
};

/** One digit slot that rolls upward when the digit changes. */
const Digit: React.FC<{ from: string; to: string; p: number }> = ({ from, to, p }) => {
  if (from === to || p <= 0) {
    return <span style={{ display: "inline-block", width: "1ch" }}>{from}</span>;
  }
  return (
    <span
      style={{
        display: "inline-block",
        width: "1ch",
        height: "1.1em",
        overflow: "hidden",
        verticalAlign: "bottom",
        position: "relative",
      }}
    >
      <span style={{ position: "absolute", left: 0, top: 0, translate: `0 ${-p * 110}%`, opacity: 1 - p }}>
        {from}
      </span>
      <span style={{ position: "absolute", left: 0, top: 0, translate: `0 ${(1 - p) * 110}%`, opacity: p }}>
        {to}
      </span>
    </span>
  );
};

const AgeCounter: React.FC = () => {
  const frame = useCurrentFrame();
  const v = ageAt(frame);
  const n = Math.floor(v);
  const p = interpolate(v - n, [0.55, 1], [0, 1], clamp);
  const cur = String(n).padStart(2, "0");
  const next = String(Math.min(70, n + 1)).padStart(2, "0");
  return (
    <div style={{ fontSize: 72, letterSpacing: 6, display: "flex", justifyContent: "center", gap: 26 }}>
      <span style={{ color: "#a9a8ae" }}>AGE</span>
      <span style={{ color: "#ffffff", fontWeight: 700 }}>
        <Digit from={cur[0]} to={next[0]} p={p} />
        <Digit from={cur[1]} to={next[1]} p={p} />
      </span>
    </div>
  );
};

export const Overlay: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 250,
        left: 70,
        right: 70,
        fontFamily,
        textAlign: "center",
        color: "#f2f2f2",
        textShadow: "0 0 24px rgba(0,0,0,0.9)",
      }}
    >
      <Typewriter
        lines={["AT 18, YOU HAVE", "10 BEST FRIENDS."]}
        range={T.text1}
        style={{
          fontSize: 54,
          letterSpacing: 5,
          lineHeight: 1.25,
          opacity: interpolate(frame, [T.text2[0], T.text2[0] + 15], [1, 0.5], clamp),
        }}
      />
      <Typewriter
        lines={["AT 30, YOU HAVE", "THE ONE WHO STAYED."]}
        range={T.text2}
        style={{ fontSize: 54, letterSpacing: 5, lineHeight: 1.25, marginTop: 18, minHeight: 136 }}
      />
      <div style={{ marginTop: 34 }}>
        <AgeCounter />
      </div>
    </div>
  );
};
