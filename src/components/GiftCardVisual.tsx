import { LogoMark } from "./Logo";
import { money } from "@/lib/storage";

/**
 * Diseño visual de la tarjeta regalo (POST_AUDIT_IMPROVEMENTS.md, bloque KK):
 * antes el resultado era un bloque de texto con borde punteado — funcional,
 * pero no algo que tuviera sentido "regalar" como imagen. Esto reutiliza el
 * mismo lenguaje visual generativo del resto del sitio (paleta azul profundo
 * + dorado del footer/Header, textura de grano vía `feTurbulence`, igual
 * técnica que `DemoPhoto`/`HomeHero`) en proporción de tarjeta real (~1.6:1),
 * sin fotografía porque no existe ninguna.
 */
export function GiftCardVisual({
  code,
  amount,
  recipientName,
}: {
  code: string;
  amount: number;
  recipientName?: string;
}) {
  return (
    <div
      className="relative mx-auto aspect-[1.6/1] w-full max-w-sm overflow-hidden rounded-2xl text-white shadow-xl"
      style={{ background: "linear-gradient(135deg, #0d1220 0%, #181b23 55%, #2a2e37 100%)" }}
    >
      <svg viewBox="0 0 400 250" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id="gift-card-glow" cx="85%" cy="10%" r="70%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </radialGradient>
          <filter id="gift-card-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise" />
            <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
          </filter>
        </defs>
        <rect width="400" height="250" fill="url(#gift-card-glow)" />
        <rect width="400" height="250" filter="url(#gift-card-grain)" />
        {/* Rama floral dorada, mismo motivo que el footer — firma de marca reconocible sin depender de fotografía. */}
        <g className="text-[#d4af37]/25" stroke="currentColor" strokeWidth="1.2" fill="none" transform="translate(300 150) scale(0.55)">
          <path d="M30,258 C46,208 52,168 68,138 C88,102 122,86 152,80 C160,78 165,77 168,76" />
          <g transform="rotate(-58)"><path d="M0,0 C-11,-16 -10,-38 0,-58 C10,-38 11,-16 0,0 Z" /></g>
          <g transform="rotate(-8)"><path d="M0,0 C-13,-24 -13,-58 0,-84 C13,-58 13,-24 0,0 Z" /></g>
          <g transform="rotate(38)"><path d="M0,0 C-11,-19 -10,-46 0,-68 C10,-46 11,-19 0,0 Z" /></g>
        </g>
      </svg>

      <div className="relative flex h-full flex-col justify-between p-6">
        <div className="flex items-center gap-2">
          <LogoMark size={26} className="text-[#d4af37]" />
          <span className="font-display text-sm font-semibold tracking-[0.15em]">ALDARA</span>
        </div>

        <div>
          {recipientName && <p className="mb-1 text-xs uppercase tracking-widest text-white/60">Para {recipientName}</p>}
          <p className="font-display text-3xl font-semibold sm:text-4xl">{money(amount)}</p>
          <p data-testid="gift-card-code" className="mt-3 font-mono text-sm tracking-[0.2em] text-[#d4af37]">
            {code}
          </p>
        </div>
      </div>
    </div>
  );
}
