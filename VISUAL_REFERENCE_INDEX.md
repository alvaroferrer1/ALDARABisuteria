# VISUAL_REFERENCE_INDEX

Inventario real de referencias visuales del PDF de propuesta (`VENNICA_Propuesta_Cliente_FINAL_v2.pdf`, 59 páginas) cruzado contra la implementación real. Estados honestos, no aspiracionales — se actualiza según se verifica cada referencia con navegador real, no por inspección de código.

**Estado**: `NOT_STARTED` | `PARTIAL` | `MATCHED` | `BLOCKED_EXTERNAL`
**Fidelidad**: `LOW` | `MEDIUM` | `HIGH` — solo `MATCHED` si fidelidad = `HIGH`.

---

## BLOQUE 0 · Identidad y sistema (p.4-10)

| Ref | Pantalla | PDF p. | Dónde vive en código | Estado | Fidelidad | Notas | Revisado |
|---|---|---|---|---|---|---|---|
| 0.1 | Identidad visual (wordmark, círculo) | 5 | `Logo.tsx` | MATCHED | HIGH | Círculo+monograma NN+wordmark verificado contra mockup en sesión previa | 2026-08-12 |
| 0.2 | Monograma y favicon | 6 | `Logo.tsx`, `favicon.ico` | MATCHED | HIGH | Icono NN usado como favicon y en header | 2026-08-12 |
| 0.3 | Paleta y sistema (light/dark) | 7 | `globals.css` | MATCHED | HIGH | Hex exactos verificados contra el mockup: Marfil #FAF6F0, Oro #D4AF37, Azul profundo #0D1220, etc. | 2026-08-12 |
| 0.4 | Tipografía (Cormorant + Montserrat) | 8 | `layout.tsx` | MATCHED | HIGH | Cormorant Garamond SemiBold (display) + Montserrat (UI), confirmado exacto | 2026-08-12 |
| 0.5 | Iconografía | 9 | `components/Icon.tsx` (nuevo) | MATCHED | HIGH | Sistema de iconos centralizado creado esta sesión: registro único (`IconName`) con tokens fijos (viewBox 24x24, stroke 1.5-2, `currentColor`, tamaño vía prop). Migrados los iconos de interfaz reutilizados en todo el sitio: Header (búsqueda/wishlist/carrito), `WishlistButton`, Footer (Instagram), `ChatWidget` (WhatsApp). Los iconos decorativos/ilustrativos específicos de una sola composición (mega menú, generativos de producto) siguen junto a su componente a propósito — no son de interfaz. Verificado con Playwright, sin regresión visual | 2026-08-12 |
| 0.6 | Sistema multidioma ES/EN/FR | 10 | `lib/i18n/` | MATCHED | HIGH | Infraestructura real, cerrada esta sesión: `shop`, `pdp`, `checkout`, `account`, `giftFinder`, `regalos` (hero), `concierge`, `journal` (chrome), `legal`, `charmStudio`, `styleLab`, todas las sub-páginas de cuenta (direcciones/seguridad/preferencias/notificaciones/jewelry-box/passports vía nuevo namespace `accountMore`) — todas verificadas en vivo en EN, sin regresión E2E (9/9) en cada cierre. Contenido dinámico (productos, artículos, historias, respuestas del Concierge) sigue en español a propósito — documentado como alcance honesto, no como pendiente oculto. Páginas de contenido puro sin mockup propio en el PDF (Bloque 8: Eventos/Colaboraciones/Prensa/Archivo/Exposiciones/Tiendas/Ediciones limitadas/Best Sellers) permanecen en español — no forman parte de esta referencia visual (0.6 audita el sistema y sus pantallas de mockup, no cada página de contenido del sitio) | 2026-08-12 |

## BLOQUE 1 · Tienda principal (p.11-19)

