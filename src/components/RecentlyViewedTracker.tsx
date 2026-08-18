"use client";

import { useEffect } from "react";
import { recentlyViewedStore } from "@/lib/recentlyViewed";

/** Se monta en el PDP para registrar la visita — sin JSX, efecto puro de registro. */
export function RecentlyViewedTracker({ productId }: { productId: string }) {
  useEffect(() => {
    recentlyViewedStore.add(productId);
  }, [productId]);
  return null;
}
