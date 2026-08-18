"use client";

import { Reveal } from "./Reveal";
import { useTranslations } from "@/lib/i18n/localeStore";
import { PhotoSlot } from "@/components/PhotoSlot";

export function PackagingContent() {
  const { t } = useTranslations();
  const m = t.misc;
  const steps = [
    [m.packagingStep1Title, m.packagingStep1Body],
    [m.packagingStep2Title, m.packagingStep2Body],
    [m.packagingStep3Title, m.packagingStep3Body],
    [m.packagingStep4Title, m.packagingStep4Body],
  ];

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <div className="relative mb-8 aspect-21/9 overflow-hidden rounded-3xl">
        <PhotoSlot name="packaging-hero" alt="" fallback={<div className="absolute inset-0 bg-surface-2" />} />
      </div>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">{m.packagingEyebrow}</p>
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">{m.packagingTitle}</h1>
      <p className="mt-4 max-w-xl text-ink-soft">{m.packagingSubtitle}</p>

      <ol className="mt-12 flex flex-col gap-8">
        {steps.map(([title, body], i) => (
          <Reveal key={title}>
            <li className="flex gap-5 border-t border-line pt-6">
              <span className="font-display text-2xl text-terracotta">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="font-display text-xl font-semibold">{title}</h2>
                <p className="mt-1.5 text-sm text-ink-soft">{body}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>

      <p className="mt-12 rounded-2xl bg-surface-2 p-5 text-sm text-ink-soft">
        {m.packagingFooterBefore}{" "}
        <a href="/checkout" className="font-semibold text-terracotta underline">
          {m.packagingFooterLink}
        </a>
        .
      </p>
    </section>
  );
}
