import { readJson, writeJson, withFileLock } from "./localDb";

/**
 * Analítica local y propia (Bloque 4 de la hoja de ruta, CLAUDE.md) — sin
 * ningún servicio de terceros (Google Analytics, Meta Pixel...), solo
 * events guardados en `data/analytics-events.json` como el resto de datos
 * de demostración del sitio. Respeta el consentimiento de cookies ya
 * existente (`cookieConsentStore`): el cliente solo manda eventos si el
 * usuario aceptó la categoría "analytics" — si no ha decidido nada
 * todavía o la rechazó, no se manda ni un solo evento.
 *
 * No hay IP, user-agent ni ningún dato personal en el evento: solo un
 * `sessionId` aleatorio (crypto.randomUUID, regenerado cada pestaña vía
 * sessionStorage) que sirve para calcular sesiones únicas y el embudo,
 * nunca para identificar a una persona entre visitas o sitios.
 */
export type AnalyticsEventType = "pageview" | "add_to_cart" | "begin_checkout" | "purchase";

export interface AnalyticsEvent {
  type: AnalyticsEventType;
  path: string;
  sessionId: string;
  ts: string;
  meta?: Record<string, string | number>;
}

const FILE = "analytics-events.json";
// Tope de eventos guardados — evita crecimiento sin límite en un JSON local;
// suficiente para una demo (miles de sesiones), no pensado para tráfico real
// a escala (ahí haría falta una base de datos/almacén con agregación).
const MAX_EVENTS = 20000;

// El evento de mayor volumen del sitio (uno por cada cambio de ruta, en
// cada visita con la cookie de analítica aceptada) — sin bloqueo, era el
// que más rápido perdía datos bajo tráfico concurrente real.
export async function recordEvent(event: AnalyticsEvent): Promise<void> {
  await withFileLock(FILE, async () => {
    const events = await readJson<AnalyticsEvent[]>(FILE, []);
    events.push(event);
    const trimmed = events.length > MAX_EVENTS ? events.slice(events.length - MAX_EVENTS) : events;
    await writeJson(FILE, trimmed);
  });
}

export async function readEvents(): Promise<AnalyticsEvent[]> {
  return readJson<AnalyticsEvent[]>(FILE, []);
}

export interface AnalyticsSummary {
  totalEvents: number;
  totalPageviews: number;
  uniqueSessions: number;
  topPaths: Array<{ path: string; count: number }>;
  funnel: {
    sessionsWithPageview: number;
    sessionsWithAddToCart: number;
    sessionsWithBeginCheckout: number;
    sessionsWithPurchase: number;
  };
  rangeDays: number;
}

export function summarize(events: AnalyticsEvent[], rangeDays: number): AnalyticsSummary {
  const cutoff = Date.now() - rangeDays * 24 * 60 * 60 * 1000;
  const inRange = events.filter((e) => new Date(e.ts).getTime() >= cutoff);

  const pathCounts = new Map<string, number>();
  const sessionsByType: Record<AnalyticsEventType, Set<string>> = {
    pageview: new Set(),
    add_to_cart: new Set(),
    begin_checkout: new Set(),
    purchase: new Set(),
  };
  const allSessions = new Set<string>();

  for (const e of inRange) {
    allSessions.add(e.sessionId);
    sessionsByType[e.type]?.add(e.sessionId);
    if (e.type === "pageview") pathCounts.set(e.path, (pathCounts.get(e.path) ?? 0) + 1);
  }

  const topPaths = Array.from(pathCounts.entries())
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalEvents: inRange.length,
    totalPageviews: inRange.filter((e) => e.type === "pageview").length,
    uniqueSessions: allSessions.size,
    topPaths,
    funnel: {
      sessionsWithPageview: sessionsByType.pageview.size,
      sessionsWithAddToCart: sessionsByType.add_to_cart.size,
      sessionsWithBeginCheckout: sessionsByType.begin_checkout.size,
      sessionsWithPurchase: sessionsByType.purchase.size,
    },
    rangeDays,
  };
}
