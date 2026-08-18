"use client";

import Link from "next/link";
import { Reveal } from "./Reveal";
import { useTranslations } from "@/lib/i18n/localeStore";
import { PhotoSlot } from "./PhotoSlot";

/**
 * Hero de Home — calcado en COMPOSICIÓN de ALDARA_Propuesta_Cliente_FINAL_v2.pdf
 * p.12 ("Home / universo ALDARA"): foto a sangre completa de fondo (un
 * brazo con pulseras y charms, tonos cálidos), texto superpuesto a la
 * izquierda sobre velo oscuro, tarjeta flotante "Raíces que inspiran"
 * arriba a la derecha SOBRE la foto, no en un panel separado.
 *
 * GENERATED_DEMO: no hay fotografía real todavía (la propia p.12 del PDF
 * dice literalmente "la pieza concreta es conceptual hasta sustituirla por
 * fotografía real"), así que en vez de una foto se usa una composición
 * generativa más trabajada que un icono suelto: textura de grano real
 * (feTurbulence), silueta de muñeca+pulseras con profundidad/sombra,
 * degradado cálido oscuro de estudio. Sustituir por fotografía macro real
 * en cuanto exista (ver ASSET_REGISTRY.md) — la composición y el texto ya
 * están en su sitio final para ese reemplazo.
 */
