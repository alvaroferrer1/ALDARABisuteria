import { cookies } from "next/headers";
import type { Metadata } from "next";
import { isValidAdminCookie, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import { readEvents, summarize } from "@/lib/analytics";
import { AdminAnalyticsLogin } from "@/components/AdminAnalyticsLogin";
import { AdminAnalyticsLogoutButton } from "@/components/AdminAnalyticsLogoutButton";

export const metadata: Metadata = { title: "Analítica", robots: { index: false, follow: false } };

/**
 * Panel interno de analítica local (Bloque 4 de la hoja de ruta,
 * CLAUDE.md) — no está enlazado desde ninguna navegación pública, solo
 * accesible conociendo la URL y la contraseña (ver lib/adminAuth.ts).
 * Todos los datos vienen de `data/analytics-events.json`, generado por
 * `AnalyticsTracker` + `trackEvent` (solo si el visitante aceptó la
 * cookie de analítica) y por el registro server-side de "purchase" en
 * `POST /api/orders`. Nada de esto sale del propio servidor: sin Google
 * Analytics, sin Meta Pixel, sin ningún tercero.
 */
export default async function AdminAnalyticsPage() {
  const cookieStore = await cookies();
  const authed = isValidAdminCookie(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
  if (!authed) return <AdminAnalyticsLogin />;

  const events = await readEvents();
  const summary30 = summarize(events, 30);
  const summary7 = summarize(events, 7);

  const funnelSteps = [
    { label: "Visitaron el sitio", value: summary30.funnel.sessionsWithPageview },
    { label: "Añadieron al carrito", value: summary30.funnel.sessionsWithAddToCart },
    { label: "Llegaron al checkout", value: summary30.funnel.sessionsWithBeginCheckout },
    { label: "Compraron", value: summary30.funnel.sessionsWithPurchase },
  ];
  const maxFunnel = Math.max(1, funnelSteps[0].value);

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-terracotta">Panel interno</p>
          <h1 className="font-display text-3xl font-semibold">Analítica de ALDARA</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Datos 100% locales, sin ningún servicio de terceros. Solo cuenta lo que los visitantes que aceptaron la
            cookie de analítica generaron navegando.
          </p>
        </div>
        <AdminAnalyticsLogoutButton />
      </div>

      {events.length === 0 && (
        <p className="mb-8 rounded-2xl bg-surface-2 p-6 text-sm text-ink-soft">
          Todavía no hay eventos registrados. Navega por el sitio con la cookie de analítica aceptada (banner de
          cookies → &ldquo;Aceptar todas&rdquo; o &ldquo;Personalizar&rdquo; → Analítica) y vuelve aquí.
        </p>
      )}

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <StatCard label="Sesiones (30 días)" value={summary30.uniqueSessions} />
        <StatCard label="Páginas vistas (30 días)" value={summary30.totalPageviews} />
        <StatCard label="Sesiones (7 días)" value={summary7.uniqueSessions} />
      </div>

      <div className="mb-10">
        <h2 className="mb-4 font-display text-lg font-semibold">Embudo de compra (30 días)</h2>
        <div className="flex flex-col gap-3 rounded-2xl border border-line p-6">
          {funnelSteps.map((step, i) => {
            const pct = maxFunnel > 0 ? Math.round((step.value / maxFunnel) * 100) : 0;
            const prevValue = i > 0 ? funnelSteps[i - 1].value : null;
            const dropoff = prevValue && prevValue > 0 ? Math.round(((prevValue - step.value) / prevValue) * 100) : null;
            return (
              <div key={step.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{step.label}</span>
                  <span className="text-ink-soft">
                    {step.value} {dropoff !== null && dropoff > 0 && <span className="text-terracotta">· −{dropoff}%</span>}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-surface-2">
                  <div className="h-full rounded-full bg-terracotta transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-display text-lg font-semibold">Páginas más vistas (30 días)</h2>
        {summary30.topPaths.length === 0 ? (
          <p className="text-sm text-ink-soft">Sin datos todavía.</p>
        ) : (
          <ul className="flex flex-col gap-2 rounded-2xl border border-line p-6">
            {summary30.topPaths.map((p) => (
              <li key={p.path} className="flex items-center justify-between text-sm">
                <span className="truncate font-mono text-xs text-ink-soft">{p.path}</span>
                <span className="font-semibold">{p.count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-line p-5">
      <p className="font-display text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-ink-soft">{label}</p>
    </div>
  );
}
