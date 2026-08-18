"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { whatsappHref } from "@/lib/whatsapp";
import { buildHandoffHref } from "@/lib/assistant/humanHandoff";
import type { AssistantReply } from "@/lib/assistant/types";
import { money } from "@/lib/storage";
import { Icon } from "./Icon";

interface Turn {
  role: "user" | "assistant";
  text: string;
  reply?: AssistantReply;
}

/**
 * Asistente ALDARA — arquitectura: UI (este componente) → `/api/assistant`
 * (route handler) → `assistantProvider` (intención + DataTools sobre el
 * catálogo/pedidos reales) → escalado humano por WhatsApp cuando hace falta.
 * Ver lib/assistant/. Es un asistente por reglas real (no un LLM todavía),
 * documentado así en la propia UI, con la misma interfaz que tendría uno con
 * IA generativa detrás — sustituible sin rehacer el componente.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [lastProductId, setLastProductId] = useState<string | undefined>();
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [keyboardInset, setKeyboardInset] = useState(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [turns]);

  // Teclado virtual en mobile (especialmente iOS Safari): sin esto, el
  // panel fixed puede quedar parcialmente tapado por el teclado o el campo
  // de texto puede quedar fuera de la parte visible. `visualViewport` da la
  // altura real visible (descontando el teclado) y la usamos para levantar
  // el panel justo lo necesario, en vez de asumir que `100vh` sigue siendo
  // toda la pantalla.
  useEffect(() => {
    if (!open || typeof window === "undefined" || !window.visualViewport) return;
    const vv = window.visualViewport;
    function update() {
      const inset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKeyboardInset(inset);
    }
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [open]);

  async function send(text: string) {
    const trimmed = text.trim().slice(0, 500);
    if (!trimmed || sending) return;
    setTurns((t) => [...t, { role: "user", text: trimmed }]);
    setInput("");
    setSending(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, lastProductId }),
      });
      const reply: AssistantReply = await res.json();
      if (reply.contextProductId) setLastProductId(reply.contextProductId);
      setTurns((t) => [...t, { role: "assistant", text: reply.text, reply }]);
    } catch {
      setTurns((t) => [
        ...t,
        { role: "assistant", text: "No he podido conectar ahora mismo. Prueba de nuevo o escríbenos por WhatsApp.", reply: { intent: "unknown", text: "", lowConfidence: true } },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const conversationSummary = turns.filter((t) => t.role === "user").slice(-1)[0]?.text || "";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Abrir asistente ALDARA"
        className="fixed bottom-24 right-4 z-[90] flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-105 lg:bottom-6 lg:right-6"
      >
        <Icon name="whatsapp" size={26} className="text-white" />
      </button>

      <div
        ref={panelRef}
        role="dialog"
        aria-label="Asistente ALDARA"
        className={`fixed inset-x-3 bottom-24 z-90 mx-auto flex max-h-[75vh] w-auto max-w-95 flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl transition-all duration-300 sm:inset-x-auto sm:right-4 sm:bottom-42 sm:w-90 lg:right-6 lg:bottom-24 ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
        style={keyboardInset > 0 ? { bottom: keyboardInset + 12 } : undefined}
      >
        <div className="flex shrink-0 items-center gap-2.5 bg-ink px-4.5 py-4 text-ivory">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold font-display font-semibold text-ink">V</span>
          <div className="flex-1">
            <strong className="block text-sm">Asistente ALDARA</strong>
            <span className="flex items-center gap-1.5 text-xs text-ivory/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3ddc84]" /> Basado en reglas · catálogo real
            </span>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar chat" className="shrink-0 text-ivory">
            ✕
          </button>
        </div>

        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto p-4.5">
          {turns.length === 0 && (
            <>
              <p className="mb-3.5 rounded-2xl rounded-bl-sm bg-surface-2 px-3.5 py-3 text-sm">
                ¡Hola! 👋 Pregúntame por piezas, cuidados, stock, tu pedido o devoluciones.
              </p>
              <div className="flex flex-col gap-2">
                {["Busco un regalo por menos de 25€", "¿Cómo cuido una pulsera?", "¿Dónde está mi pedido?"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-xl border border-line px-3.5 py-2.5 text-left text-sm hover:border-gold"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          {turns.map((turn, i) => (
            <div key={i} className={`mb-3 flex ${turn.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[90%]">
              <p
                className={`inline-block rounded-2xl px-3.5 py-3 text-sm ${
                  turn.role === "user" ? "rounded-br-sm bg-ink text-ivory" : "rounded-bl-sm bg-surface-2"
                }`}
              >
                {turn.text}
              </p>
              {turn.reply?.products && turn.reply.products.length > 0 && (
                <ul className="mt-2 flex flex-col gap-2">
                  {turn.reply.products.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/producto/${p.slug}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between rounded-xl border border-line px-3.5 py-2.5 text-sm hover:border-gold"
                      >
                        <span>{p.name}</span>
                        <span className="text-ink-soft">{money(p.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {turn.reply?.links && turn.reply.links.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {turn.reply.links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-gold"
                    >
                      {l.label} →
                    </Link>
                  ))}
                </div>
              )}
              {turn.role === "assistant" && turn.reply?.lowConfidence && (
                <a
                  href={buildHandoffHref(conversationSummary)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center gap-2 rounded-full bg-[#25D366]/10 px-3.5 py-2 text-xs font-semibold text-[#1c8a44] hover:bg-[#25D366]/20"
                >
                  <Icon name="whatsapp" size={14} /> Hablar por WhatsApp
                </a>
              )}
              </div>
            </div>
          ))}

          {sending && <p className="text-xs text-ink-soft">Pensando…</p>}
        </div>

        <form onSubmit={handleSubmit} className="flex shrink-0 gap-2 border-t border-line p-3">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => inputRef.current?.scrollIntoView({ block: "nearest" })}
            placeholder="Escribe aquí…"
            maxLength={500}
            aria-label="Pregunta al asistente ALDARA"
            className="min-w-0 flex-1 rounded-full border border-line bg-transparent px-3.5 py-2 text-sm"
          />
          <button type="submit" disabled={sending || !input.trim()} className="shrink-0 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-ivory disabled:opacity-40">
            Enviar
          </button>
        </form>
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 border-t border-line px-4.5 py-2.5 text-center text-xs font-semibold text-ink-soft hover:text-terracotta"
        >
          O continuar directamente por WhatsApp →
        </a>
      </div>
    </>
  );
}
