/**
 * Fila de 4 valores de marca bajo el hero de colección — calcada del mockup
 * "22. Colección individual" (Hechas a mano / Simbolismo / Culturas /
 * Edición limitada, con icono de línea). Texto genérico de marca (no
 * específico de una colección), igual en todas — como en el mockup.
 */
const VALUE_PROPS = [
  {
    label: "Hechas a mano",
    icon: (
      <path
        d="M12 21s-7.5-4.6-10-9.3C.4 8.3 2.1 5 5.6 5c2 0 3.4 1 4.4 2.4C11 6 12.4 5 14.4 5c3.5 0 5.2 3.3 3.6 6.7C19.5 16.4 12 21 12 21Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    ),
  },
  {
    label: "Simbolismo",
    icon: (
      <path
        d="M12 3c2 2.5 3 5 3 7.5S13.5 16 12 16s-3-3-3-5.5S10 5.5 12 3Zm0 13v5M8 21h8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    ),
  },
  {
    label: "Culturas",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 12h18M12 3c3 2.7 3 15.3 0 18M12 3c-3 2.7-3 15.3 0 18" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
  },
  {
    label: "Edición limitada",
    icon: (
      <>
        <rect x="4" y="8" width="16" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 12h16M9 8V6a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
  },
];

export function CollectionValueProps() {
  return (
    <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-x-10 gap-y-6 px-4 py-10 text-center sm:px-6">
      {VALUE_PROPS.map((v) => (
        <div key={v.label} className="flex w-24 flex-col items-center gap-2">
          <svg viewBox="0 0 24 24" width="26" className="text-terracotta" aria-hidden="true">
            {v.icon}
          </svg>
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{v.label}</span>
        </div>
      ))}
    </div>
  );
}
