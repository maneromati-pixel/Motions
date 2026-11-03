import React from 'react';
import {Cadena} from '../componentes/Cadena';
import {Titulo} from '../componentes/Titulo';
import {ZonaSegura} from '../componentes/Escenario';

// [8–14s] Lo que hacen todos: COBRO → GASTOS → AHORRO
// Exporto el layout para que la escena 4 arranque exactamente igual.
export const LayoutTodos: React.FC<{
  aparecen: [number, number, number];
  tituloDelay: number;
  inactivoAhorro?: number;
  debajo?: React.ReactNode;
}> = ({aparecen, tituloDelay, inactivoAhorro = 0, debajo}) => (
  <ZonaSegura>
    <Titulo texto="LO QUE HACEN TODOS" delay={tituloDelay} size={40} style={{marginBottom: 80}} />
    <Cadena
      cajas={[
        {texto: 'COBRO', aparece: aparecen[0]},
        {texto: 'GASTOS', aparece: aparecen[1]},
        {texto: 'AHORRO', aparece: aparecen[2], inactivo: inactivoAhorro},
      ]}
    />
    <div style={{height: 190, display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>{debajo}</div>
  </ZonaSegura>
);

export const Escena03: React.FC = () => <LayoutTodos aparecen={[38, 88, 138]} tituloDelay={6} />;
