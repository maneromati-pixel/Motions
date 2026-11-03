// ================================================================
//  USUARIO: cambialo acá y se actualiza la pantalla final
// ================================================================
const USUARIO = '@tuusuario';

import React from 'react';
import {AbsoluteFill, Audio, getStaticFiles, Sequence, staticFile} from 'remotion';
import {Fondo, Transicion} from './componentes/Escenario';
import {FPS, GUION} from './guion';
import {Escena01} from './escenas/Escena01';
import {Escena02} from './escenas/Escena02';
import {Escena03} from './escenas/Escena03';
import {Escena04} from './escenas/Escena04';
import {Escena05} from './escenas/Escena05';
import {Escena06} from './escenas/Escena06';
import {Escena07} from './escenas/Escena07';
import {Escena08} from './escenas/Escena08';
import {Escena09} from './escenas/Escena09';
import {Escena10} from './escenas/Escena10';
import {Escena11} from './escenas/Escena11';
import {Escena12} from './escenas/Escena12';

// Componente de cada escena + si tiene fade de entrada / salida.
// La 3 y la 4 son la misma pantalla, así que entre ellas no hay fade.
const ESCENAS: {Componente: React.FC; entrada?: boolean; salida?: boolean}[] = [
  {Componente: Escena01, entrada: false},
  {Componente: Escena02},
  {Componente: Escena03, salida: false},
  {Componente: Escena04, entrada: false},
  {Componente: Escena05},
  {Componente: Escena06},
  {Componente: Escena07},
  {Componente: Escena08},
  {Componente: Escena09},
  {Componente: Escena10},
  {Componente: Escena11},
  {Componente: () => <Escena12 usuario={USUARIO} />, salida: false},
];

const hayMusica = getStaticFiles().some((f) => f.name === 'musica.mp3');

export const Video: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#0A0A0A'}}>
    <Fondo />
    {GUION.map((g, i) => {
      const {Componente, entrada, salida} = ESCENAS[i];
      const desde = Math.round(g.inicio * FPS);
      const duracion = Math.round((g.fin - g.inicio) * FPS);
      return (
        <Sequence key={g.id} from={desde} durationInFrames={duracion} name={`Escena ${g.id}`}>
          <Transicion duracion={duracion} entrada={entrada} salida={salida}>
            <Componente />
          </Transicion>
        </Sequence>
      );
    })}

    {/* VOZ EN OFF: grabala, guardala como public/voz.mp3 y descomentá la línea de abajo */}
    {/* <Audio src={staticFile('voz.mp3')} /> */}

    {hayMusica && <Audio src={staticFile('musica.mp3')} volume={0.15} loop />}
  </AbsoluteFill>
);
