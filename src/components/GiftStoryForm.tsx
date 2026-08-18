"use client";

import { useState } from "react";

export function GiftStoryForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      recipientName: form.get("recipientName"),
      message: form.get("message"),
      occasion: form.get("occasion"),
      place: form.get("place"),
      date: form.get("date"),
      productName: form.get("productName"),
    };
    const res = await fetch("/api/gift-story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus("error");
      setError(data.error ?? "No se pudo crear la historia.");
      return;
    }
    setLink(`${window.location.origin}/gift-story/${data.token}`);
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-line p-6">
        <p className="mb-3 font-semibold">Tu historia está lista.</p>
        <p className="mb-4 text-sm text-ink-soft">
          Comparte este enlace o el QR con quien vaya a recibir el regalo — puedes imprimirlo y meterlo en la caja.
          No aparece en buscadores y puedes eliminarlo cuando quieras desde la propia página.
        </p>
        <div className="mb-4 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG generado dinámicamente en /api/gift-story/qr, no es un asset estático de next/image */}
          <img
            src={`/api/gift-story/qr?url=${encodeURIComponent(link)}`}
            alt={`Código QR de tu historia de regalo: ${link}`}
            width={200}
            height={200}
            className="rounded-xl border border-line bg-white p-3"
          />
        </div>
        <a href={link} className="break-all rounded-xl bg-surface-2 p-3 text-sm underline">
          {link}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="recipientName" className="mb-1 block text-sm font-semibold">
          ¿Para quién es? (opcional)
        </label>
        <input
          id="recipientName"
          name="recipientName"
          placeholder="María"
          className="w-full rounded-xl border border-line bg-transparent px-4 py-2.5"
        />
      </div>
      <div>
        <label htmlFor="occasion" className="mb-1 block text-sm font-semibold">
          Ocasión
        </label>
        <input
          id="occasion"
          name="occasion"
          required
          placeholder="Cumpleaños, aniversario, porque sí…"
          className="w-full rounded-xl border border-line bg-transparent px-4 py-2.5"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="place" className="mb-1 block text-sm font-semibold">
            Lugar (opcional)
          </label>
          <input id="place" name="place" placeholder="Puerto Almenara" className="w-full rounded-xl border border-line bg-transparent px-4 py-2.5" />
        </div>
        <div>
          <label htmlFor="date" className="mb-1 block text-sm font-semibold">
            Fecha (opcional)
          </label>
          <input id="date" name="date" placeholder="17 de mayo de 2026" className="w-full rounded-xl border border-line bg-transparent px-4 py-2.5" />
        </div>
      </div>
      <div>
        <label htmlFor="productName" className="mb-1 block text-sm font-semibold">
          Pieza que regalas (opcional)
        </label>
        <input id="productName" name="productName" placeholder="Aro Caribe" className="w-full rounded-xl border border-line bg-transparent px-4 py-2.5" />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-semibold">
          Tu mensaje
        </label>
        <textarea
          id="message"
          name="message"
          required
          maxLength={600}
          rows={5}
          placeholder="Por qué elegiste esta pieza, qué quieres decirle…"
          className="w-full rounded-xl border border-line bg-transparent px-4 py-2.5"
        />
      </div>
      {status === "error" && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-ink px-6 py-3 font-semibold text-ivory disabled:opacity-50"
      >
        {status === "sending" ? "Creando…" : "Crear historia privada"}
      </button>
    </form>
  );
}
