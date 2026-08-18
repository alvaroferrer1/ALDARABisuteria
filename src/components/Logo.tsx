/**
 * Monograma "A" + wordmark ALDARA — marca inventada para esta demo (ya no
 * reproduce el sistema de marca de ningún cliente real): un triángulo
 * cerrado en círculo, con una piedra romboidal en el vértice como guiño a
 * la bisutería, oro sobre fondo claro u oscuro.
 */
export function LogoMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="1.6" />
      {/* "A" geométrica: dos trazos que suben al vértice + barra central */}
      <path
        d="M50 26 L30 74 M50 26 L70 74 M38 58 H62"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Piedra romboidal en el vértice, guiño a la bisutería */}
      <path d="M50 18 L56 26 L50 34 L44 26 Z" fill="currentColor" />
    </svg>
  );
}

export function LogoWordmark({ className = "" }: { className?: string }) {
  return <span className={`font-display text-2xl font-semibold tracking-[0.14em] ${className}`}>ALDARA</span>;
}

export function LogoTagline({ className = "" }: { className?: string }) {
  return (
    <span className={`text-[0.62rem] uppercase tracking-[0.16em] ${className}`}>
      Bisutería hecha a mano · Tradición en cada pieza
    </span>
  );
}
