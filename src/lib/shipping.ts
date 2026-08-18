/**
 * Umbral de envío gratis — fuente de verdad única para cualquier cálculo
 * real (barra de progreso del carrito, lógica futura de checkout). El
 * mismo importe aparece como texto fijo en varias cadenas de `dictionaries.ts`
 * (footer, trust rows, PDP) porque son copy estático describiendo la misma
 * política real, no lógica — pero cualquier código que necesite COMPARAR o
 * CALCULAR contra el umbral debe importar esta constante, nunca repetir el
 * número suelto.
 */
export const FREE_SHIPPING_THRESHOLD = 60;
