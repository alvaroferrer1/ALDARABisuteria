"use client";

import { createContext, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { PRODUCTS } from "@/lib/products";
import { createLocalStorageStore } from "@/lib/store";
import { GIFT_WRAP_PRICE } from "@/lib/giftCards";
import type { CartLine } from "@/lib/types";

const CART_KEY = "aldara_cart_v1";
const GIFT_OPTIONS_KEY = "aldara_gift_options_v1";
export { GIFT_WRAP_PRICE };

interface GiftOptions {
  giftWrap: boolean;
  giftMessage: string;
  personalizationNote: string;
}

function parseGiftOptions(raw: string | null): GiftOptions {
  try {
    const parsed = raw ? JSON.parse(raw) : null;
    return {
      giftWrap: !!parsed?.giftWrap,
      giftMessage: typeof parsed?.giftMessage === "string" ? parsed.giftMessage.slice(0, 200) : "",
      personalizationNote: typeof parsed?.personalizationNote === "string" ? parsed.personalizationNote.slice(0, 200) : "",
    };
  } catch {
    return { giftWrap: false, giftMessage: "", personalizationNote: "" };
  }
}

const giftOptionsStore = createLocalStorageStore<GiftOptions>(GIFT_OPTIONS_KEY, parseGiftOptions, {
  giftWrap: false,
  giftMessage: "",
  personalizationNote: "",
});

function parseCart(raw: string | null): CartLine[] {
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine =>
        !!l && typeof l.productId === "string" && Number.isFinite(l.quantity) && l.quantity > 0
    );
  } catch {
    return [];
  }
}

const cartStore = createLocalStorageStore<CartLine[]>(CART_KEY, parseCart, []);

interface CartContextValue {
  lines: CartLine[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
  giftWrap: boolean;
  giftMessage: string;
  personalizationNote: string;
  setGiftWrap: (value: boolean) => void;
  setGiftMessage: (value: string) => void;
  setPersonalizationNote: (value: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const giftOptions = useSyncExternalStore(giftOptionsStore.subscribe, giftOptionsStore.getSnapshot, giftOptionsStore.getServerSnapshot);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (productId: string, quantity = 1) => {
    // Guarda real de stock: nunca se añade al carrito una pieza agotada,
    // sea cual sea el origen de la llamada (tarjeta, PDP, "comprar el look
    // completo", Charm Studio...). Bug real detectado al poner Gota de
    // Ámbar en stock 0 para construir Back in Stock — antes nada lo impedía.
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product || product.stock === 0) return;
    cartStore.setValue((prev) => {
      const existing = prev.find((l) => l.productId === productId);
      if (existing) {
        return prev.map((l) => (l.productId === productId ? { ...l, quantity: l.quantity + quantity } : l));
      }
      return [...prev, { productId, quantity }];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string) => cartStore.setValue((prev) => prev.filter((l) => l.productId !== productId));
  const setQuantity = (productId: string, quantity: number) =>
    cartStore.setValue((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.productId !== productId)
        : prev.map((l) => (l.productId === productId ? { ...l, quantity } : l))
    );
  const clear = () => {
    cartStore.setValue([]);
    giftOptionsStore.setValue({ giftWrap: false, giftMessage: "", personalizationNote: "" });
  };

  const { totalItems, totalPrice } = useMemo(() => {
    let items = 0;
    let price = 0;
    for (const line of lines) {
      const product = PRODUCTS.find((p) => p.id === line.productId);
      if (!product) continue;
      items += line.quantity;
      price += product.price * line.quantity;
    }
    return { totalItems: items, totalPrice: price };
  }, [lines]);

  const value: CartContextValue = {
    lines,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem,
    removeItem,
    setQuantity,
    clear,
    totalItems,
    totalPrice,
    giftWrap: giftOptions.giftWrap,
    giftMessage: giftOptions.giftMessage,
    personalizationNote: giftOptions.personalizationNote,
    setGiftWrap: (v: boolean) => giftOptionsStore.setValue((prev) => ({ ...prev, giftWrap: v })),
    setGiftMessage: (v: string) => giftOptionsStore.setValue((prev) => ({ ...prev, giftMessage: v.slice(0, 200) })),
    setPersonalizationNote: (v: string) => giftOptionsStore.setValue((prev) => ({ ...prev, personalizationNote: v.slice(0, 200) })),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
