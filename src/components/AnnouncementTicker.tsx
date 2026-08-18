"use client";

import { useEffect, useState } from "react";

interface Announcement {
  icon: string;
  text: string;
}

/**
 * Ticker de anuncios para mobile — en desktop los 3 mensajes caben en línea
 * (barra estática ya existente), pero en `<sm` no había ningún anuncio
 * visible (la barra estaba oculta por completo bajo `sm:flex`). Este ticker
 * rota los 3 mensajes uno a uno con un deslizamiento lateral ("pasando de
 * un lado a otro"), respeta `prefers-reduced-motion` (transición colapsada
 * globalmente, ver globals.css) y se pausa si el usuario tiene el foco/hover
 * encima.
 */
export function AnnouncementTicker({ items }: { items: Announcement[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 3500);
    return () => clearInterval(id);
  }, [paused, items.length]);

  const current = items[index];
  if (!current) return null;

  return (
    <div
      className="flex items-center justify-center gap-1.5 overflow-hidden border-b border-white/10 px-4 py-2 text-[0.7rem] text-white/80 sm:hidden"
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <span key={index} className="flex items-center gap-1.5 transition-all duration-500 ease-out" style={{ animation: "announcement-slide 500ms ease-out" }}>
        <span aria-hidden="true">{current.icon}</span>
        <span>{current.text}</span>
      </span>
    </div>
  );
}
