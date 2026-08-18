import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experiencias",
  description: "Todas las experiencias ALDARA: comparador, eventos, colaboraciones, prensa, archivo, exposiciones y más.",
};

// Hub real de las 15 experiencias del Bloque 8 (ver VISUAL_REFERENCE_INDEX.md)
// — punto de entrada único para que ninguna quede huérfana sin enlace real
// desde el sitio.
const EXPERIENCES = [
  { href: "/compare", label: "Comparador", sub: "Compara piezas y elige con más información" },
  { href: "/producto/aro-caribe", label: "Vistos recientemente", sub: "Retoma el descubrimiento (visita cualquier producto)" },
  { href: "/account/notificaciones", label: "Back in Stock", sub: "Gestiona avisos de reposición" },
  { href: "/drops", label: "Drops", sub: "Novedades y lanzamientos" },
  { href: "/ediciones-limitadas", label: "Ediciones limitadas", sub: "Series especiales en tirada corta" },
  { href: "/eventos", label: "Eventos", sub: "Talleres, pop-ups y encuentros (demo)" },
  { href: "/citas", label: "Citas / Atelier", sub: "Asesoramiento presencial o por videollamada" },
  { href: "/tiendas", label: "Tiendas", sub: "Puerto Almenara y futuros puntos de venta" },
  { href: "/colaboraciones", label: "Colaboraciones", sub: "Proyectos con creadoras y cultura (demo)" },
  { href: "/prensa", label: "Prensa", sub: "Press kit y contacto profesional" },
  { href: "/materiales", label: "Trazabilidad", sub: "Materiales, procesos y compromisos" },
  { href: "/archivo", label: "Archivo", sub: "Memoria de colecciones y campañas" },
  { href: "/exposiciones", label: "Exposiciones digitales", sub: "Cultura, imagen y producto" },
  { href: "/gift-story/create", label: "My Stories", sub: "Gift Stories creadas y recibidas" },
  { href: "/account/year-in-aldara", label: "Year in ALDARA", sub: "Tu recap anual privado" },
  { href: "/light-room", label: "The Light Room", sub: "Una pieza, seis condiciones de luz" },
  { href: "/product-reveal", label: "Product Reveal", sub: "El storyboard de revelado de una pieza" },
  { href: "/try-on", label: "Pruébatelo", sub: "Previsualiza una pieza con tu cámara o una foto" },
  { href: "/reparaciones", label: "Reparaciones y Second Life", sub: "Pide una reparación y sigue su estado" },
  { href: "/packaging", label: "Packaging", sub: "Cómo llega una pieza ALDARA a tu casa" },
];

export default function ExperienciasPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
      <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-terracotta">Experiencias</p>
      <h1 className="text-center font-display text-4xl font-semibold sm:text-5xl">Todo lo que puedes explorar</h1>
      <p className="mx-auto mt-4 max-w-lg text-center text-ink-soft">Quince experiencias que amplían el catálogo — algunas con contenido de ejemplo mientras confirmamos datos reales.</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EXPERIENCES.map((e) => (
          <Link key={e.href} href={e.href} className="rounded-2xl border border-line p-5 hover:border-terracotta">
            <p className="font-semibold">{e.label}</p>
            <p className="mt-1 text-sm text-ink-soft">{e.sub}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
