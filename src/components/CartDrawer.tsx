"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { PRODUCTS } from "@/lib/products";
import { money } from "@/lib/storage";
import { ProductVisual } from "./ProductVisual";
import { whatsappHref } from "@/lib/whatsapp";

export function CartDrawer() {
  const { lines, isOpen, closeCart, removeItem, setQuantity, totalPrice } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeCart]);

  const buildWhatsappMessage = () => {
    if (!lines.length) return undefined;
    const messageLines = ["Hola ALDARA, quiero hacer este pedido:"];
    lines.forEach((line) => {
      const product = PRODUCTS.find((p) => p.id === line.productId);
      if (!product) return;
      messageLines.push(`• ${line.quantity}x ${product.name} — ${money(product.price * line.quantity)}`);
    });
    messageLines.push(`Total: ${money(totalPrice)}`);
    return messageLines.join("\n");
  };

  return (
    <>
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-[70] bg-ink/45 transition-opacity ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Cesta de compra"
        className={`fixed right-0 top-0 z-[80] flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-lg font-semibold">Tu cesta</h2>
          <button type="button" onClick={closeCart} aria-label="Cerrar cesta" className="h-9 w-9 rounded-full hover:bg-surface-2">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <p className="mt-10 text-center text-ink-soft">Tu cesta está vacía. Explora el catálogo ✨</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {lines.map((line) => {
                const product = PRODUCTS.find((p) => p.id === line.productId);
                if (!product) return null;
                return (
                  <li key={line.productId} className="flex gap-3.5">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-surface-2">
                      <ProductVisual product={product} size={32} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{product.name}</p>
                      <p className="text-xs text-ink-soft">
                        {money(product.price)} · {money(product.price * line.quantity)}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQuantity(line.productId, line.quantity - 1)}
                          aria-label={`Restar una unidad de ${product.name}`}
                          className="h-6 w-6 rounded-full border border-line text-sm"
                        >
                          –
                        </button>
                        <span aria-live="polite" className="text-sm">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(line.productId, line.quantity + 1)}
                          aria-label={`Sumar una unidad de ${product.name}`}
                          className="h-6 w-6 rounded-full border border-line text-sm"
                        >
                          +
                        </button>
                      </div>
                      <button type="button" onClick={() => removeItem(line.productId)} className="mt-1 text-xs text-terracotta underline">
                        Quitar
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-line px-6 py-5">
          <div className="mb-3.5 flex items-center justify-between text-base">
            <span>Total</span>
            <strong>{money(totalPrice)}</strong>
          </div>
          <Link
            href="/checkout"
            onClick={closeCart}
            className={`block w-full rounded-full px-6 py-3.5 text-center font-semibold text-ivory transition-transform hover:-translate-y-0.5 ${
              lines.length === 0 ? "pointer-events-none bg-ink/40" : "bg-ink"
            }`}
          >
            Finalizar pedido
          </Link>
          {lines.length > 0 && (
            <a
              href={whatsappHref(buildWhatsappMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 block w-full rounded-full border border-line px-6 py-3 text-center text-sm font-semibold"
            >
              O consultar por WhatsApp
            </a>
          )}
          <p className="mt-3 text-center text-xs text-ink-soft">Pedido de demostración: sin pasarela de pago real conectada todavía.</p>
        </div>
      </aside>
    </>
  );
}
