import type { ReactNode } from "react";

export function LegalLayout({ title, updated, note, children }: { title: string; updated: string; note?: string; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <h1 className="font-display text-3xl font-semibold">{title}</h1>
      <p className="mt-1 text-sm text-ink-soft">Última actualización: {updated}</p>
      {note && (
        <div className="mt-6 rounded-r-lg border-l-4 border-gold bg-surface-2 p-4 text-sm text-ink-soft">{note}</div>
      )}
      <div className="prose prose-sm mt-8 max-w-none [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_p]:mt-3 [&_p]:text-ink-soft [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1 [&_li]:text-ink-soft [&_a]:text-ink [&_a]:underline">
        {children}
      </div>
    </section>
  );
}
