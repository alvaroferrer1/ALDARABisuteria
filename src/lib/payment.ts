/**
 * Proveedor de pago — mismo patrón `Provider` ya usado en el proyecto para
 * piezas que hoy son demo pero están preparadas para conectar algo real
 * (`TryOnProvider` en `lib/tryOn.ts`, `assistantProvider` en
 * `lib/assistant/`): una interfaz pequeña + una implementación demo, para
 * que conectar Stripe/Redsys el día que haya credenciales sea sustituir
 * `activePaymentProvider` por una implementación real sin tocar el checkout.
 *
 * Antes de esto, la simulación de pago (tarjeta terminada en "0002" = pago
 * rechazado) vivía inline dentro de `checkout/page.tsx`, sin ninguna interfaz
 * — funcionaba, pero conectar una pasarela real habría significado reescribir
 * ese componente en vez de sustituir un proveedor.
 */

export type PaymentResult = { ok: true } | { ok: false; reason: string };

export interface PaymentInput {
  method: "tarjeta" | "paypal" | "bizum";
  cardNumber?: string;
  amount: number;
}

export interface PaymentProvider {
  readonly name: string;
  charge(input: PaymentInput): Promise<PaymentResult>;
}

/**
 * DEMO_SIMULATED: nunca mueve dinero real. Convención habitual de tarjetas
 * de prueba (terminación "0002" = rechazo) para poder enseñar y probar el
 * estado de fallo sin depender de una pasarela externa. Cualquier otro
 * número de tarjeta, PayPal o Bizum se acepta siempre.
 */
class DemoPaymentProvider implements PaymentProvider {
  readonly name = "demo";

  async charge(input: PaymentInput): Promise<PaymentResult> {
    if (input.method === "tarjeta" && input.cardNumber?.replace(/\s/g, "").endsWith("0002")) {
      return { ok: false, reason: "card_declined" };
    }
    return { ok: true };
  }
}

// --- INTEGRACIÓN REAL PENDIENTE ---
// Cuando haya credenciales de una pasarela real, crear una clase que
// implemente `PaymentProvider` (p. ej. `StripePaymentProvider`, usando
// `stripe.paymentIntents.create` + confirmación) y cambiar la constante de
// abajo. El checkout (`checkout/page.tsx`) y `POST /api/orders` no
// necesitan cambiar: ambos ya llaman a `activePaymentProvider.charge(...)`.
export const activePaymentProvider: PaymentProvider = new DemoPaymentProvider();
