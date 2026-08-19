import type { Product } from "@/lib/types";

export type AssistantIntent =
  | "catalog_search"
  | "care"
  | "stock"
  | "price"
  | "payment"
  | "location"
  | "order_status"
  | "returns"
  | "repair"
  | "personalization"
  | "greeting"
  | "thanks"
  | "farewell"
  | "human"
  | "unknown";

export interface AssistantContext {
  /** Último producto mencionado en la conversación, para resolver "esta"/"lo tenéis" sin repetir el nombre. */
  lastProductId?: string;
}

export interface AssistantReply {
  intent: AssistantIntent;
  text: string;
  products?: Product[];
  links?: Array<{ href: string; label: string }>;
  /** true = la respuesta no es fiable / falta info → ofrecer WhatsApp siempre visible, no solo como último recurso. */
  lowConfidence?: boolean;
  /** Producto que queda "activo" en el contexto para el siguiente turno. */
  contextProductId?: string;
}
