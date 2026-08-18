/**
 * Textura generativa por material — GENERATED_DEMO (patrón vectorial, no
 * fotografía macro real; ver ASSET_REGISTRY.md). Deliberadamente distinta
 * de ProductPlate (plano de estudio con icono) y de JournalPlate (icono +
 * halo de luz): aquí cada material tiene un patrón propio que sugiere su
 * textura real (veteado, trenzado, facetado...), para que /materiales se
 * sienta sensorial y no solo una lista de texto.
 */
const PATTERNS: Record<string, (id: string, color: string) => React.ReactNode> = {
  hatch: (id, color) => (
    <>
      <pattern id={id} width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="6" stroke={color} strokeWidth="1.4" opacity="0.5" />
      </pattern>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </>
  ),
  brushed: (id, color) => (
    <>
      <pattern id={id} width="100%" height="5" patternUnits="userSpaceOnUse">
        <line x1="0" y1="2" x2="100%" y2="2" stroke={color} strokeWidth="1" opacity="0.45" />
      </pattern>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </>
  ),
  mottled: (id, color) => (
    <>
      {Array.from({ length: 14 }).map((_, i) => (
        <circle
          key={i}
          cx={`${(i * 37) % 100}%`}
          cy={`${(i * 53) % 100}%`}
          r={4 + (i % 4)}
          fill={color}
          opacity={0.12 + (i % 3) * 0.06}
        />
      ))}
    </>
  ),
  pearled: (id, color) => (
    <>
      {[20, 45, 70].map((cx, i) => (
        <circle key={i} cx={`${cx}%`} cy="50%" r="16%" fill="none" stroke={color} strokeWidth="1.2" opacity="0.4" />
      ))}
    </>
  ),
  faceted: (id, color) => (
    <>
      <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse">
        <path d="M0 7 7 0 14 7 7 14Z" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
      </pattern>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </>
  ),
  woven: (id, color) => (
    <>
      <pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M0 5c2.5-4 7.5-4 10 0M0 5c2.5 4 7.5 4 10 0" fill="none" stroke={color} strokeWidth="1.2" opacity="0.45" />
      </pattern>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </>
  ),
};

export function MaterialSwatch({
  pattern,
  color,
  id,
  className = "aspect-video rounded-2xl",
}: {
  pattern: keyof typeof PATTERNS;
  color: string;
  id: string;
  className?: string;
}) {
  const render = PATTERNS[pattern] ?? PATTERNS.hatch;
  return (
    <div className={`relative overflow-hidden bg-surface-2 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none">
        <defs />
        {render(id, color)}
      </svg>
    </div>
  );
}
