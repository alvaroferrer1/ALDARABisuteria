import type { AssistantIntent } from "./types";

/**
 * Clasificador de intención — basado en reglas (palabras clave), determinista
 * y auditable, NO un LLM. Documentado así en la propia UI. Misma interfaz que
 * tendría un clasificador real (texto → intención), para poder sustituirlo
 * después sin tocar el resto de `assistantProvider`.
 *
 * Cobertura ampliada probando el asistente con preguntas naturales reales
 * (no solo los casos de guion): antes "cuánto cuesta X", "adiós", "¿tiene
 * níquel?", "¿puedo pagar con Bizum?" y "¿dónde estáis?" caían todas en la
 * respuesta genérica de "no tengo información" — problemas reales de
 * cobertura, no solo matices.
 */
const RULES: Array<{ intent: AssistantIntent; test: RegExp }> = [
  { intent: "human", test: /\b(hablar con (alguien|una persona|un humano)|agente|persona real|no me ayudas?|no entiendo nada)\b/i },
  { intent: "greeting", test: /^(hola|buenas|hey|hi|hello|buenos dias|buenas tardes)[\s!.]*$/i },
  // "gracias"/"vale gracias"/"perfecto, gracias" — antes caía en "unknown" con
  // el mensaje de "prefiero no inventar", una respuesta rara a un simple
  // agradecimiento. Debe ir antes que el resto de reglas de contenido.
  { intent: "thanks", test: /^(gracias|muchas gracias|vale gracias|perfecto,? gracias|ok gracias|genial,? gracias)[\s!.]*$/i },
  { intent: "farewell", test: /\b(adi[oó]s|hasta luego|hasta pronto|nos vemos|chao|bye)\b/i },
  // "cuánto cuesta/vale", "qué precio tiene" — antes no existía como
  // intención propia, así que preguntar el precio de una pieza concreta caía
  // en "unknown" pese a ser de lo más natural que se puede preguntar.
  { intent: "price", test: /\b(cu[aá]nto (cuesta|vale)|qu[eé] precio tiene|precio de[l]?)\b/i },
  {
    intent: "payment",
    test: /\b(bizum|paypal|m[eé]todos? de pago|formas? de pago|c[oó]mo pago|pagar con|aceptan tarjeta|pago con tarjeta)\b/i,
  },
  // Bug real: "ubicad" con \b al final nunca casaba "ubicados/ubicada" (sin
  // límite de palabra entre "d" y la letra siguiente) — cambiado a "ubicad\w*".
  // "est[aá]n" (no solo "estáis") para cubrir "¿dónde están?" sin acento.
  { intent: "location", test: /\b(ubicad\w*|d[oó]nde est[aá]is|d[oó]nde est[aá]n|direcci[oó]n|tienda f[ií]sica|taller f[ií]sico|c[oó]mo llego)\b/i },
  { intent: "order_status", test: /\b(mi pedido|pedido|dónde está|donde esta|tracking|seguimiento|envío de mi)\b/i },
  { intent: "returns", test: /\b(devoluci|devolver|cambio|reembolso|no me (queda|gusta))\b/i },
  // "romp\w*" cubre "se rompió", "se me rompe", "rompiéndose" — antes solo
  // "roto/rota" cazaba el participio, así que "se me rompió el cierre" (muy
  // natural en español hablado) caía mal clasificado como catalog_search por
  // mencionar "pulsera". Fallo real detectado probando el asistente.
  { intent: "repair", test: /\b(repar|romp\w*|roto|rota|se ha roto|cierre roto|arreglar)\b/i },
  { intent: "personalization", test: /\b(personaliz|grabar|iniciales|charm studio|style lab)\b/i },
  // "níquel"/"alergia" — pregunta de cuidado/composición muy habitual
  // (piel sensible), antes no cazada por ningún patrón.
  { intent: "care", test: /\b(cuid\w*|limpiar|limpieza|mantenimiento|se pone negr|n[ií]quel|alergi)\b/i },
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
