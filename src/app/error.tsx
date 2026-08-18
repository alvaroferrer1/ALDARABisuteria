"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">Error 500</p>
      <h1 className="font-display text-6xl font-semibold sm:text-7xl">Se nos ha roto un hilo</h1>
      <p className="mt-4 max-w-sm text-ink-soft">
        Algo ha fallado de nuestro lado. Ya lo sabemos y no es culpa tuya: prueba a volver a intentarlo o vuelve a la
        home.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-ink px-7 py-3.5 font-semibold text-ivory transition-transform hover:-translate-y-0.5"
        >
          Reintentar
        </button>
        <Link href="/" className="rounded-full border border-line px-7 py-3.5 font-semibold hover:border-ink">
          Volver a ALDARA
        </Link>
      </div>
    </section>
  );
}
