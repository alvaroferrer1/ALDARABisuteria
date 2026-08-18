import { classifyIntent } from "./intents";
import {
  detectCategory,
  detectBudget,
  detectProductMention,
  searchCatalog,
  categoryLabel,
  getStockStatus,
  getCareInfo,
  getProductById,
} from "./tools";
import type { AssistantContext, AssistantReply } from "./types";
import type { DemoOrder } from "@/lib/types";

const GIFT_WORDS = /regal|cumplea|aniversario|sorpresa/i;

/**
 * AssistantProvider — orquesta intención → herramientas → respuesta.
 * Determinista y local (sin LLM todavía), pero con la misma forma que tendría
 * un asistente real: recibe texto + contexto de conversación + identidad de
 * sesión ya resuelta por el servidor (nunca un id que mande el cliente), y
 * devuelve una respuesta tipada. Sustituible por un LLM/API real cambiando
 * solo esta función.
 *
 * Seguridad: `myOrders` lo calcula y filtra SIEMPRE el propio route handler
 * a partir de la sesión autenticada (ver /api/assistant) — este módulo nunca
 * recibe ni acepta un email o id de pedido para buscar datos de otra persona.
 * Es la misma regla que ya evitó la fuga de pedidos anterior (ver
 * KNOWN_ISSUES.md / /api/orders): "nunca confiar en un identificador que
 * venga del cliente para decidir qué datos privados devolver".
 */
export function getAssistantReply(
  text: string,
  context: AssistantContext,
  session: { email: string; name: string } | null,
  myOrders: DemoOrder[]
): AssistantReply {
  const q = text.toLowerCase().trim();
  const intent = classifyIntent(q);

  const mentioned = detectProductMention(q);
  const contextProduct = mentioned ?? (context.lastProductId ? getProductById(context.lastProductId) : undefined);

  switch (intent) {
    case "greeting":
      return { intent, text: "¡Hola! 👋 Puedo ayudarte a buscar piezas del catálogo, resolver dudas de cuidado, stock, pedidos o devoluciones. ¿Qué necesitas?" };

    case "human":
      return { intent, text: "Claro, te paso con el equipo por WhatsApp.", lowConfidence: true };

    case "catalog_search": {
      const category = detectCategory(q) ?? contextProduct?.category ?? null;
      const budget = detectBudget(q);
      const gift = GIFT_WORDS.test(q);
      const products = searchCatalog({ category, maxBudget: budget, gift });
      if (products.length === 0) {
        return {
          intent,
          text: budget
            ? `No tengo piezas${category ? ` de ${categoryLabel(category)}` : ""} por debajo de ${budget}€ ahora mismo en catálogo real. ¿Quieres verlo completo o prefieres hablar con nosotros?`
            : "No he encontrado nada con eso exactamente en el catálogo real. Prueba con una categoría (pendientes, pulseras, colgantes, charms) o un presupuesto.",
          lowConfidence: true,
          links: [{ href: "/shop", label: "Ver catálogo completo" }],
        };
      }
      const parts: string[] = [];
      if (category) parts.push(categoryLabel(category).toLowerCase());
      if (budget) parts.push(`hasta ${budget}€`);
      const replyText = parts.length
        ? `Esto es lo que tengo en ${parts.join(" ")}${gift ? ", pensado para regalar" : ""}:`
        : "Esto es lo que más te puede encajar del catálogo real:";
      return { intent, text: replyText, products, contextProductId: products[0]?.id };
    }

    case "care": {
      if (!contextProduct) {
        return {
          intent,
          text: "¿De qué pieza necesitas el cuidado? Dime el nombre, o consulta la guía general de cuidados.",
          links: [{ href: "/cuidados", label: "Ver guía de cuidados" }],
        };
      }
      const { materials, care } = getCareInfo(contextProduct);
      return {
        intent,
        text: `${contextProduct.name} — Material: ${materials}. Cuidado: ${care}`,
        links: [
          { href: `/producto/${contextProduct.slug}`, label: "Ver ficha del producto" },
          { href: "/cuidados", label: "Guía general de cuidados" },
        ],
        contextProductId: contextProduct.id,
      };
    }

    case "stock": {
      if (!contextProduct) {
        return { intent, text: "¿Qué pieza quieres consultar? Dime el nombre y te digo si está disponible.", lowConfidence: true };
      }
      const status = getStockStatus(contextProduct);
      const statusText =
        status === "out_of_stock"
          ? "está agotada ahora mismo, pero puedes avisarte cuando vuelva."
          : status === "low_stock"
            ? `queda poco stock (${contextProduct.stock} unidades).`
            : "está disponible ahora mismo.";
      return {
        intent,
        text: `${contextProduct.name} ${statusText}`,
        products: [contextProduct],
        contextProductId: contextProduct.id,
      };
    }

    case "order_status": {
      if (!session) {
        return {
          intent,
          text: "Para ver tu pedido necesito que inicies sesión primero — así solo te muestro tus datos, nunca los de otra persona.",
          links: [{ href: "/account", label: "Iniciar sesión" }],
        };
      }
      if (myOrders.length === 0) {
        return { intent, text: `No encuentro pedidos asociados a ${session.email}. Si acabas de comprar, puede tardar unos minutos en aparecer.`, lowConfidence: true };
      }
      const last = myOrders[myOrders.length - 1];
      return {
        intent,
        text: `Tu último pedido (${last.id}) del ${new Date(last.createdAt).toLocaleDateString("es-ES")} está "${last.status}". Puedes ver el seguimiento completo en tu cuenta.`,
        links: [{ href: `/account/pedidos/${last.id}`, label: "Ver detalle del pedido" }],
      };
    }

    case "returns":
      return {
        intent,
        text: "Tienes 14 días naturales desde la recepción para devoluciones o cambios, salvo piezas personalizadas (solo por defecto de fabricación). Te cuento el detalle o, si tu caso es distinto, te paso con el equipo.",
        links: [{ href: "/legal/envios-devoluciones", label: "Ver condiciones completas" }],
        lowConfidence: true,
      };

    case "repair":
      return {
        intent,
        text: "Si una pieza necesita un ajuste o reparación, puedes dejarnos la solicitud aquí y te confirmamos el estado.",
        links: [{ href: "/reparaciones", label: "Solicitar reparación" }],
      };

    case "personalization":
      return {
        intent,
        text: "Puedes personalizar iniciales, símbolos y combinaciones en estas herramientas:",
        links: [
          { href: "/personaliza", label: "Personalización" },
          { href: "/charms-studio", label: "Charm Studio" },
          { href: "/style-lab/ear-stack", label: "Style Lab" },
        ],
      };

    default:
      return {
        intent: "unknown",
        text: "No tengo suficiente información para confirmártelo con seguridad. Prefiero no inventar una respuesta — te paso con el equipo si quieres.",
        lowConfidence: true,
      };
  }
}
