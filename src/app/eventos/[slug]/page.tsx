import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EVENTS, getEventBySlug } from "@/lib/events";
import { DemoPhoto } from "@/components/DemoPhoto";
import { EventRsvpForm } from "@/components/EventRsvpForm";

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/eventos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return {};
  return { title: event.title, description: event.description };
}

export default async function EventoPage({ params }: PageProps<"/eventos/[slug]">) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const isPast = new Date(event.date) < new Date();

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="relative aspect-auto min-h-100 w-full sm:aspect-21/9 sm:min-h-0 lg:aspect-21/8">
          <DemoPhoto seed={event.slug} tone={event.tone} />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" aria-hidden="true" />
          <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white sm:left-8 sm:top-8">
            Evento demo
          </span>
          <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-10 sm:px-8 lg:px-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#e3c665]">{event.type}</p>
            <h1 className="mt-2 max-w-lg font-display text-4xl font-semibold text-white sm:text-5xl">{event.title}</h1>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-4xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="text-ink-soft">{event.description}</p>
          <dl className="mt-6 flex flex-col gap-3 text-sm">
            <div className="flex justify-between border-b border-line pb-3">
              <dt className="text-ink-soft">Fecha</dt>
              <dd className="font-semibold">{new Date(event.date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</dd>
            </div>
            <div className="flex justify-between border-b border-line pb-3">
              <dt className="text-ink-soft">Lugar</dt>
              <dd className="font-semibold">{event.location}</dd>
            </div>
            <div className="flex justify-between border-b border-line pb-3">
              <dt className="text-ink-soft">Precio</dt>
              <dd className="font-semibold">{event.price === "Gratis" ? "Gratis" : `${event.price} €`}</dd>
            </div>
            {event.spotsLeft !== null && (
              <div className="flex justify-between">
                <dt className="text-ink-soft">Plazas</dt>
                <dd className="font-semibold">{event.spotsLeft > 0 ? `${event.spotsLeft} disponibles` : "Agotadas"}</dd>
              </div>
            )}
          </dl>
        </div>

        <div>
          {isPast || event.spotsLeft === 0 ? (
            <div className="rounded-2xl bg-surface-2 p-6 text-center text-sm text-ink-soft">
              {isPast ? "Este evento demo ya ha finalizado." : "Plazas agotadas para este evento demo."}
            </div>
          ) : (
            <EventRsvpForm eventSlug={event.slug} />
          )}
        </div>
      </section>
    </>
  );
}