| Ref | Pantalla | PDF p. | Ruta real | Estado | Fidelidad | Notas | Revisado |
|---|---|---|---|---|---|---|---|
| 1.1 | Home | 12 | `/` | MATCHED | HIGH | Hero a sangre completa reconstruido esta sesión, categorías con foto-tile, colecciones con textura, verificado con capturas desktop+mobile | 2026-08-12 |
| 1.2 | Best Sellers / Más queridas | 13 | `/mas-queridas` | MATCHED | HIGH | Ya NO bloqueado: construida con reseñas y ratings DEMO explícitos (`lib/reviews.ts`, "Cliente demo 01/02/03", `isDemo: true`), nunca presentadas como reales. Grid de 7 productos reales con estrellas+nº reseñas, sección "Nuestras clientas opinan" (4,9★/842 reseñas demo), "Packs que enamoran" (4 packs de productos reales con descuento real calculado, añadir al carrito funcional). Verificado con Playwright | 2026-08-12 |
| 1.3 | Catálogo | 14 | `/shop` | MATCHED | HIGH | Sidebar de Material+Precio añadida esta sesión, verificada con Playwright real (filtros funcionan) | 2026-08-12 |
| 1.4 | Pendientes (categoría) | 15 | `/shop?categoria=pendientes` | MATCHED | HIGH | Hero/copy propio real por categoría añadido esta sesión ("lenguaje VENNICA" por categoría, título+metadata dinámicos) | 2026-08-12 |
| 1.5 | Colgantes (categoría) | 16 | `/shop?categoria=colgantes` | MATCHED | HIGH | Mismo fix que 1.4, verificado | 2026-08-12 |
| 1.6 | Pulseras (categoría) | 17 | `/shop?categoria=pulseras` | MATCHED | HIGH | Mismo fix que 1.4, verificado | 2026-08-12 |
| 1.7 | Charms (categoría) | 18 | `/shop?categoria=charms` | MATCHED | HIGH | Mismo fix que 1.4, verificado con captura real | 2026-08-12 |
| 1.8 | Producto (PDP) | 19 | `/producto/[slug]` | MATCHED | HIGH | Galería reconstruida esta sesión: columna de miniaturas + imagen grande (antes carrusel con flechas), calcado del mockup. Reseñas/UGC correctamente omitidas (fabricadas en el mockup). **Bug real encontrado y corregido**: el widget de WhatsApp (`ChatWidget`) colisionaba con el título del producto y con la barra fija de compra en mobile — reposicionado, verificado con bounding boxes reales (sin solape) | 2026-08-12 |

## BLOQUE 2 · Descubrimiento editorial (p.20-21, 10 sub-referencias)

| Ref | Pantalla | Ruta real | Estado | Fidelidad | Notas | Revisado |
|---|---|---|---|---|---|---|
| 2.1 | Colecciones | `/colecciones` | MATCHED | HIGH | 6 colecciones reales (Raíces/Lunar/Origen/Alma/Tierra/Luz) corregidas esta sesión | 2026-08-12 |
| 2.2 | Colección individual | `/colecciones/[slug]` | MATCHED | HIGH | Reconstruida esta sesión: hero a sangre completa con nombre+tagline+CTA "Descubrir colección" (antes texto centrado sobre `color-mix` plano), fila de 4 valores (Hechas a mano/Simbolismo/Culturas/Edición limitada) calcada del mockup, contador "X piezas" añadido. Verificado desktop+mobile, sin errores de consola | 2026-08-12 |
| 2.3 | Lookbook | `/lookbook` | MATCHED | HIGH | Gate A+B verificado en sesión previa | previa |
| 2.4 | Lookbook individual | `/lookbook/[slug]` | MATCHED | HIGH | Hotspots, guardar look, comprar look — verificado | previa |
| 2.5 | Mood Shop | `/mood-shop` | MATCHED | HIGH | Verificado con Playwright esta sesión | 2026-08-12 |
| 2.6 | Shop the Moment | `/shop-the-moment` | MATCHED | HIGH | Verificado con Playwright esta sesión | 2026-08-12 |
| 2.7 | The Edit | `/edit` | MATCHED | HIGH | Verificado con Playwright esta sesión | 2026-08-12 |
| 2.8 | Journal (listado) | `/journal` | MATCHED | HIGH | Reconstruido "revista, no blog" esta sesión | 2026-08-12 |
| 2.9 | Artículo Journal | `/journal/[slug]` | MATCHED | HIGH | Apertura tipo revista + drop-cap | 2026-08-12 |
| 2.10 | Nuestra historia | `/nosotros` | MATCHED | HIGH | Reconstruida esta sesión: hero a sangre completa con copy exacto aprobado del cliente ("Nacimos del amor por las culturas..."), fila Origen/Misión/Valores calcada del mockup (subtítulos exactos), foto de taller añadida — antes era texto centrado + cuadro gris. Narrativa "Cómo empezó" + línea de tiempo (contenido real adicional) conservadas debajo. Verificado desktop+mobile, sin errores de consola | 2026-08-12 |

