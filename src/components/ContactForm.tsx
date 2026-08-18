"use client";

import { useState } from "react";
import { whatsappHref } from "@/lib/whatsapp";

const REASONS = [
  "Tengo una duda sobre una pieza",
  "Necesito ayuda para regalar",
  "Tengo un problema con mi pedido",
  "Quiero personalizar algo",
  "Necesito una reparación",
  "Otra cosa",
];

const REASON_COPY: Record<string, string> = {
  "Tengo una duda sobre una pieza": "Cuéntanos qué pieza es (nombre o enlace) y qué necesitas saber.",
  "Necesito ayuda para regalar": "Dinos para quién es, el presupuesto y qué le gusta — te proponemos opciones. También puedes usar el buscador de regalos.",
  "Tengo un problema con mi pedido": "Indícanos el número de pedido si lo tienes a mano, así respondemos más rápido.",
  "Quiero personalizar algo": "Cuéntanos qué pieza quieres personalizar y cómo (iniciales, colores, combinación).",
  "Necesito una reparación": "Cuéntanos qué le pasa a la pieza (cierre, cadena, piedra) y desde cuándo la tienes — te decimos si tiene arreglo y el coste.",
  "Otra cosa": "Escríbenos lo que necesites, te leemos.",
};

export function ContactForm() {
  const [reason, setReason] = useState(REASONS[0]);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const showOrderField = reason === "Tengo un problema con mi pedido";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Capturamos el elemento <form> ANTES del await: React vacía los campos
    // pooled del SyntheticEvent (incluido currentTarget) en cuanto el
    // manejador síncrono termina, así que usarlo después de un await lanza
    // "Cannot read properties of null" — bug real detectado con Playwright.
    const formEl = e.currentTarget;
    setStatus("loading");
    const form = new FormData(formEl);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      reason,
      message: form.get("message"),
      orderId: form.get("orderId") || undefined,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo enviar el mensaje.");
      setStatus("ok");
      setMessage("¡Recibido! Te respondemos lo antes posible.");
      formEl.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Ha ocurrido un error.");
    }
  };

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-ink-soft">¿Qué te trae por aquí?</p>
      <div className="mb-6 flex flex-wrap gap-2">
        {REASONS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setReason(r)}
            className={`rounded-full border px-4 py-2 text-xs font-medium ${reason === r ? "border-ink bg-ink text-ivory" : "border-line"}`}
          >
            {r}
          </button>
        ))}
      </div>

      <p className="mb-4 text-sm text-ink-soft" aria-live="polite">
        {REASON_COPY[reason]}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink-soft">Nombre</span>
            <input name="name" required maxLength={100} className="rounded-lg border border-line bg-surface px-3.5 py-2.5" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink-soft">Email</span>
            <input name="email" type="email" required maxLength={120} className="rounded-lg border border-line bg-surface px-3.5 py-2.5" />
          </label>
        </div>
        {showOrderField && (
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink-soft">Número de pedido (opcional)</span>
            <input name="orderId" maxLength={60} placeholder="Ej. VEN-2026-00123" className="rounded-lg border border-line bg-surface px-3.5 py-2.5" />
          </label>
        )}
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink-soft">Mensaje</span>
          <textarea name="message" required rows={5} maxLength={2000} className="rounded-lg border border-line bg-surface px-3.5 py-2.5" />
        </label>
        <p role="status" aria-live="polite" className={`min-h-4 text-sm ${status === "error" ? "font-semibold text-red-600" : "text-terracotta"}`}>
          {message}
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={status === "loading"} className="rounded-full bg-ink px-6 py-3 font-semibold text-ivory disabled:opacity-50">
            {status === "loading" ? "Enviando..." : "Enviar mensaje"}
          </button>
          <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line px-6 py-3 text-sm font-semibold">
            O escríbenos por WhatsApp
          </a>
        </div>
      </form>
    </div>
  );
}
