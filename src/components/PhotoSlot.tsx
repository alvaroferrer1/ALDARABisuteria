"use client";

import { usePhotoAvailable } from "@/context/PhotoManifestContext";

/**
 * PhotoSlot — el único mecanismo de todo el sitio para sustituir una
 * composición generativa DEMO por fotografía real sin tocar layout ni CSS.
 *
 * Cómo funciona: renderiza siempre el `fallback` (la composición SVG
 * generativa actual) de fondo, y comprueba con `usePhotoAvailable` (Context
 * calculado en el servidor leyendo `public/photos/`, ver
 * `lib/photoManifest.ts` — sin peticiones de red en el cliente, sin ruido
 * de consola) si existe `/photos/<name>.webp`. Si no existe (el caso de hoy
 * en TODA la web), el `<img>` ni siquiera se monta — el resultado visual es
 * EXACTAMENTE el mismo que sin este componente. Si el archivo SÍ existe (el
 * día que el cliente/fotógrafo entregue el asset final y se redespliegue),
 * se monta encima del fallback y lo sustituye.
 *
 * Integración: requiere que el elemento contenedor (el padre inmediato)
 * tenga `position: relative` — mismo requisito que ya usa `ProductPlate`/
 * `ProductLightField`/`DemoPhoto`/`HomeHero`/`CollectionHero`, todos los
 * cuales ya cumplen esta condición.
 *
 * Sustitución real: para activar una fotografía, basta con colocar el
 * archivo final en `public/photos/<name>.webp` con ESE nombre exacto — ver
 * PHOTO_ASSET_MANIFEST.md para el nombre esperado de cada slot del sitio.
 * No requiere ningún cambio de código, build, ni redeploy de componentes.
 */
export function PhotoSlot({
  name,
  alt,
  fallback,
  className = "",
  objectPosition,
}: {
  /** Nombre exacto del archivo esperado en `public/photos/<name>.webp`, sin extensión. */
  name: string;
  alt: string;
  fallback: React.ReactNode;
  className?: string;
  /** CSS object-position opcional, para crops donde el punto de interés no está centrado. */
  objectPosition?: string;
}) {
  const available = usePhotoAvailable(name);
  return (
    <>
      {fallback}
      {available && (
        // eslint-disable-next-line @next/next/no-img-element -- reemplazo directo de asset final, no next/image gestionado
        <img
          src={`/photos/${name}.webp`}
          alt={alt}
          className={`absolute inset-0 h-full w-full object-cover ${className}`}
          style={objectPosition ? { objectPosition } : undefined}
        />
      )}
    </>
  );
}