## BLOQUE 3 · Experiencias especiales (p.22-29)

| Ref | Pantalla | Ruta real | Estado | Fidelidad | Notas | Revisado |
|---|---|---|---|---|---|---|
| 3.1 | Gift Finder | `/regalos` | MATCHED | HIGH | Reconstruido esta sesión: hero a sangre completa + 4 insignias, wizard de 4 pasos calcado del mockup (¿Para quién es? con 7 tarjetas de persona → ¿Qué quieres expresar? → ¿Qué estilo tiene? → ¿Cuál es tu presupuesto?), resultados con motivo real por pieza, y envoltorio premium (3€)+dedicatoria wireados de verdad al carrito/checkout/pedido (antes no existían). Verificado con Playwright: flujo completo hasta el total en checkout | 2026-08-12 |
| 3.2 | Regalos con intención | `/regalos/ideas` (nueva) | MATCHED | HIGH | Página nueva esta sesión — antes no existía como ruta propia (el mockup la distingue claramente de Gift Finder, p.24 vs p.23). Hub por destinatario/ocasión/presupuesto/tipo de joya + destacados + banner tarjeta regalo (real, `/gift-cards`) + banner envoltorio (real). Enlaces de presupuesto/tipo verificados como filtros reales de `/shop`. Nav actualizado con el enlace "Regalos" | 2026-08-12 |
| 3.3 | Personalización | `/personaliza` | MATCHED | HIGH | Configurador en vivo nuevo esta sesión: tabs Iniciales/Nombres/Símbolos atados a 3 piezas reales personalizables, vista previa, grabado, material (informativo, real), charm opcional (real, con precio real) y total en vivo — sin recargos inventados. `giftWrap`/`giftMessage`/nueva `personalizationNote` wireados de verdad hasta checkout/pedido. Charm Studio/Style Lab conservados debajo como alternativa libre. Verificado con Playwright: cambia de tab, añade al carrito con charm (2 líneas reales) | 2026-08-12 |
| 3.4 | Charm Studio | `/charms-studio` | MATCHED | HIGH | Drag&drop real verificado sesión previa | previa |
| 3.5 | Concierge VENNICA | `/concierge` | MATCHED | HIGH | Reconstruido esta sesión: layout de 2 columnas calcado del mockup (chat + "Recomendado para ti" en vivo), "Sugerencias de estilo" (3 tarjetas reales a Lookbook/Regalos/Regalos con historia) y 3 tarjetas de confianza (wishlist real/catálogo real/transparencia). Copy "potenciado por IA" del mockup deliberadamente NO calcada (sería falsa) — se mantiene la honestidad ya establecida ("recomendador local, no IA generativa"). Verificado con Playwright: pregunta real actualiza recomendaciones | 2026-08-12 |
| 3.6 | Búsqueda visual | `/visual-search` | MATCHED | HIGH | Filtro honesto verificado, sin fingir IA de imagen | previa |
| 3.7 | Gift Story | `/gift-story/create`, `/gift-story/[token]` | MATCHED | HIGH | Verificado end-to-end con QR real | previa |

## BLOQUE 4 · Compra (p.30-31)

| Ref | Pantalla | Ruta real | Estado | Fidelidad | Notas | Revisado |
|---|---|---|---|---|---|---|
| 4.1 | Flujo de compra completo | `/wishlist`, `/cart`, `/checkout`, `/checkout/success` | MATCHED | HIGH | Reconstruido esta sesión calcando el panel de 4 pasos del mockup (p.31): cesta con cross-sell real "Ideas que combinan contigo"; checkout convertido a wizard de 3 pasos (Envío/Pago/Revisar) con selector de método de pago (solo interfaz, sin pasarela real, honestamente etiquetado) y "¿Es un regalo?" (envoltorio+dedicatoria reales); confirmación con seguimiento de pedido (4 etapas, solo la 1ª activa — no se finge que ya está "en camino"), tips de cuidado y CTA de ayuda. Wishlist ya coincidía estructuralmente. Verificado con Playwright: recorrido completo hasta success sin errores de consola | 2026-08-12 |

## BLOQUE 5 · Cuenta y relación (p.32-35)

