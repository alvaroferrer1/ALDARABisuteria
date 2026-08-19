"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/trackEvent";

/**
 * Manda un evento "pageview" en cada cambio de ruta — montado una vez en
 * el layout raíz. No hace nada visible; si el usuario no ha aceptado la
 * cookie de analítica, `trackEvent` no manda nada (ver lib/trackEvent.ts).
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    trackEvent("pageview", query ? `${pathname}?${query}` : pathname);
  }, [pathname, searchParams]);

  return null;
}
