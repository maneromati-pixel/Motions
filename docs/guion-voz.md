# Guion de voz — "Alguien gana con tu sueldo" (@zerum00)

Español neutro · 60 s · ritmo de lectura ~2,5–3 palabras por segundo.
Los tiempos salen de `src/timing.ts`. Si una frase grabada dura más o menos,
ajustá la duración de esa escena ahí y volvé a renderizar.

| # | Tiempo | En pantalla | Voz |
|---|--------|-------------|-----|
| 1 | 0:00–0:04 | Alguien gana con **TU SUELDO** / y no eres tú. | Alguien gana con tu sueldo… y no eres tú. |
| 2 | 0:04–0:08 | TU SUELDO · 100% · DÍA DE PAGO | Día de pago. Tu cuenta, al cien por ciento. |
| 3 | 0:08–0:15 | QUIÉN SE LO LLEVA · suscripciones, mensualidades, apps de comida, banco · $0 | Pero en pocos días se lo llevan: suscripciones, mensualidades, apps de comida, el banco… y llegas a cero. |
| 4 | 0:15–0:21 | LO QUE NO VES · radar · GASTOS PEQUEÑOS, TODOS LOS MESES | Y está lo que no ves: comisiones, intereses, compras por impulso. Pequeños… pero todos los meses. |
| 5 | 0:21–0:27 | ELLOS PLANEAN TU DINERO · ELLOS SABEN CUÁNTO VAS A GASTAR · TÚ NO | Las empresas tienen un plan para tu dinero. Saben cuánto vas a gastar. Tú no. |
| 6 | 0:27–0:32 | CUÁNTO AHORRA LA GENTE · LA MAYORÍA: 0% · TÚ: 10% | La mayoría ahorra cero. Muy pocos llegan al diez por ciento. |
| 7 | 0:32–0:38 | LO QUE HACEN POCOS · ¿YA AHORRÉ? · AHORRA PRIMERO · GASTA EL RESTO | Y esos pocos hacen algo distinto: cuando cobran, primero ahorran. Después gastan lo que queda. |
| 8 | 0:38–0:42 | MISMO SUELDO · NO QUEDA NADA / SIEMPRE QUEDA | Mismo sueldo. Solo cambia el orden. |
| 9 | 0:42–0:51 | PONGAMOS NÚMEROS · AÑO 1→10 · $48.000 · $144.000 · TIENES UNA BASE | Pongamos números. Ahorrando el diez por ciento al mes, en diez años juntas cuarenta y ocho mil. No es una fortuna… pero tienes una base. |
| 10 | 0:51–0:56 | curva · SI NO LE DAS UN DESTINO A TU DINERO, ALGUIEN MÁS SE LO DA | Si no le das un destino a tu dinero… alguien más se lo da. |
| 11 | 0:56–1:00 | SÍGUEME · @zerum00 | Sígueme para aprender a hacerlo. |

## Notas de grabación
- Voz grabada: public/audio/voz.mp3 (los cortes de escena en src/timing.ts están medidos sobre ese archivo).
- Tono: calmado y directo, como una confidencia; subir la energía en "y no eres tú" y en "Tú no".
- Pausas marcadas con "…": dejá ~0,3 s.
- En la escena 9 la voz puede ir apenas por detrás del contador: el número final ($48.000) aparece cerca de 0:49.
- La escena 3 y la 9 son las más cargadas: si la lectura se pasa, sacá "pocos" en la 3 y "No es una fortuna…" en la 9.
