"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { createLocalStorageStore } from "@/lib/store";
import { PRODUCTS } from "@/lib/products";

const WISHLIST_KEY = "aldara_wishlist_v1";
// Mejora real (POST_AUDIT_IMPROVEMENTS.md, bloque O): antes la wishlist solo
// guardaba el id del producto — no había forma de saber si el precio había
// bajado o el stock había cambiado desde que se guardó, con los datos que ya
// existían (`product.price`/`product.stock`) sin depender de nada externo.
const SNAPSHOT_KEY = "aldara_wishlist_snapshot_v1";

function parseWishlist(raw: string | null): string[] {
  try {
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export interface WishlistSnapshot {
  price: number;
  stock: number;
  savedAt: string;
}

function parseSnapshots(raw: string | null): Record<string, WishlistSnapshot> {
  try {
    const parsed = JSON.parse(raw || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

const wishlistStore = createLocalStorageStore<string[]>(WISHLIST_KEY, parseWishlist, []);
const snapshotStore = createLocalStorageStore<Record<string, WishlistSnapshot>>(SNAPSHOT_KEY, parseSnapshots, {});

interface WishlistContextValue {
  ids: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  snapshots: Record<string, WishlistSnapshot>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const ids = useSyncExternalStore(wishlistStore.subscribe, wishlistStore.getSnapshot, wishlistStore.getServerSnapshot);
  const snapshots = useSyncExternalStore(snapshotStore.subscribe, snapshotStore.getSnapshot, snapshotStore.getServerSnapshot);

  const toggle = (productId: string) => {
    const wasSaved = wishlistStore.getSnapshot().includes(productId);
    wishlistStore.setValue((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
    if (!wasSaved) {
      // Se acaba de añadir: registra el precio/stock reales de ese momento
      // para poder comparar más adelante — nunca se sobrescribe si ya
      // existía un snapshot (p. ej. quitar y volver a añadir no debe borrar
      // el precio "de referencia" original salvo que de verdad se re-cree).
      const product = PRODUCTS.find((p) => p.id === productId);
      if (product) {
        snapshotStore.setValue((prev) => ({ ...prev, [productId]: { price: product.price, stock: product.stock, savedAt: new Date().toISOString() } }));
      }
    }
  };
  const has = (productId: string) => ids.includes(productId);

  return <WishlistContext.Provider value={{ ids, toggle, has, snapshots }}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist debe usarse dentro de <WishlistProvider>");
  return ctx;
}
