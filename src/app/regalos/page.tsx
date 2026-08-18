import type { Metadata } from "next";
import { GiftFinder } from "@/components/GiftFinder";
import { RegalosHero, RegalosIdeasPrompt } from "@/components/RegalosHero";

export const metadata: Metadata = {
  title: "Buscador de Regalos",
  description: "Encuentra el regalo perfecto con nuestro Buscador de Regalos: persona, intención, estilo y presupuesto, y te proponemos piezas reales del catálogo.",
};

export default function RegalosPage() {
  return (
    <>
      {/* Hero a sangre completa — calcado del mockup "Gift Finder" (p.23):
          título "Encuentra el regalo perfecto" + 4 insignias, en vez del
          bloque de texto plano centrado que había antes (gap real detectado
          en la auditoría visual, ref. 3.1). */}
      <section className="relative overflow-hidden">
        <div className="relative aspect-auto min-h-100 w-full sm:aspect-21/9 sm:min-h-0 lg:aspect-21/8">
          <GiftFinderPhotoPlaceholder />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(100deg, rgba(20,12,8,0.62) 0%, rgba(20,12,8,0.32) 42%, rgba(20,12,8,0.04) 68%, rgba(20,12,8,0) 88%)" }}
            aria-hidden="true"
          />
          <div className="relative z-10 flex h-full flex-col justify-center px-4 py-14 sm:px-8 lg:px-16">
            <RegalosHero />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <GiftFinder />
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20 text-center sm:px-6">
        <RegalosIdeasPrompt />
      </section>
    </>
  );
}

/**
 * Bug real corregido (detectado en captura real, no solo en código): la
 * caja de regalo medía 80×70 unidades sobre un lienzo de 1600×900 — un
 * punto minúsculo perdido en un fondo casi vacío. Reescrita a una
 * composición de verdad: caja grande con lazo + relieve, halo de luz que
 * la ancla visualmente, y una segunda caja más pequeña + confeti de
 * partículas doradas repartido por el resto del encuadre para que no
 * quede espacio muerto.
 */
function GiftFinderPhotoPlaceholder() {
  return (
    <svg viewBox="0 0 1600 900" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="giftfinder-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#241209" />
          <stop offset="45%" stopColor="#7a4526" />
          <stop offset="100%" stopColor="#e3c088" />
        </linearGradient>
        <radialGradient id="giftfinder-vignette" cx="70%" cy="42%" r="65%">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.32" />
        </radialGradient>
        <radialGradient id="giftfinder-spotlight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f5e6c8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f5e6c8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="giftfinder-box-face" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbf1dd" />
          <stop offset="100%" stopColor="#e8d3a8" />
        </linearGradient>
        <filter id="giftfinder-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
        </filter>
        <filter id="giftfinder-blur">
          <feGaussianBlur stdDeviation="20" />
        </filter>
        <filter id="giftfinder-soft-shadow">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      <rect width="1600" height="900" fill="url(#giftfinder-bg)" />
      <g filter="url(#giftfinder-blur)" opacity="0.9">
        <ellipse cx="1220" cy="440" rx="340" ry="380" fill="#c9905f" opacity="0.7" />
      </g>
      <ellipse cx="1220" cy="440" rx="380" ry="340" fill="url(#giftfinder-spotlight)" />

      {/* Caja de regalo grande, con sombra propia + lazo real (no un cuadrado plano) */}
      <g transform="translate(1220 460)">
        <ellipse cx="0" cy="215" rx="190" ry="30" fill="#000" opacity="0.22" filter="url(#giftfinder-soft-shadow)" />
        <rect x="-160" y="-40" width="320" height="240" rx="10" fill="url(#giftfinder-box-face)" />
        <rect x="-160" y="-40" width="320" height="60" fill="#c96b4a" />
        <rect x="-18" y="-40" width="36" height="240" fill="#c96b4a" />
        {/* lazo */}
        <path d="M-70,-40 C-90,-90 -30,-100 0,-40 C30,-100 90,-90 70,-40Z" fill="#d4af37" stroke="#a9782a" strokeWidth="3" />
        <circle cx="0" cy="-40" r="16" fill="#e3c665" stroke="#a9782a" strokeWidth="3" />
      </g>

      {/* Segunda caja, más pequeña, para dar sensación de "varios regalos" */}
      <g transform="translate(1420 620) rotate(-8)">
        <rect x="-70" y="-60" width="140" height="120" rx="8" fill="#f0e2c4" opacity="0.92" />
        <rect x="-70" y="-8" width="140" height="16" fill="#7a4526" opacity="0.9" />
        <rect x="-8" y="-60" width="16" height="120" fill="#7a4526" opacity="0.9" />
      </g>

      {/* Confeti de partículas doradas — llena el resto del encuadre sin competir con el texto de la izquierda */}
      {[
        [980, 180, 4],
        [1080, 700, 3],
        [1350, 260, 3],
        [1500, 420, 4],
        [1150, 760, 3],
        [1480, 180, 3],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#f5e6c8" opacity="0.6" />
      ))}

      <rect width="1600" height="900" fill="url(#giftfinder-vignette)" />
      <rect width="1600" height="900" filter="url(#giftfinder-grain)" />
    </svg>
  );
}
