"use client";

import { useState } from "react";
import Link from "next/link";
import { getConciergeRecommendations } from "@/lib/concierge";
import { getAllProducts } from "@/lib/products";
import type { Product } from "@/lib/types";
import { money } from "@/lib/storage";
import { useTranslations } from "@/lib/i18n/localeStore";
import { ProductPlate } from "./ProductPlate";
import { WishlistButton } from "./WishlistButton";

interface Turn {
  query: string;
  reply: string;
  products: Product[];
}

/**
 * Experiencia completa del Concierge — calcada del layout de dos columnas
 * del mockup (p.27): chat a la izquierda + "Recomendado para ti" a la
 * derecha (en vez de recomendaciones solo dentro de la burbuja de chat),
 * más "Sugerencias de estilo" y 3 tarjetas de confianza debajo. Misma
 * lógica local real de `src/lib/concierge.ts` sobre el catálogo real — sigue
 * sin ser IA generativa, y la copia lo dice explícitamente (no se calca la
 * frase "potenciado por IA" del mockup porque no sería cierto). Chrome
 * traducido de verdad ES/EN/FR (namespace `concierge`); la respuesta del
 * recomendador (`turn.reply`) viene de `lib/concierge.ts` y sigue en
 * español — es texto generado por reglas, no chrome de interfaz estático.
 */
export function ConciergeChat() {
  const { t } = useTranslations();
  const [query, setQuery] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);

  const suggestedPrompts = [t.concierge.prompt1, t.concierge.prompt2, t.concierge.prompt3, t.concierge.prompt4];
  const STYLE_SUGGESTIONS = [
    { label: t.concierge.dailyLook, sub: t.concierge.dailyLookSub, href: "/lookbook" },
    { label: t.concierge.specialOccasions, sub: t.concierge.specialOccasionsSub, href: "/regalos" },
    { label: t.concierge.giftsWithHistory, sub: t.concierge.giftsWithHistorySub, href: "/regalos/ideas" },
  ];

  function ask(text: string) {
    const q = text.trim();
    if (!q) return;
    const result = getConciergeRecommendations(q);
    setTurns((prev) => [...prev, { query: q, reply: result.reply, products: result.products }]);
    setQuery("");
  }

  const lastTurn = turns[turns.length - 1];
  const recommended = lastTurn && lastTurn.products.length > 0 ? lastTurn.products : getAllProducts().filter((p) => p.badges?.includes("bestseller")).slice(0, 4);
  const recommendedLabel = lastTurn && lastTurn.products.length > 0 ? t.concierge.basedOnWhatYouTold : t.concierge.ourMostLoved;

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        {/* Chat */}
        <div className="flex flex-col rounded-3xl border border-line bg-surface p-6 sm:p-8">
          <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta">
            <span className="h-2 w-2 rounded-full bg-[#3ddc84]" /> {t.concierge.yourConcierge}
          </p>
          {turns.length === 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {suggestedPrompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => ask(p)}
                  className="rounded-full border border-line px-4 py-2 text-sm hover:border-terracotta hover:text-terracotta"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {turns.map((turn, i) => (
              <div key={i} className="flex flex-col gap-3">
                <p className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-ink px-4 py-2.5 text-sm text-ivory">{turn.query}</p>
                <p className="max-w-[85%] rounded-2xl rounded-bl-sm bg-surface-2 px-4 py-2.5 text-sm">{turn.reply}</p>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(query);
            }}
            className="mt-6 flex gap-2 border-t border-line pt-6"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.concierge.inputPlaceholder}
              className="flex-1 rounded-full border border-line bg-transparent px-4 py-3 text-sm"
            />
            <button type="submit" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory">
              {t.concierge.ask}
            </button>
          </form>
          <p className="mt-3 text-xs text-ink-soft">{t.concierge.disclaimer}</p>
        </div>

        {/* Recomendado para ti */}
        <div>
          <p className="mb-1 text-sm font-semibold">{t.concierge.recommendedForYou}</p>
          <p className="mb-4 text-xs text-ink-soft">{recommendedLabel}.</p>
          <div className="grid grid-cols-2 gap-4">
            {recommended.map((p) => (
              <div key={p.id} className="group relative rounded-2xl border border-line p-3 hover:border-terracotta">
                <div className="absolute right-4 top-4 z-10">
                  <WishlistButton productId={p.id} productName={p.name} />
                </div>
                <Link href={`/producto/${p.slug}`}>
                  <ProductPlate product={p} className="aspect-square rounded-xl" />
                  <p className="mt-2 text-sm font-semibold group-hover:text-terracotta">{p.name}</p>
                  <p className="text-xs text-ink-soft">{money(p.price)}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sugerencias de estilo */}
      <div className="mt-10">
        <p className="mb-4 text-sm font-semibold">{t.concierge.styleSuggestions}</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {STYLE_SUGGESTIONS.map((s) => (
            <Link key={s.label} href={s.href} className="rounded-2xl border border-line p-5 hover:border-terracotta">
              <p className="font-semibold">{s.label}</p>
              <p className="mt-1 text-sm text-ink-soft">{s.sub}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Confianza */}
      <div className="mt-10 grid gap-4 border-t border-line pt-8 sm:grid-cols-3">
        <div>
          <p className="font-semibold">{t.concierge.saveFavorites}</p>
          <p className="mt-1 text-sm text-ink-soft">{t.concierge.saveFavoritesSub}</p>
          <Link href="/wishlist" className="mt-2 inline-block text-sm font-semibold text-terracotta">
            {t.concierge.viewSaved}
          </Link>
        </div>
        <div>
          <p className="font-semibold">{t.concierge.realCatalog}</p>
          <p className="mt-1 text-sm text-ink-soft">{t.concierge.realCatalogSub}</p>
          <Link href="/shop" className="mt-2 inline-block text-sm font-semibold text-terracotta">
            {t.concierge.viewFullCatalog}
          </Link>
        </div>
        <div>
          <p className="font-semibold">{t.concierge.localExperience}</p>
          <p className="mt-1 text-sm text-ink-soft">{t.concierge.localExperienceSub}</p>
        </div>
      </div>
    </div>
  );
}
