"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import type { DemoOrder } from "@/lib/types";

/**
 * Acciones reales del detalle de pedido (POST_AUDIT_IMPROVEMENTS.md, bloque S):
 * - "Descargar recibo (PDF)": no hay librería de generación de PDF en el
 *   proyecto y añadir una solo para esto sería sobre-ingeniería — en vez de
 *   fingir un PDF, se usa la función nativa "Imprimir → Guardar como PDF"
 *   del navegador sobre una vista ya preparada para impresión (ver
 *   `print:hidden` en layout.tsx). Genera un PDF real, no una simulación.
 * - "Volver a comprar": añade cada pieza del pedido al carrito real
 *   reutilizando `addItem`, que ya ignora en silencio cualquier pieza sin
 *   stock (mismo guard usado en "comprar el look completo").
 */
export function OrderActions({ order }: { order: DemoOrder }) {
  const { addItem } = useCart();
  const router = useRouter();

  function buyAgain() {
    for (const item of order.items) addItem(item.productId, item.quantity);
    router.push("/cart");
  }

  return (
    <div className="print:hidden mb-8 flex flex-wrap gap-3">
      <button type="button" onClick={() => window.print()} className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold hover:border-terracotta">
        Descargar recibo (PDF)
      </button>
      <button type="button" onClick={buyAgain} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-ivory">
        Volver a comprar
      </button>
    </div>
  );
}