export function HomeHero() {
  const { t } = useTranslations();
  return (
    <section className="relative overflow-hidden">
      {/* En mobile la altura la marca el propio contenido (aspect-auto + min-h),
          nunca un aspect-ratio fijo que recorte el texto apilado — bug real
          detectado visualmente (la ceja "Hecho a mano en Puerto Almenara" se cortaba
          arriba en 390px). Desde sm sí hay hueco horizontal para el aspect-ratio. */}
      <div className="relative aspect-auto min-h-150 w-full sm:aspect-21/9 sm:min-h-0 lg:aspect-21/8">
        <PhotoSlot name="home-hero" alt={t.home.title1 + " " + t.home.title2} fallback={<HeroPhotoPlaceholder />} />

        {/* Velo cálido oscuro para que el texto blanco sea legible sobre la "foto" en cualquier tono */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(100deg, rgba(20,12,8,0.72) 0%, rgba(20,12,8,0.48) 38%, rgba(20,12,8,0.08) 65%, rgba(20,12,8,0) 85%)" }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex h-full flex-col justify-center px-4 pb-10 pt-24 sm:px-8 sm:pb-0 sm:pt-0 lg:px-16">
          <Reveal className="max-w-lg">
            <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#e3c665]">
              <svg viewBox="0 0 3 2" width="18" role="img" aria-label="Colombia">
                <rect width="3" height="1" fill="#FCD116" />
              <rect width="3" height="0.5" y="1" fill="#003893" />
              <rect width="3" height="0.5" y="1.5" fill="#CE1126" />
              </svg>
              <svg viewBox="0 0 3 2" width="18" role="img" aria-label="Venezuela">
                <rect width="3" height="2" fill="#00247D" />
              <rect width="3" height="0.666" fill="#FFCC00" />
              <rect width="3" height="0.666" y="1.333" fill="#CF142B" />
              </svg>
              <span>{t.home.eyebrow}</span>
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] text-white sm:text-6xl">
              {t.home.title1}
              <br />
              <em className="not-italic text-[#e3c665]">{t.home.title2}</em>
            </h1>
            <p className="mt-5 max-w-md text-lg text-white/85">{t.home.subtitle}</p>

            <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
              {[
                [t.home.badge1, t.home.badge1sub],
                [t.home.badge2, t.home.badge2sub],
                [t.home.badge3, t.home.badge3sub],
              ].map(([title, sub]) => (
                <div key={title} className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" width="18" className="text-[#e3c665]" aria-hidden="true">
                    <path
                      d="M12 21s-7.5-4.6-10-9.3C.4 8.3 2.1 5 5.6 5c2 0 3.4 1 4.4 2.4C11 6 12.4 5 14.4 5c3.5 0 5.2 3.3 3.6 6.7C19.5 16.4 12 21 12 21Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <span className="text-xs text-white">
                    <span className="block font-semibold">{title}</span>
                    <span className="block text-white/70">{sub}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/colecciones" className="rounded-full bg-white px-7 py-3.5 font-semibold text-[#140c08] transition-transform hover:-translate-y-0.5">
                {t.home.ctaCollections}
              </Link>
              <Link
                href="/regalos"
                className="rounded-full border border-white/70 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white hover:text-[#140c08]"
              >
                {t.home.ctaGift}
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delayMs={200} className="absolute right-4 top-4 z-10 hidden w-44 rounded-2xl border border-white/15 bg-black/35 p-4 backdrop-blur-md sm:block lg:right-10 lg:top-10">
          <p className="mb-2 flex gap-1.5">
            <svg viewBox="0 0 3 2" width="20" role="img" aria-label="Venezuela">
              <rect width="3" height="2" fill="#00247D" />
              <rect width="3" height="0.666" fill="#FFCC00" />
              <rect width="3" height="0.666" y="1.333" fill="#CF142B" />
            </svg>
            <svg viewBox="0 0 3 2" width="20" role="img" aria-label="Colombia">
              <rect width="3" height="1" fill="#FCD116" />
              <rect width="3" height="0.5" y="1" fill="#003893" />
              <rect width="3" height="0.5" y="1.5" fill="#CE1126" />
            </svg>
          </p>
          <p className="text-xs font-bold uppercase tracking-wide text-[#e3c665]">{t.home.floatingTitle}</p>
          <p className="mt-1 text-xs text-white/80">{t.home.floatingText}</p>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Composición generativa "tipo foto de estudio": degradado cálido oscuro +
 * silueta de muñeca/antebrazo con pulseras y charms superpuestos + grano
 * fotográfico real vía filtro SVG feTurbulence, para que se lea como un
 * plano editorial con profundidad y no como un icono plano.
 */
function HeroPhotoPlaceholder() {
  return (
    <svg viewBox="0 0 1600 900" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="hero-photo-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#241209" />
          <stop offset="45%" stopColor="#5a2f18" />
          <stop offset="75%" stopColor="#a9663a" />
          <stop offset="100%" stopColor="#e3c088" />
        </linearGradient>
        <radialGradient id="hero-photo-vignette" cx="70%" cy="45%" r="65%">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.35" />
        </radialGradient>
        <radialGradient id="hero-spotlight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0d089" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f0d089" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hero-medallion-face" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f5dfa0" />
          <stop offset="55%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#9a7420" />
        </radialGradient>
        <filter id="hero-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
        </filter>
        <filter id="hero-soft-shadow">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>

      <rect width="1600" height="900" fill="url(#hero-photo-bg)" />

      {/* Halo de luz centrado — ancla visual real para que la composición no
          se lea como elementos sueltos sobre fondo plano. */}
      <ellipse cx="1180" cy="430" rx="440" ry="400" fill="url(#hero-spotlight)" />

      {/* Bug real corregido: la silueta de antebrazo (línea fina + degradado
          casi idéntico al fondo) era invisible en la práctica — verificado con
          zoom real sobre la captura, el resultado era "aros flotando en un
          vacío", exactamente lo detectado en la auditoría. Sustituida por el
          mismo enfoque que sí funcionó en Regalos: una pieza central sólida,
          grande y con relieve (medallón/colgante), en vez de intentar simular
          una fotografía que esta técnica no puede lograr. */}
      <ellipse cx="1180" cy="620" rx="220" ry="34" fill="#000" opacity="0.28" filter="url(#hero-soft-shadow)" />
      <circle cx="1180" cy="430" r="190" fill="url(#hero-medallion-face)" stroke="#7a5c1a" strokeWidth="4" />
      <circle cx="1180" cy="430" r="150" fill="none" stroke="#fbf1cf" strokeOpacity="0.55" strokeWidth="2" />
      {/* Grabado central — mapa/raíz estilizada, coherente con "Mapa del Alma" y el resto de piezas reales */}
      <g transform="translate(1180 430)" stroke="#5a4212" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M0,-70 C-40,-30 -40,30 0,70 C40,30 40,-30 0,-70Z" />
        <path d="M0,-70 V70 M-40,0 H40" strokeOpacity="0.6" />
      </g>
      {/* Anilla/argolla de suspensión arriba, para que se lea como colgante real */}
      <circle cx="1180" cy="228" r="22" fill="none" stroke="#7a5c1a" strokeWidth="8" />

      {/* Pulseras apiladas detrás del medallón — más gruesas y con sombra
          propia para dar volumen, ahora como acompañamiento, no como único
          contenido de la escena. */}
      <g transform="translate(1180 430) rotate(18)">
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <ellipse cx="0" cy={i * 40 + 190} rx={260 - i * 12} ry="54" fill="none" stroke="#000" strokeOpacity="0.2" strokeWidth="10" />
            <ellipse cx="0" cy={i * 40 + 186} rx={260 - i * 12} ry="54" fill="none" stroke={i % 2 === 0 ? "#f0d089" : "#c98a3f"} strokeWidth="7" />
          </g>
        ))}
      </g>

      {/* Constelación de puntos dorados en el resto del cuadro — llena el
          espacio negativo del tercio central sin competir con el texto. */}
      {[
        [700, 160],
        [780, 620],
        [860, 300],
        [640, 480],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i % 2 === 0 ? 3 : 2} fill="#e3c665" opacity="0.5" />
      ))}

      <rect width="1600" height="900" fill="url(#hero-photo-vignette)" />
      <rect width="1600" height="900" filter="url(#hero-grain)" />
    </svg>
  );
}
