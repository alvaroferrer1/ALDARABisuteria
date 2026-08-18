"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * QR real (mismo endpoint /api/gift-story/qr que ya genera SVGs reales con la
 * librería `qrcode`) que apunta al pasaporte privado de esta pieza. No es un
 * "sello de verificación" — solo un atajo para abrir esta misma página desde
 * el móvil; sigue requiriendo sesión iniciada para verse.
 *
 * Bug real corregido en auditoría visual: calcular `url` inline con
 * `typeof window !== "undefined"` en el cuerpo del render NO funciona en un
 * client component — quedaba anclado al `path` relativo del render de
 * servidor (donde `window` no existe) y nunca se actualizaba con el origin
 * completo. El endpoint exige una URL absoluta y devolvía 400 con el path
 * relativo, dejando el `<img>` roto en TODOS los pasaportes. `useSyncExternalStore`
 * es el patrón correcto para un valor que difiere entre servidor y cliente
 * (mismo problema que resuelve para el store de locale de este proyecto).
 */
export function PassportQR({ path }: { path: string }) {
  const url = useSyncExternalStore(
    noopSubscribe,
    () => `${window.location.origin}${path}`,
    () => path,
  );

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-line p-4">
      {/* Bug real corregido: el QR se genera con módulos oscuros sobre fondo
          transparente (ver route.ts) — en dark mode heredaba el fondo oscuro
          de la página y quedaba invisible/inescaneable. Un QR necesita
          contraste real para poder leerse, así que su tarjeta lleva SIEMPRE
          fondo blanco fijo, sin depender del tema (igual que cualquier QR
          impreso). */}
      <img
        src={`/api/gift-story/qr?url=${encodeURIComponent(url)}`}
        alt="Código QR de este pasaporte"
        width={84}
        height={84}
        className="shrink-0 rounded-md bg-white p-1.5"
      />
      <p className="text-xs text-ink-soft">
        Escanea para abrir este pasaporte en el móvil. Es un enlace privado: sigue pidiendo iniciar sesión.
      </p>
    </div>
  );
}