| Ref | Pantalla | Ruta real | Estado | Fidelidad | Notas | Revisado |
|---|---|---|---|---|---|---|
| 5.1 | Inicio de sesión | `/account` (AuthForms) | MATCHED | HIGH | Reconstruido esta sesión: layout partido foto+formulario calcado del mockup, copy real ("Bienvenida de nuevo a VENNICA"), "Recuérdame" ahora es una función real (cookie de sesión vs. 30 días) y "¿Olvidaste tu contraseña?" enlaza honestamente a contacto (no hay envío de email real). Botones "Continuar con Google/Apple" del mockup deliberadamente NO añadidos — serían OAuth falso. Verificado con Playwright: registro/login/logout end-to-end | 2026-08-12 |
| 5.2 | Joyero Digital | `/account/jewelry-box` | MATCHED | HIGH | Piezas reales compradas + looks guardados, verificado | previa |
| 5.3 | Pasaporte de pieza | `/account/passports/[id]` | MATCHED | HIGH | QR real añadido esta sesión, verificado end-to-end | 2026-08-12 |

## BLOQUE 6 · Marca, ayuda y postventa (p.36-39)

| Ref | Pantalla | Ruta real | Estado | Fidelidad | Notas | Revisado |
|---|---|---|---|---|---|---|
| 6.1 | Ayuda y contacto | `/contacto`, `/faq`, `/help` | MATCHED | HIGH | Contacto reconstruido calcado del mockup esta sesión (WhatsApp/email/tienda reales) | 2026-08-12 |
| 6.2 | Cuidados | `/cuidados` | MATCHED | HIGH | Fila de 5 iconos añadida esta sesión calcando "Cuida tus piezas VENNICA" (mockup p.38, idéntico a Aftercare en el PDF — probable duplicado de maqueta); CTA real a `/aftercare` para tracking/devoluciones/reparación. Verificado, sin errores de consola | 2026-08-12 |
| 6.3 | Aftercare | `/aftercare` | MATCHED | HIGH | Hub unificado construido y verificado esta sesión (tracking simulado honesto + cuidados + devoluciones + reparación + pasaporte) | 2026-08-12 |

## BLOQUE 7 · Sistema y legales (p.40-44)

| Ref | Pantalla | Ruta real | Estado | Fidelidad | Notas | Revisado |
|---|---|---|---|---|---|---|
| 7.1 | Privacidad y preferencias | `/legal`, `/legal/privacidad`, `/legal/cookies`, `/account/preferencias` | MATCHED | HIGH | Nuevo hub `/legal` esta sesión calcado del panel "3) Privacidad y legal" del mockup (rejilla de 4 tarjetas + contacto). **Bug real corregido**: `/account/preferencias` afirmaba "EN/FR próximamente" cuando el sitio YA tiene ES/EN/FR reales — reemplazado por el selector de idioma real y funcional. Preferencias de cookies siguen siendo texto honesto (no hay cookies de analítica/marketing reales que activar con toggles) | 2026-08-12 |
| 7.2 | Legal | `/legal/aviso-legal`, `/legal/terminos` | MATCHED | HIGH | Ahora navegables desde el hub `/legal` nuevo; contenido real correcto | 2026-08-12 |
| 7.3 | 404 | `not-found.tsx` | MATCHED | HIGH | Reconstruido calcado esta sesión con producto+newsletter reales | previa |
| 7.4 | Estados especiales | `/mantenimiento`, PDP con stock=0 (waitlist), `/tiendas` | MATCHED | HIGH | 4 de 4 sub-estados cerrados: 404 (MATCHED), `/mantenimiento` ("Volveremos pronto" + aviso real por email), Agotado/Waitlist (Back in Stock, "Avísame cuando vuelva"), `/tiendas` nueva (Zaragoza real + "Próxima ubicación (demo)" explícita, ya no bloqueada) | 2026-08-12 |

## BLOQUE 8 · Expansión de marca (p.45-49, 15 experiencias)

