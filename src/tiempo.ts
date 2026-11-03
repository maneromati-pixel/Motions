import {createContext, useContext} from 'react';
import {useCurrentFrame} from 'remotion';

// Las escenas se diseñaron para una duración y se ajustan a la de la voz:
// este frame "escalado" acelera o frena todas sus animaciones proporcionalmente.
export const EscalaTiempo = createContext(1);

export const useTiempo = () => useCurrentFrame() * useContext(EscalaTiempo);
