# ASSET_REGISTRY

Este proyecto **no tiene acceso a un generador de imagen/vídeo** (no hay tool de generación de imágenes en el entorno de ejecución — verificado explícitamente antes de escribir este documento). Por tanto no existen, ni se han fabricado, fotografías, renders 3D ni vídeo de producto. Lo que sigue es honesto sobre eso: todo lo listado como `GENERATED_DEMO` es **vectorial/procedural (SVG + CSS)**, no fotografía sintética.

| Asset | Tipo | Ubicación | Estado |
|---|---|---|---|
| Logo VENNICA (wordmark SVG en Header) | PLACEHOLDER | `src/components/Header.tsx` | `BLOCKED_EXTERNAL` para el logo real — no hay captura/archivo de Instagram disponible en el proyecto ni en la conversación. No se ha inventado un símbolo/monograma nuevo. |
| Favicon / apple-touch-icon / OG image | GENERATED_DEMO | `public/favicon.ico`, `public/apple-touch-icon.png`, `public/og-image.png` | Generados en una sesión previa (ver `DECISIONS.md`), no son el logo real. |
| Iconos de producto por categoría (pendiente/pulsera/colgante/charm) | GENERATED_DEMO | `src/components/ProductVisual.tsx` (`ICON_PATHS`) | Línea vectorial (`path` SVG), no fotografía. Un icono por categoría, no por producto individual. |
| Plano de producto generativo ("light field") — gradiente radial + arco de reflejo simulado | GENERATED_DEMO | `src/components/ProductPlate.tsx`, `ProductLightField` | Nuevo esta sesión. Sustituye los fondos planos por una composición procedural coherente con la paleta de marca (oro/terracota/azul según `product.tint`). Usado en `ProductCard` (grid de catálogo) y `ProductGallery` (PDP). Explícitamente NO pretende ser una fotografía — es luz/gradiente generado, documentado como tal en el propio componente. |
| Iconografía de mega menu / categorías Home | GENERATED_DEMO | `src/components/Header.tsx` (`MEGA_ICON_PATHS`), `src/app/page.tsx` (`CATEGORIES[].icon`) | Mismos paths que `ProductVisual`, unificados esta sesión. |
| Fotografía de colecciones/campañas/lookbook/journal/atelier/materials/packaging | NO EXISTE | — | No generadas. Ver razón arriba (sin tool de generación de imagen). Estas secciones usan actualmente ilustración vectorial ligera o texto, no fotografía simulada que pudiera confundirse con una foto real. |

## Por qué no hay "fotografía generada" aunque se pidió explícitamente

No es una decisión de alcance — es una limitación de herramientas real y verificada (no hay tool de image/video generation disponible en este entorno). La alternativa honesta —descargar fotos de stock o de otras marcas de Internet y presentarlas como fotografía propia de producto/campaña— no se ha hecho porque: (a) no serían "generadas", (b) probablemente mostrarían un producto real distinto al inventado en `src/lib/products.ts`, y (c) el propio contrato prohíbe copiar campañas/fotografía de otras marcas y presentar contenido falso como propio.

## Sustitución futura

Cuando exista fotografía/vídeo real: sustituir `ProductVisual`/`ProductPlate`/`ProductLightField` por componentes de imagen real (`next/image` con los assets en `public/products/`), manteniendo la misma interfaz (`product` como prop) para no tocar `ProductCard`, `ProductGallery`, `CartDrawer`, `EarStackBuilder`, `LookScene` ni las páginas que los usan.