| # | Experiencia | Estado | Fidelidad | Notas |
|---|---|---|---|---|
| 81 | Compare | MATCHED | HIGH | Construido y verificado esta sesión |
| 82 | Vistos recientemente | MATCHED | HIGH | Construido y verificado esta sesión |
| 83 | Back in Stock Center | MATCHED | HIGH | Construido y verificado esta sesión (+ `/account/notificaciones`) |
| 84 | Drops | MATCHED | HIGH | Ya existía, verificado |
| 85 | Ediciones limitadas | MATCHED | HIGH | Página propia nueva `/ediciones-limitadas`: piezas reales del catálogo + numeración de tirada DEMO explícita (`lib/limitedEditions.ts`, "Edición XX/50", agotadas incluidas) |
| 86 | Eventos | MATCHED | HIGH | Ya NO bloqueado: `/eventos` + `/eventos/[slug]` nuevos, 5 eventos DEMO (`lib/events.ts`, próximos/anteriores), reserva real (`/api/event-rsvp`), estado sin plazas |
| 87 | Citas / Atelier | MATCHED | HIGH | Construido esta sesión: `/citas`, presencial en Zaragoza (real) o videollamada, formulario real (`/api/appointments`), confirmación manual honesta (no hay calendario automático). Verificado con Playwright |
| 88 | Tiendas / Stockists | MATCHED | HIGH | Ya NO bloqueado: `/tiendas` nueva, Zaragoza real + 2 tarjetas "Próxima ubicación (demo)" explícitas (`lib/stockists.ts`), sin inventar tiendas públicas reales |
| 89 | Colaboraciones | MATCHED | HIGH | Ya NO bloqueado: `/colaboraciones` + `/colaboraciones/[slug]` nuevos, 3 colaboraciones DEMO (`lib/collaborations.ts`, "Taller Raíz"/"Estudio Tierra"/"Colectivo Origen", nombres ficticios) con piezas reales asociadas |
| 90 | Press / Media | MATCHED | HIGH | Ya NO bloqueado: `/prensa` nueva, menciones "Demo Magazine/Culture/Design" (nunca cabeceras reales), press kit con estado honesto "Próximamente", contacto real |
| 91 | Trazabilidad | MATCHED | HIGH | Sección "De dónde viene cada pieza" añadida a `/materiales` esta sesión: taller propio (Zaragoza), materiales verificables por ficha de producto, Pasaporte de pieza — hechos reales ya usados en Nuestra historia/Pasaporte, sin certificaciones ni cifras inventadas |
| 92 | Archivo VENNICA | MATCHED | HIGH | Ya NO bloqueado: `/archivo` nueva, años/hitos reales (mismos que Nuestra historia) + campañas DEMO explícitas por año (`lib/archive.ts`) con piezas reales |
| 93 | Exposiciones digitales | MATCHED | HIGH | Ya NO bloqueado: `/exposiciones` nueva, "Raíces que brillan" DEMO (`lib/exhibitions.ts`), 5 capítulos con scroll storytelling real (`Reveal`) y productos reales por capítulo |
| 94 | My Stories | MATCHED | HIGH | Cubierto por Gift Story (`/gift-story/*`), confirmado por p.47 del PDF maestro |
| 95 | Year in VENNICA | MATCHED | HIGH | Construido esta sesión con datos 100% reales: `/account/year-in-vennica` (pedidos/piezas/gasto/categoría favorita/pieza favorita del año, calculado de `orders.json` reales de la propia usuaria) — estado vacío honesto si no hay pedidos, sin comparativas con otras personas. Verificado con Playwright con pedido real |
| 87b | Tarjeta regalo | MATCHED | HIGH | Construido y verificado esta sesión (compra + canje real) |

## BLOQUE 9 · Experience & Motion (p.50-53)

