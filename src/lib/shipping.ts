/**
 * Umbral y coste de envío — fuente de verdad única para cualquier cálculo
 * real (barra de progreso del carrito, checkout, POST /api/orders). El
 * mismo importe aparece como texto fijo en varias cadenas de `dictionaries.ts`
 * (footer, trust rows, PDP) porque son copy estático describiendo la misma
 * política real, no lógica — pero cualquier código que necesite COMPARAR o
 * CALCULAR contra el umbral debe importar esta constante, nunca repetir el
 * número suelto.
 *
 * Bug real corregido: la barra "Añade X€ más para envío gratis" del carrito
 * y el badge "Envíos gratis desde 60€" prometían un cargo por debajo del
 * umbral que el checkout nunca aplicaba — el total daba exactamente igual
 * con 10€ en la cesta que con 100€. Ahora el envío se calcula de verdad
 * (checkout/page.tsx para mostrarlo, api/orders/route.ts para cobrarlo).
 */
export const FREE_SHIPPING_THRESHOLD = 60;
export const SHIPPING_FEE = 4.95;

export function computeShippingCost(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}
