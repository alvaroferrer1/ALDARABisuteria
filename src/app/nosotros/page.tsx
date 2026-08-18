import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { PhotoSlot } from "@/components/PhotoSlot";

export const metadata: Metadata = {
  title: "Nuestra historia",
  description: "Conoce la historia de ALDARA: bisutería artesanal nacida en Puerto Almenara de la unión entre Venezuela y Colombia.",
};

const TIMELINE = [
  { year: "2023", title: "La primera pulsera", text: "Una VZLA hecha en casa para una amiga. El inicio de todo, sin saber que sería el inicio de algo más." },
  { year: "2024", title: "Primer mercadillo", text: "ALDARA sale de la cocina y llega a su primera feria de artesanía en Puerto Almenara." },
  { year: "2025", title: "Nace @aldara.bisuteria", text: "Abrimos Instagram para mostrar el proceso y llegar a más manos que las del barrio." },
  { year: "2026", title: "Esta web", text: "Damos el salto a tienda online, siempre hecha a mano, siempre con las dos banderas por delante." },
];

// Fila de 3 valores — calcada del mockup "30. Nuestra historia" (p.21):
// Origen/Misión/Valores con sus subtítulos exactos del texto aprobado del
// cliente ("Pasión por lo auténtico", "Conectar culturas", "Artesanía y
// sostenibilidad"). No hay un 4º icono en el mockup real.
const VALUES = [
  {
    label: "Origen",
    sub: "Pasión por lo auténtico",
    icon: (
      <path d="M12 21V9M12 9C9 9 7 6.5 7 3c3.5 0 6 1.8 6 6Zm0 0c3 0 5-2.5 5-6-3.5 0-6 1.8-6 6Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    ),
  },
  {
    label: "Misión",
    sub: "Conectar culturas",
    icon: (
      <path d="M12 4c3 3 3 8 0 10-3-2-3-7 0-10ZM6 14c1.5 3 4 5 6 6 2-1 4.5-3 6-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    ),
  },
  {
    label: "Valores",
    sub: "Artesanía y sostenibilidad",
    icon: (
      <>
        <path d="M12 5 4 9v3c0 5 3.5 8.5 8 9.5 4.5-1 8-4.5 8-9.5V9L12 5Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="12" cy="11" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
  },
];

export default function NosotrosPage() {
  return (
    <>
      {/* Hero a sangre completa — calcado del mockup: título "Nuestra historia"
          + copy exacto aprobado del cliente sobre foto de retrato, en vez del
          bloque de texto centrado plano que había antes (gap real detectado
          en la auditoría visual, ref. 2.10). */}
      <section className="relative overflow-hidden">
        <div className="relative aspect-auto min-h-100 w-full sm:aspect-21/9 sm:min-h-0 lg:aspect-21/8">
          <PhotoSlot name="nosotros-hero" alt="" fallback={<NosotrosPhotoPlaceholder />} />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(100deg, rgba(20,12,8,0.55) 0%, rgba(20,12,8,0.3) 42%, rgba(20,12,8,0.05) 68%, rgba(20,12,8,0) 88%)" }}
            aria-hidden="true"
          />
          <div className="relative z-10 flex h-full flex-col justify-center px-4 py-14 sm:px-8 lg:px-16">
            <Reveal className="max-w-md">
              <h1 className="font-display text-5xl font-semibold leading-[1.05] text-white sm:text-6xl">Nuestra historia</h1>
              <p className="mt-5 max-w-sm text-lg text-white/90">
                Nacimos del amor por las culturas, la artesanía y las historias que se llevan cerca del corazón.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Origen / Misión / Valores */}
      <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-x-14 gap-y-8 px-4 py-14 text-center sm:px-6">
        {VALUES.map((v) => (
          <div key={v.label} className="flex w-40 flex-col items-center gap-2.5">
            <svg viewBox="0 0 24 24" width="30" className="text-terracotta" aria-hidden="true">
              {v.icon}
            </svg>
            <span className="text-sm font-bold uppercase tracking-wide">{v.label}</span>
            <span className="text-xs text-ink-soft">{v.sub}</span>
          </div>
        ))}
      </div>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 md:grid-cols-2 md:items-center">
        <div className="relative aspect-square overflow-hidden rounded-3xl">
          <PhotoSlot name="nosotros-workshop" alt="" fallback={<WorkshopPhotoPlaceholder />} />
        </div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-terracotta">Cómo empezó</p>
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Una maleta, un mercadillo y muchas ganas</h2>
          <p className="mt-4 text-ink-soft">
            Pao llegó a Puerto Almenara desde Colombia hace unos años, con una maleta y, entre la ropa, un puñado de cuentas y charms que le
            recordaban a casa. Empezó a montar pulseras para regalar a amigas — la primera fue una VZLA para una compañera de Venezuela
            del barrio, hecha una noche cualquiera en la mesa de la cocina.
          </p>
          <p className="mt-3 text-ink-soft">
            Lo que iba a ser un regalo se convirtió en una fila de pedidos. De ahí salió ALDARA — el nombre mezcla Venezuela y
            Colombia, porque desde el primer día las piezas llevaban banderas de las dos.
          </p>
        </div>
      </section>

      <section className="bg-surface-2 py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">El camino hasta aquí</p>
          <h2 className="font-display text-3xl font-semibold">Nuestra línea de tiempo</h2>
          <div className="mt-12 grid gap-8 text-left sm:grid-cols-2 lg:grid-cols-4">
            {TIMELINE.map((t) => (
              <div key={t.year}>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-light/25 font-display text-sm">{t.year}</span>
                <h3 className="mt-3 font-semibold">{t.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 text-center sm:px-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">¿Lista para conocer las piezas?</p>
        <h2 className="font-display text-3xl font-semibold">Ahora que ya nos conoces...</h2>
        <div className="mt-7 flex justify-center gap-4">
          <Link href="/shop" className="rounded-full bg-ink px-7 py-3.5 font-semibold text-ivory">
            Ver catálogo
          </Link>
          <Link href="/contacto" className="rounded-full border border-ink px-7 py-3.5 font-semibold">
            Escríbenos
          </Link>
        </div>
      </section>
    </>
  );
}

/**
 * GENERATED_DEMO — misma técnica que HomeHero/CollectionHero (grano
 * feTurbulence + silueta + viñeta), sin fotografía real todavía.
 */
function NosotrosPhotoPlaceholder() {
  return (
    <svg viewBox="0 0 1600 900" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="nosotros-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2a1a10" />
          <stop offset="45%" stopColor="#7a4526" />
          <stop offset="100%" stopColor="#d9ab74" />
        </linearGradient>
        <radialGradient id="nosotros-vignette" cx="72%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.35" />
        </radialGradient>
        <filter id="nosotros-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
        </filter>
        <filter id="nosotros-blur">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>
      <rect width="1600" height="900" fill="url(#nosotros-bg)" />
      {/* dos siluetas difusas, sugiriendo el retrato compartido del mockup */}
      <g filter="url(#nosotros-blur)" opacity="0.9">
        <ellipse cx="1220" cy="360" rx="230" ry="300" fill="#c9905f" opacity="0.7" />
        <ellipse cx="1420" cy="420" rx="190" ry="280" fill="#a9663a" opacity="0.6" />
      </g>
      <rect width="1600" height="900" fill="url(#nosotros-vignette)" />
      <rect width="1600" height="900" filter="url(#nosotros-grain)" />
    </svg>
  );
}

/**
 * GENERATED_DEMO — composición generativa de "interior de taller" (estantes
 * cálidos + puntos de luz), calcando el encuadre del mockup, sin fotografía
 * real todavía.
 */
function WorkshopPhotoPlaceholder() {
  return (
    <svg viewBox="0 0 600 600" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="workshop-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1c130c" />
          <stop offset="100%" stopColor="#4a2e19" />
        </linearGradient>
        <filter id="workshop-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0" />
        </filter>
      </defs>
      <rect width="600" height="600" fill="url(#workshop-bg)" />
      {/* estanterías */}
      {[180, 300, 420].map((y) => (
        <rect key={y} x="60" y={y} width="480" height="6" fill="#8a5a34" opacity="0.6" />
      ))}
      {/* puntos de luz cálida */}
      {[[120, 220], [260, 340], [400, 250], [480, 380], [200, 460]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="14" fill="#f0c56a" opacity="0.55" />
      ))}
      <rect width="600" height="600" filter="url(#workshop-grain)" />
    </svg>
  );
}
