// ================================================================
//  USUARIO: cambialo acá y se actualiza la pantalla final
// ================================================================
const USUARIO = '@zerum00';

import React from 'react';
import {AbsoluteFill, Audio, getStaticFiles, interpolate, Sequence, staticFile} from 'remotion';
import {Fondo, Transicion} from './componentes/Escenario';
import {LINEA, TOTAL_FRAMES} from './guion';
import {EscalaTiempo} from './tiempo';
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

const MUSICA_DESDE_SEG = 8; // segundo del tema desde donde arranca
const MUSICA_VOLUMEN = 0.1;

const hayMusica = getStaticFiles().some((f) => f.name === 'musica.mp3');

export const Video: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#0A0A0A'}}>
    <Fondo />
    {LINEA.map((g, i) => {
      const {Componente, entrada, salida} = ESCENAS[i];
      return (
        <Sequence key={g.id} from={g.desdeF} durationInFrames={g.frames} name={`Escena ${g.id}`}>
          <Transicion duracion={g.frames} entrada={entrada} salida={salida}>
            <EscalaTiempo.Provider value={g.escala}>
              <Componente />
            </EscalaTiempo.Provider>
          </Transicion>
        </Sequence>
      );
    })}

    {/* VOZ EN OFF: public/voz.mp3 se arma con `npm run voz` a partir de audio/voz-original.mp3 */}
    <Audio src={staticFile('voz.mp3')} />

    {/* Música de fondo: arranca desde el segundo 8 del tema, volumen 0.10, con fade de entrada y de salida */}
    {hayMusica && (
      <Audio
        src={staticFile('musica.mp3')}
        trimBefore={MUSICA_DESDE_SEG * 30}
        loop
        volume={(f) =>
          MUSICA_VOLUMEN *
          interpolate(f, [0, 15, TOTAL_FRAMES - 45, TOTAL_FRAMES - 1], [0, 1, 1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        }
      />
    )}
  </AbsoluteFill>
);