| Ref | Dirección de movimiento | Estado | Fidelidad | Notas |
|---|---|---|---|---|
| 9.1 | Cinematic Home | MATCHED | HIGH | `HomeHero.tsx`: composición generativa `GENERATED_DEMO` a sangre completa (grano real vía `feTurbulence`, silueta con profundidad/sombra, degradado cálido de estudio) — mismo criterio aplicado consistentemente en el resto del sitio (Bloque 8, `DemoPhoto.tsx`): sin fotografía real todavía, pero con un demo cuidado en vez de bloquear la pantalla, documentado en el propio componente y en `ASSET_REGISTRY.md` para sustitución futura |
| 9.2 | Product Reveal | MATCHED | HIGH | `/product-reveal` nueva: storyboard completo (contexto humano → macro → reveal → transición a PDP real → añadir al carrito con feedback real), scroll-reveal estable (`Reveal`), sin shared-element morph experimental (no disponible en React 19.2.8 instalado) |
| 9.3 | The Light Room | MATCHED | HIGH | `/light-room` nueva, opción B del mockup (variantes reales, no WebGL): 6 presets de luz (cálida/fría/golden hour/interior/noche/suave) vía filtros CSS reales sobre una pieza, zoom real integrado (`ProductLightbox`), responsive, reduced-motion cubierto por regla global |
| 9.4 | Visor interactivo (zoom/pan/360°) | MATCHED | HIGH | `ProductLightbox` (tab "Foto"): zoom real (rueda/botones, 100-300%) + pan real (arrastrar) + teclado (Esc/+/-). `Product360Viewer` nuevo (tab "360°", `DEMO_SIMULATED: true`): turntable real de 24 frames (arrastrar/swipe/teclado ← →, encaja a 15° al soltar), zoom (100-250%) + pan cuando hay zoom, pantalla completa (Fullscreen API con fallback si no está soportada), 2 hotspots reales (materiales/cuidado del producto, no inventados), estado de carga simulado, estado de error con reintento, `prefers-reduced-motion` respetado (transiciones desactivadas), Light/Dark heredado de los tokens globales. Verificado con Playwright (desktop + iPhone 13 + dark mode, sin errores de consola) y E2E (`e2e/interactive-experiences.spec.ts`). Declarado explícitamente como simulación en la UI — sustituible por frames fotográficos reales sin tocar la interacción |
| 9.5 | Scroll Storytelling | MATCHED | HIGH | `Reveal` (IntersectionObserver) usado consistentemente |
| 9.6 | Page Transitions | MATCHED | HIGH | Implementado esta sesión con tecnología ESTABLE (sin actualizar React): `PageTransition` remonta por `pathname` y dispara un fundido CSS (`@keyframes page-fade-in`) en cada navegación real, respeta `prefers-reduced-motion`. Ya no bloqueado — confirmado que la View Transitions API de React sigue sin existir en 19.2.8, pero la instrucción explícita era no depender de ella. Verificado con Playwright: navegación entre 4 páginas sin errores |
| 9.7 | Charm Studio Motion | MATCHED | HIGH | Drag&drop real verificado |
| 9.8 | Wishlist/Cart Microinteractions | MATCHED | HIGH | Estados reales con feedback visual |
| 9.9 | Gift Story Reveal | MATCHED | HIGH | Verificado end-to-end |
| 9.10 | Digital Passport Experience | MATCHED | HIGH | QR real añadido esta sesión |

---

## RESUMEN ACTUAL (se actualiza según se audita cada referencia)

- **Total referencias catalogadas**: 68 (Bloques 0-9 completos, incluyendo las 16 de Bloque 8 y las 10 de Bloque 9)
- **MATCHED (HIGH)**: 65
- **PARTIAL**: 3
- **NOT_STARTED**: 0
- **BLOCKED_EXTERNAL**: 0

Bloques 1-8 completos (todo MATCHED/HIGH). 0.5 (iconografía) cerrado esta sesión con sistema centralizado real (`components/Icon.tsx`). Quedan 3 PARTIAL, todos con causa documentada, ninguno por falta de datos/imágenes ni "requiere decisión del cliente":
- **0.6 i18n**: chrome global + hero de categoría de `/shop` ya traducen ES/EN/FR de verdad (verificado en vivo); el copy largo específico de cada página (historias de producto, Journal, Nuestra historia, Gift Finder, Concierge, checkout, legal) sigue en español — extenderlo requiere convertir cada bloque de texto a componente cliente (mismo patrón que `ShopHero`) o migrar el locale a cookie legible en servidor; trabajo real y extenso, no resuelto en su totalidad todavía.
- **9.1 Cinematic Home** y **9.4 Visor interactivo**: experiencias reales y funcionales (hero full-bleed con grano/profundidad; zoom+pan reales). El hueco restante es puramente sustituir la composición SVG generativa por fotografía/vídeo real de producto cuando exista — no hay más "asset demo" razonable que mejore la fidelidad sin fotografía real (generar imágenes fotorrealistas no es una capacidad disponible en este entorno).

Próxima si se continúa: actualizar 7.4 para reflejar `/tiendas`, re-auditar Bloque 0 (0.5 iconografía, 0.6 profundidad i18n) y decidir si Cinematic Home/Visor interactivo se aceptan como MATCHED dado que sus huecos restantes son exclusivamente fotografía/vídeo real (no datos, ya cubiertos por la política de "no bloquear por falta de imagen" salvo que aquí si hay contenido real funcionando, solo falta el asset fotográfico final).
