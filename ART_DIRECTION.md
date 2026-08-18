# ART_DIRECTION

Estado: documenta la dirección artística **real** ya en el design system (`src/app/globals.css`, componentes), no una dirección aspiracional sin implementar. Ver `DESIGN_RESEARCH_2026.md` para el research que la sustenta y la restricción estructural (sin fotografía de producto real todavía).

## Identidad de marca (real, de `DECISIONS.md` / `page.tsx`)

VENNICA: bisutería artesanal hecha a mano en Zaragoza que une dos culturas — Venezuela y Nicaragua. Fundadora: Pao (nicaragüense afincada en Zaragoza). Esta historia de origen es el activo narrativo más fuerte del proyecto y debe ser el hilo conductor de cualquier rediseño, no un "storytelling genérico de marca artesanal".

## Paleta (tokens reales en `globals.css`)

- `--ink` / `--ivory`: texto y fondo base, alto contraste, sin grises SaaS.
- `--terracotta`: acento principal — cálido, no un rojo genérico. Se usa en CTAs secundarios, badges, precios rebajados, iconografía activa.
- `--gold` / `--gold-light`: metal, usado con moderación (halos de fondo del hero, no como color de texto masivo) — cumple la regla del contrato de "dorado con sofisticación, no casino".
- `--blue`: asociado a la colección Nocturna (Managua/Maracaibo de noche).

## Tipografía

- Display: fuente serif (`var(--font-display)`) para H1/H2 — usada en logo, títulos de sección, nombres de producto.
- Interfaz: sans-serif del sistema para todo lo demás (labels, botones, cuerpo).

## Fotografía — restricción real

**No existen fotografías de producto reales en este proyecto.** El catálogo usa iconos SVG generados (`ProductVisual.tsx`) por categoría (earring/bracelet/pendant/charm), no fotografía macro. Cualquier "dirección de fotografía" (macro, lifestyle, editorial) descrita en el prompt maestro §19 no puede aplicarse honestamente hasta que exista una sesión de fotos/vídeo real del producto físico. Documentarlo aquí en vez de simularlo con stock photos que fingirían ser fotografía de producto propia.

## Iconografía (real, ya unificada esta sesión)

Un único sistema de `path` SVG por categoría de producto (pendientes/colgantes/pulseras/charms), compartido entre el mega menu del `Header` y las cards de categoría de la Home — antes estaban duplicados/inconsistentes, ahora son el mismo `MEGA_ICON_PATHS`/`cat.icon`. Trazo `strokeWidth="1.4"`, sin relleno, minimalista — evita el "icono Lucide gigante" que el contrato prohíbe.

## Qué NO hacer (de la revisión anti-IA del contrato, aplicado a este proyecto)

- Nada de gradiente morado, glassmorphism, blobs — no están en el código actual, y no se deben introducir.
- Nada de card grid repetitivo sin jerarquía — la Home ya alterna: hero → stats → historia (imagen+texto) → categorías (grid) → producto (grid) → CTA final. Mantener esa alternancia al añadir secciones nuevas.

## Pendiente (honesto)

- No hay research de 30 referencias con matriz completa (`DESIGN_RESEARCH_2026.md` documenta esto).
- No hay "tres direcciones artísticas" (Cinematic Metal / Mediterranean Future / Digital Atelier o equivalentes) evaluadas y elegidas — no realizado en esta sesión.
