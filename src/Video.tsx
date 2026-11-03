import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Scene01Hook } from "./scenes/Scene01Hook";
import { Scene02Sueldo } from "./scenes/Scene02Sueldo";
import { Scene03Quien } from "./scenes/Scene03Quien";
import { Scene04Plan } from "./scenes/Scene04Plan";
import { Scene05Vaso } from "./scenes/Scene05Vaso";
import { Scene06Pocos } from "./scenes/Scene06Pocos";
import { Scene07Mismo } from "./scenes/Scene07Mismo";
import { Scene08Numeros } from "./scenes/Scene08Numeros";
import { Scene09Curva } from "./scenes/Scene09Curva";
import { Scene10Cierre } from "./scenes/Scene10Cierre";
import { SCENES } from "./timing";

/** Sin <Audio>: el video sale mudo (la voz se agrega en edición). */
export const ClientePerfecto: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Series>
      <Series.Sequence durationInFrames={SCENES.hook}><Scene01Hook /></Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.sueldo}><Scene02Sueldo /></Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.quien}><Scene03Quien /></Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.plan}><Scene04Plan /></Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.vaso}><Scene05Vaso /></Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.pocos}><Scene06Pocos /></Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.mismo}><Scene07Mismo /></Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.numeros}><Scene08Numeros /></Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.curva}><Scene09Curva /></Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.cierre}><Scene10Cierre /></Series.Sequence>
    </Series>
  </AbsoluteFill>
);
