"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useTranslations } from "@/lib/i18n/localeStore";
import { WishlistButton } from "./WishlistButton";
import { BackInStockForm } from "./BackInStockForm";

export function PdpActions({
  productId,
  productName,
  stock,
  price,
  productSlug,
}: {
  productId: string;
  productName: string;
  stock: number;
  price: number;
  productSlug: string;
}) {
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [inlineVisible, setInlineVisible] = useState(true);
  const inlineRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const { t } = useTranslations();

  useEffect(() => {
    const el = inlineRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setInlineVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function handleAdd() {
    addItem(productId, qty);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  }

  const buyLabel = stock === 0 ? t.common.outOfStock : justAdded ? t.common.added : t.common.addToCart;

  return (
    <>
      <div ref={inlineRef} className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-full border border-line">
            <button
              type="button"
              aria-label={t.pdp.decreaseQty}
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-11 w-11 items-center justify-center text-lg"
            >
              –
            </button>
            <span className="w-8 text-center" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              aria-label={t.pdp.increaseQty}
              onClick={() => setQty((q) => Math.min(stock, q + 1))}
              className="flex h-11 w-11 items-center justify-center text-lg"
            >
              +
            </button>
          </div>
          {stock > 0 ? (
            <span className="flex items-center gap-1.5 text-sm text-ink-soft">
              {/* Nivel visual de stock (bajo/medio/alto) — mismos umbrales que
                  el resto del sitio usa para "últimas unidades", solo con
                  apoyo visual además del número (POST_AUDIT_IMPROVEMENTS.md,
                  bloque C). */}
              <span className="flex gap-0.5" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-3 w-1 rounded-full"
                    style={{ backgroundColor: i < (stock <= 3 ? 1 : stock <= 10 ? 2 : 3) ? "var(--terracotta)" : "var(--line)" }}
                  />
                ))}
              </span>
              {stock} {t.pdp.availableSuffix}
            </span>
          ) : (
            <span className="text-sm text-ink-soft">{t.common.outOfStock}</span>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            disabled={stock === 0}
            onClick={handleAdd}
            className="flex-1 rounded-full bg-ink px-6 py-3.5 font-semibold text-ivory transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {buyLabel}
          </button>
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-line">
            <WishlistButton productId={productId} productName={productName} />
          </div>
        </div>
        {stock === 0 && <BackInStockForm productId={productId} productName={productName} />}
        <Link href={`/try-on?producto=${productSlug}`} className="text-sm font-semibold text-terracotta hover:underline">
          {t.footerLinks.tryOn} →
        </Link>
      </div>

      {/* Sticky mobile buy bar: solo visible cuando el bloque de compra original sale del viewport, solo en móvil/tablet.
          z-30, por debajo del ChatWidget (z-90) para no taparlo nunca; padding-bottom con safe-area-inset-bottom para
          no quedar debajo de la home indicator bar de iPhone (gap real detectado en revisión de mejoras P1). */}
      <div
        className={`fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-line bg-ivory/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform lg:hidden ${
          inlineVisible ? "translate-y-full" : "translate-y-0"
        }`}
        role="region"
        aria-label={t.pdp.quickBuyRegion}
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{productName}</p>
          <p className="text-sm text-ink-soft">{price.toFixed(2)} €</p>
        </div>
        <button
          type="button"
          disabled={stock === 0}
          onClick={handleAdd}
          className="shrink-0 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-ivory disabled:cursor-not-allowed disabled:opacity-40"
        >
          {buyLabel}
        </button>
      </div>
    </>
  );
}
