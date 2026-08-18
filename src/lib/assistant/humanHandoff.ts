import { whatsappHref } from "@/lib/whatsapp";

const MAX_SUMMARY_LEN = 160;

/**
 * HumanHandoffProvider — construye el enlace de escalado a WhatsApp con un
 * mensaje útil pre-rellenado, sin datos sensibles. Nunca incluye dirección
 * completa, tokens, cookies ni PII de terceros — como mucho, una referencia
 * de pedido corta si el propio usuario ya la mencionó/confirmó como suya.
 */
export function buildHandoffHref(summary: string, orderRef?: string): string {
  const safeSummary = summary.replace(/[<>]/g, "").slice(0, MAX_SUMMARY_LEN);
  const lines = [
    "Hola, vengo del asistente de ALDARA.",
    `Necesito ayuda con: ${safeSummary || "una consulta"}.`,
  ];
  if (orderRef) lines.push(`Referencia de pedido: ${orderRef.slice(0, 30)}`);
  return whatsappHref(lines.join("\n"));
}
