import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { readSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";
import { readJson } from "@/lib/localDb";
import { REPAIR_STAGES, getSimulatedRepairStageIndex } from "@/lib/repairTracking";

export const metadata: Metadata = { title: "Mis reparaciones", robots: { index: false, follow: true } };

interface RepairRequest {
  id: string;
  name: string;
  email: string;
  pieceDescription: string;
  issue: string;
  requestedAt: string;
}

/**
 * Mejora real (POST_AUDIT_IMPROVEMENTS.md, bloque X): antes el estado de una
 * reparación solo se veía justo tras enviar el formulario, en esa misma
 * sesión de navegador — si el usuario volvía otro día, no había forma de
 * consultarlo. Esta página reutiliza el mismo `repair-requests.json` y el
 * mismo `getSimulatedRepairStageIndex` ya construidos para `/reparaciones`,
 * filtrados siempre por la sesión real (mismo patrón de seguridad que
 * `GET /api/repairs`: nunca por un email que mande el cliente).
 */
export default async function MyRepairsPage() {
  const cookieStore = await cookies();
  const user = readSessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!user) redirect("/account");

  const all = await readJson<RepairRequest[]>("repair-requests.json", []);
  const mine = all
    .filter((r) => r.email.toLowerCase() === user.email.toLowerCase())
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <Link href="/account" className="mb-6 inline-block text-sm text-ink-soft hover:text-ink">
        ← Volver a mi cuenta
      </Link>
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-terracotta">Mi cuenta</p>
      <h1 className="mb-2 font-display text-3xl font-semibold">Mis reparaciones</h1>
      <p className="mb-8 text-sm text-ink-soft">Solicitudes de reparación o Second Life enviadas con tu email, con su estado simulado de demostración.</p>

      {mine.length === 0 ? (
        <div className="rounded-2xl border border-line p-8 text-center">
          <p className="text-ink-soft">Todavía no has enviado ninguna solicitud de reparación.</p>
          <Link href="/reparaciones" className="mt-4 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory">
            Solicitar una reparación
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-5">
          {mine.map((r) => {
            const stageIndex = getSimulatedRepairStageIndex(r.requestedAt);
            return (
              <li key={r.id} className="rounded-2xl border border-line p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold">{r.pieceDescription}</p>
                  <p className="text-xs text-ink-soft">Ref. {r.id}</p>
                </div>
                <p className="mt-1 text-sm text-ink-soft">{r.issue}</p>
                <p className="mt-1 text-xs text-ink-soft">Enviada el {new Date(r.requestedAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</p>
                <ol className="mt-4 flex flex-wrap gap-2 text-xs">
                  {REPAIR_STAGES.map((stage, i) => (
                    <li key={stage.key} className={`rounded-full px-3 py-1.5 ${i <= stageIndex ? "bg-ink text-ivory" : "bg-surface-2 text-ink-soft"}`}>
                      {stage.label}
                    </li>
                  ))}
                </ol>
                <p className="mt-3 text-xs text-ink-soft">
                  Estado simulado de demostración, calculado a partir de la fecha de solicitud — sin conexión real con el taller todavía.
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
