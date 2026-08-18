import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accesibilidad",
  description: "Qué hace ALDARA hoy por la accesibilidad de la web: navegación por teclado, lectores de pantalla, movimiento reducido y contraste.",
};

/**
 * Calcado del espíritu del panel "Accesibilidad" de la p.52 del PDF
 * ("Sin filtros sin excesos", "Contraste alto", "Navegación por teclado",
 * "Lectores de pantalla", "Diseñado para ser inclusivo") — pero con
 * contenido honesto: solo se listan funciones que existen de verdad en el
 * código, y se dice explícitamente qué falta todavía. No se afirma
 * cumplimiento WCAG AA/AAA sin una auditoría real que lo respalde.
 */
const IMPLEMENTED = [
  {
    title: "Salta al contenido",
    text: "Un enlace \"Saltar al contenido\" (invisible hasta que se navega con teclado) permite saltarse el menú y llegar directo al contenido de cada página.",
  },
  {
    title: "Navegación por teclado",
    text: "Menús, formularios, filtros y drag&drop (Charm Studio, Style Lab) tienen alternativa accesible sin ratón — el drag&drop concretamente ofrece un modo de clic como alternativa.",
  },
  {
    title: "Lectores de pantalla",
    text: "Botones e iconos interactivos llevan aria-label; los estados que cambian (formularios enviados, resultados de búsqueda, cestas actualizadas) usan aria-live para anunciarse; los elementos puramente decorativos (los planos generativos de producto) se marcan aria-hidden para no generar ruido.",
  },
  {
    title: "Movimiento reducido",
    text: "Si tu sistema tiene activado \"reducir movimiento\", todas las animaciones y transiciones del sitio se desactivan automáticamente — no hay que configurar nada aparte en ALDARA.",
  },
  {
    title: "Contraste de color",
    text: "La paleta de marca (tinta sobre marfil, y su versión en modo oscuro) se ha elegido buscando contraste legible en el texto principal. No hay todavía una auditoría de contraste formal pieza por pieza.",
  },
];

const PENDING = [
  "Modo de alto contraste dedicado (más allá del claro/oscuro ya existente).",
  "Auditoría formal de contraste de color (WCAG) en cada componente, no solo una elección de paleta razonada.",
  "Subtítulos o transcripción si en el futuro se añade vídeo real.",
  "Auditoría con lector de pantalla real (NVDA/VoiceOver) de principio a fin — hoy la cobertura de aria- está verificada por revisión de código, no por una prueba con usuarios reales.",
];

export default function AccesibilidadPage() {
  return (
    <>
      <section className="px-4 pb-8 pt-24 text-center sm:px-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">Accesibilidad</p>
        <h1 className="mx-auto max-w-2xl font-display text-4xl font-semibold sm:text-5xl">Diseñada para que la use cualquiera</h1>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">
          Sin filtros ni excesos: esto es lo que hace ALDARA hoy por la accesibilidad, y lo que todavía nos falta por hacer.
        </p>
      </section>

      <section className="mx-auto max-w-2xl px-4 pb-14 sm:px-6">
        <h2 className="mb-6 font-semibold">Ya implementado</h2>
        <ul className="flex flex-col gap-6">
          {IMPLEMENTED.map((item) => (
            <li key={item.title} className="border-b border-line pb-6 last:border-none">
              <p className="font-semibold text-ink">{item.title}</p>
              <p className="mt-1 text-sm text-ink-soft">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-2xl px-4 pb-24 sm:px-6">
        <h2 className="mb-4 font-semibold">Todavía no — honestamente</h2>
        <ul className="flex flex-col gap-2 text-sm text-ink-soft">
          {PENDING.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true">·</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-ink-soft">
          ¿Encontraste una barrera de accesibilidad usando ALDARA? Escríbenos por{" "}
          <a href="/contacto" className="font-semibold text-terracotta hover:underline">
            el formulario de contacto
          </a>{" "}
          y lo revisamos.
        </p>
      </section>
    </>
  );
}
