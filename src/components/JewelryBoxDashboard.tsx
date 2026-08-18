"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { useTranslations } from "@/lib/i18n/localeStore";
import { useWishlist } from "@/context/WishlistContext";
import { useSavedLooks } from "@/lib/savedLooks";
import { ProductPlate } from "./ProductPlate";
import { AddToCartButton } from "./AddToCartButton";
import { PhotoSlot } from "./PhotoSlot";
import { money } from "@/lib/storage";

/**
 * Joyero Digital — calcado del mockup (p.34 "Mi Joyero Digital"), que
 * muestra un hub completo (saludo + puntos, fila de estadísticas, acceso
 * rápido a cuenta, recomendaciones, wishlist), no solo la rejilla de piezas
 * compradas que había antes. Gap real detectado en comparación directa
 * PDF↔LIVE — la página anterior ya coincidía en la rejilla de piezas y
 * looks guardados, pero le faltaba todo lo demás. Partido en dos
 * componentes (cabecera / recomendaciones+wishlist) para que la rejilla de
 * piezas y `SavedLooksSection` (ya reales, Server/Client existentes) queden
 * en medio sin tener que fabricar un slot artificial.
 *
 * Datos honestos: el mockup separa "Guardadas" y "Lista de deseos" como si
 * fueran dos listas distintas — en este sitio ambas son la MISMA wishlist
 * real (`useWishlist`), así que se presentan como una sola sección en vez
 * de fabricar una segunda lista que no existe.
 */
export function JewelryBoxHeaderDashboard({
  userName,
  memberSince,
  points,
  piecesCount,
}: {
  userName: string;
  memberSince: string;
  points: number;
  piecesCount: number;
}) {
  const { t } = useTranslations();
  const j = t.accountMore;
  const { ids: wishlistIds } = useWishlist();
  const { saved: savedLookSlugs } = useSavedLooks();

  const stats = [
    [piecesCount, j.jewelryStatsPieces],
    [wishlistIds.length, j.jewelryStatsSaved],
    [savedLookSlugs.length, j.jewelryStatsLooks],
    [points, j.jewelryStatsPoints],
  ] as const;

  const quickNav = [
    ["/account", j.jewelryNavAccount],
    ["/account", j.jewelryNavOrders],
    ["/wishlist", j.jewelryNavWishlist],
    ["/club", j.jewelryNavClub],
    ["/account/direcciones", j.jewelryNavAddresses],
    ["/account/preferencias", j.jewelryNavPreferences],
  ] as const;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-surface-2 p-6">
        <div className="flex items-center gap-4">
          <div className="relative hidden h-16 w-16 shrink-0 overflow-hidden rounded-full sm:block">
            <PhotoSlot name="joyero-digital-avatar" alt="" fallback={<div className="absolute inset-0 bg-surface-3" />} />
          </div>
          <div>
            <p className="font-display text-xl font-semibold">
              {j.jewelryGreeting}, {userName}
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              {j.jewelryMemberSince} {memberSince}
            </p>
          </div>
        </div>
        <Link href="/account" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-ivory">
          {j.jewelryViewAccount}
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={label} className="rounded-2xl border border-line p-4 text-center">
            <p className="font-display text-2xl font-semibold">{value}</p>
            <p className="text-xs text-ink-soft">{label}</p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink-soft">{j.jewelryQuickNav}</p>
        <div className="flex flex-wrap gap-2">
          {quickNav.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-ink">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export function JewelryBoxRecommendations({ recommended, allProducts }: { recommended: Product[]; allProducts: Product[] }) {
  const { t } = useTranslations();
  const j = t.accountMore;
  const { ids: wishlistIds } = useWishlist();
  const wishlistProducts = wishlistIds.map((id) => allProducts.find((p) => p.id === id)).filter((p): p is Product => Boolean(p));

  return (
    <>
      {recommended.length > 0 && (
        <div className="mt-14 border-t border-line pt-8">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-terracotta">{j.jewelryRecommendedTitle}</p>
          <p className="mb-5 text-sm text-ink-soft">{j.jewelryRecommendedSubtitle}</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((p) => (
              <article key={p.id} className="overflow-hidden rounded-2xl border border-line bg-surface">
                <Link href={`/producto/${p.slug}`}>
                  <ProductPlate product={p} className="aspect-square rounded-none" />
                </Link>
                <div className="flex items-center justify-between gap-2 p-4">
                  <div>
                    <Link href={`/producto/${p.slug}`}>
                      <h3 className="font-display text-base font-semibold">{p.name}</h3>
                    </Link>
                    <p className="text-sm text-ink-soft">{money(p.price)}</p>
                  </div>
                  <AddToCartButton productId={p.id} productName={p.name} />
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      <div className="mt-14 border-t border-line pt-8">
        <p className="mb-5 font-semibold">
          {j.jewelryWishlistTitle} {wishlistProducts.length > 0 && `(${wishlistProducts.length})`}
        </p>
        {wishlistProducts.length === 0 ? (
          <p className="text-sm text-ink-soft">{j.jewelryWishlistEmpty}</p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {wishlistProducts.slice(0, 4).map((p) => (
                <article key={p.id} className="overflow-hidden rounded-2xl border border-line bg-surface">
                  <Link href={`/producto/${p.slug}`}>
                    <ProductPlate product={p} className="aspect-square rounded-none" />
                  </Link>
                  <div className="p-4">
                    <Link href={`/producto/${p.slug}`}>
                      <h3 className="font-display text-base font-semibold">{p.name}</h3>
                    </Link>
                    <p className="text-sm text-ink-soft">{money(p.price)}</p>
                  </div>
                </article>
              ))}
            </div>
            {wishlistProducts.length > 4 && (
              <Link href="/wishlist" className="mt-4 inline-block text-sm font-semibold text-terracotta hover:underline">
                {j.jewelryWishlistViewAll}
              </Link>
            )}
          </>
        )}
      </div>
    </>
  );
}
