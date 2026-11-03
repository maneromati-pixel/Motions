import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Scene01Hook } from "./scenes/Scene01Hook";
import { Scene02Sueldo } from "./scenes/Scene02Sueldo";
import { Scene03Quien } from "./scenes/Scene03Quien";
import { Scene04Radar } from "./scenes/Scene04Radar";
import { Scene05Plan } from "./scenes/Scene05Plan";
import { Scene06Gente } from "./scenes/Scene06Gente";
import { Scene07Piensan } from "./scenes/Scene07Piensan";
import { Scene08Mismo } from "./scenes/Scene08Mismo";
import { Scene09Numeros } from "./scenes/Scene09Numeros";
import { Scene10Curva } from "./scenes/Scene10Curva";
import { Scene11Cierre } from "./scenes/Scene11Cierre";
import { C } from "./theme";
import { SCENES, SceneKey } from "./timing";

const ORDER: [SceneKey, React.FC][] = [
  ["hook", Scene01Hook],
  ["sueldo", Scene02Sueldo],
  ["quien", Scene03Quien],
  ["radar", Scene04Radar],
  ["plan", Scene05Plan],
  ["gente", Scene06Gente],
  ["piensan", Scene07Piensan],
  ["mismo", Scene08Mismo],
  ["numeros", Scene09Numeros],
  ["curva", Scene10Curva],
  ["cierre", Scene11Cierre],
];

/** Sin <Audio>: el video sale mudo (la voz se agrega en edición). */
export const ClientePerfecto: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.paper }}>
    <Series>
      {ORDER.map(([key, Comp]) => (
        <Series.Sequence key={key} durationInFrames={SCENES[key]}>
          <Comp />
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);
