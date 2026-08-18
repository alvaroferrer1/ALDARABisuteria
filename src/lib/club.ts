/**
 * Reglas del Club — constantes centralizadas, nunca repetidas como números
 * sueltos en la lógica de canje. 1 punto por cada euro gastado (ya real),
 * 100 puntos = 1€ de descuento al canjear.
 */
export const POINTS_PER_EURO_SPENT = 1;
export const POINTS_PER_EURO_DISCOUNT = 100;

export function pointsToEuros(points: number): number {
  return points / POINTS_PER_EURO_DISCOUNT;
}
