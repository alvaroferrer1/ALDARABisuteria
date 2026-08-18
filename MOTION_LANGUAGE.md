# MOTION_LANGUAGE

Estado: documenta el sistema de movimiento **real y ya implementado** en el código (`git grep transition`), no un sistema aspiracional inventado. Si se añade una animación nueva, debe seguir estas reglas o el `MOTION_LANGUAGE.md` deja de ser cierto.

## Principio

`prefers-reduced-motion` se respeta globalmente (`globals.css:68`, `transition-duration: 0.001ms !important` bajo el media query). Ninguna animación nueva puede saltarse esto.

## Vocabulario real por tipo de elemento

| Elemento | Movimiento | Duración | Dónde |
|---|---|---|---|
| Botón primario (CTA, add to cart) | `-translate-y-0.5` en hover | por defecto de Tailwind (150ms) | `AddToCartButton`, `PdpActions`, home CTAs |
| Icono de acción (wishlist, chat) | `scale-110` en hover | 150ms | `WishlistButton`, `AddToCartButton` icon, `ChatWidget` |
| Card de producto | `-translate-y-1.5` + `shadow-xl` en hover | 300ms (`duration-300`) | `ProductCard` |
| Overlay/drawer (cart) | `opacity` (backdrop) + `translate-x` (panel) | 300ms | `CartDrawer` |
| Menú móvil / mega menu | `max-height` / mount-unmount | 300ms | `Header` |
| Barra sticky de compra (PDP) | `translate-y-full ↔ translate-y-0`, activada por `IntersectionObserver` (no scroll listener manual) | por defecto | `PdpActions` (nuevo, esta sesión) |
| Hotspot de look shoppable | `scale-110` en hover | 150ms | `LookScene` |

## Regla de consistencia

- Hover de **interacción de compra** (botones, cards, add-to-cart): siempre `translate-y` o `scale`, nunca `rotate` ni efectos llamativos — coherente con "producto siempre protagonista" del contrato.
- Overlays (drawer, menús): siempre opacidad + transform, nunca instantáneos, nunca > 300ms.
- Ningún elemento usa `animation` CSS con loops infinitos ni parallax — no implementado todavía (ver `KNOWN_ISSUES.md`).

## Pendiente (honesto)

- No existe todavía un `motion.ts`/tokens centralizados — las duraciones están repetidas inline por componente. Antes de escalar a home cinematográfica, esto debería extraerse a variables CSS (`--motion-fast`, `--motion-standard`) para que sea un sistema real, no solo un patrón repetido por convención.
- Scroll storytelling, parallax, image masks, View Transitions API: NOT IMPLEMENTED.

## Confirmación cruzada con p.51 del PDF — "Mapa de movimiento" (Bloque 9)
10 direcciones de movimiento del PDF y su estado real en el código:
- A. Cinematic Home (apertura inmersiva) → cubierto por HomeHero + Reveal en la Home.
- B. Product Reveal (hover revela detalle) → ProductPlate/ProductCard con transiciones ya existentes.
- C. The Light Room (luz cálida, atmósfera) → ProductLightField (gradientes procedurales documentados como GENERATED_DEMO).
- D. Interactive Image Viewer (zoom/deslizar) → cubierto parcialmente en Charms Studio / Style Lab (drag&drop); zoom real de imagen de producto no implementado (no hay fotografía macro real que zoomear).
- E. Scroll Storytelling → Reveal (IntersectionObserver) usado en Home/Lookbook/Atelier.
- F. Page Transitions → pendiente evaluar View Transitions API (ya en el orden de prioridades del usuario: "i18n → View Transitions → performance...").
- G. Charm Studio Motion → implementado (drag&drop real en Charms Studio).
- H. Wishlist & Cart Microinteractions → implementado (estados reales de wishlist/cart con feedback visual).
- I. Gift Story Reveal → implementado (página de historia de regalo con reveal del nombre del destinatario).
- J. Digital Passport Experience → implementado (pasaporte con QR real, ver MASTER_CHECKLIST p.49).
Pendiente real: View Transitions API entre rutas (F), ya en el backlog de fases finales del usuario.
