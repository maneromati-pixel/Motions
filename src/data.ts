/**
 * Cifras del video. NO MODIFICAR.
 * Aporte USD 200/mes desde los 20, rendimiento estimado 8% anual,
 * capitalización mensual (anualidad vencida), hasta los 65.
 */
export const DATA = {
  monthly: 200,
  annualRate: 0.08,
  startAge: 20,
  endAge: 65,

  totalAt65: 1_054_900,
  contributedAt65: 108_000,
  interestAt65: 946_900, // 1.054.900 − 108.000 → "$947K"

  checkpoints: [
    {age: 20, contributed: 0, total: 0},
    {age: 30, contributed: 24_000, total: 36_600},
    {age: 40, contributed: 48_000, total: 117_800},
    {age: 50, contributed: 72_000, total: 298_000},
    {age: 60, contributed: 96_000, total: 698_200},
    {age: 65, contributed: 108_000, total: 1_054_900},
  ],

  lateStarter: {startAge: 30, totalAt65: 458_800},

  // 1.054.900 − 458.800 = 596.100 → se muestra redondeado a miles.
  waitCost: 596_000,
} as const;

const r = DATA.annualRate / 12;

/** Valor futuro por fórmula (capitalización mensual) tras `months` aportes. */
export const fvMonths = (months: number) =>
  months <= 0 ? 0 : (DATA.monthly * (Math.pow(1 + r, months) - 1)) / r;

/**
 * Total a una edad continua. Usa la fórmula para la forma entre puntos y
 * corrige el residuo para que en cada checkpoint dé EXACTAMENTE la cifra de DATA.
 */
export const totalAtAge = (age: number) => {
  const cps = DATA.checkpoints;
  const a = Math.min(Math.max(age, cps[0].age), cps[cps.length - 1].age);
  for (let i = 0; i < cps.length - 1; i++) {
    const A = cps[i];
    const B = cps[i + 1];
    if (a <= B.age) {
      const f = (a - A.age) / (B.age - A.age);
      const resA = A.total - fvMonths((A.age - DATA.startAge) * 12);
      const resB = B.total - fvMonths((B.age - DATA.startAge) * 12);
      return fvMonths((a - DATA.startAge) * 12) + resA + (resB - resA) * f;
    }
  }
  return DATA.totalAt65;
};

export const contributedAtAge = (age: number) =>
  Math.max(0, age - DATA.startAge) * 12 * DATA.monthly;
