import type { AssistantIntent } from "./types";

/**
 * Clasificador de intención — basado en reglas (palabras clave), determinista
 * y auditable, NO un LLM. Documentado así en la propia UI. Misma interfaz que
 * tendría un clasificador real (texto → intención), para poder sustituirlo
 * después sin tocar el resto de `assistantProvider`.
 */
const RULES: Array<{ intent: AssistantIntent; test: RegExp }> = [
  { intent: "human", test: /\b(hablar con (alguien|una persona|un humano)|agente|persona real|no me ayudas?|no entiendo nada)\b/i },
  { intent: "greeting", test: /^(hola|buenas|hey|hi|hello|buenos dias|buenas tardes)[\s!.]*$/i },
  { intent: "order_status", test: /\b(mi pedido|pedido|dónde está|donde esta|tracking|seguimiento|envío de mi)\b/i },
  { intent: "returns", test: /\b(devoluci|devolver|cambio|reembolso|no me (queda|gusta))\b/i },
  { intent: "repair", test: /\b(repar|roto|rota|se ha roto|cierre roto|arreglar)\b/i },
  { intent: "personalization", test: /\b(personaliz|grabar|iniciales|charm studio|style lab)\b/i },
  { intent: "care", test: /\b(cuid\w*|limpiar|limpieza|mantenimiento|se pone negr)\b/i },
  { intent: "stock", test: /\b(disponible|hay stock|tenéis|teneis|queda[n]?|agotado)\b/i },
  {
    intent: "catalog_search",
    test: /\b(busco|quiero|regalo|regalar|pendiente|pendientes|pulsera|pulseras|colgante|colgantes|charm|charms|collar|menos de|por debajo|presupuesto|€|euros?)\b/i,
  },
];

export function classifyIntent(text: string): AssistantIntent {
  const q = text.toLowerCase().trim();
  if (!q) return "unknown";
  for (const rule of RULES) {
    if (rule.test.test(q)) return rule.intent;
  }
  return "unknown";
}
