import React from "react";
import { useCurrentFrame } from "remotion";
import { Scene } from "../components/Scene";
import { SearchPill } from "../components/SearchPill";
import { Text } from "../components/Text";
import { enter, pop } from "../theme";
import { BEATS, SCENES } from "../timing";

const B = BEATS.cierre;
const HANDLE = "@zerum00";

export const Scene11Cierre: React.FC = () => {
  const frame = useCurrentFrame();
  const t = enter(frame, B.title);
  const pill = pop(frame, B.pill);
  const chars = Math.max(0, Math.min(HANDLE.length, Math.floor((frame - B.typeStart) / B.typeSpeed) + 1));
  const typed = frame < B.typeStart ? "" : HANDLE.slice(0, chars);
  const typing = frame >= B.typeStart && chars < HANDLE.length;
  const cursorOn = typing || Math.floor(frame / 15) % 2 === 0;
  return (
    <Scene duration={SCENES.cierre} fadeIn fadeOut={false}>
      <Text variant="title" y={600} size={56} glow style={{ opacity: t.opacity, transform: t.transform, fontWeight: 600 }}>
        SÍGUEME
      </Text>
      <div style={{ position: "absolute", left: 540 - 330, top: 740, opacity: pill.opacity, transform: pill.transform }}>
        <SearchPill text={typed} cursor={cursorOn} width={660} />
      </div>
    </Scene>
  );
};
