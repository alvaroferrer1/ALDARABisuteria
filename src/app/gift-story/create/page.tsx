import type { Metadata } from "next";
import { GiftStoryForm } from "@/components/GiftStoryForm";

export const metadata: Metadata = {
  title: "Crea una historia de regalo",
  description: "Acompaña tu regalo con un mensaje privado: una página propia, no indexada, que puedes eliminar cuando quieras.",
};

export default function GiftStoryCreatePage() {
  return (
    <section className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">Regalar una historia</p>
      <h1 className="mb-3 font-display text-3xl font-semibold sm:text-4xl">Que el regalo cuente algo más</h1>
      <p className="mb-8 text-ink-soft">
        Escribe por qué elegiste esa pieza. Generamos un enlace privado (no aparece en buscadores) que puedes
        compartir junto al regalo, y que puedes borrar en cualquier momento.
      </p>
      <GiftStoryForm />
    </section>
  );
}
