# POST_AUDIT_IMPROVEMENTS — VENNICA

Fase 2, posterior al cierre de fidelidad PDF↔LIVE (ver `WORK_LOG.md`, `95_EXPERIENCE_FINAL_MATRIX.md`, `VISUAL_REFERENCE_INDEX.md`). **Nada de lo que aparece aquí es un gap respecto al PDF/MASTER** — todo lo que faltaba respecto a la especificación ya se corrigió en la fase 1 y quedó registrado en `WORK_LOG.md`. Esto son propuestas que van **más allá** de lo ya aprobado.

**Nada de esto está implementado todavía.** Es una lista para decidir qué merece la pena.

Cobertura: las 95 experiencias del MASTER, agrupadas en 35 bloques cuando la recomendación es transversal (ninguna ID queda fuera — ver el índice al final).

Clasificación en cada propuesta: **Prioridad** (P1 alta / P2 media / P3 nice-to-have) · **Impacto** (Alto/Medio/Bajo) · **Esfuerzo** (Bajo/Medio/Alto) · **Riesgo** (Bajo/Medio/Alto).

---

## A. Home (#1)

1. **Conservar**: estructura editorial (hero → categorías → colecciones → confianza → destacados → CTA), el sistema de banderas VE/NI como firma de marca, la composición generativa del hero.
2. **Visual**: el hero cambia de "silueta con pulseras" genérica a un plano más cercano de un charm/colgante concreto en primer plano — más fácil de sustituir por una única foto de producto real cuando exista, en vez de una composición corporal completa.
3. **UX**: al pasar de hero a la fila de categorías, que el charm/pieza principal del hero se encoja visualmente (200-300px de scroll) y se convierta en la primera card de categoría, con `prefers-reduced-motion` como fallback estático — ancla visual entre las dos secciones en vez de un corte brusco.
4. **Funcionalidad**: un carrusel de "vistas rápidas" (quick-view modal) sobre las 4 categorías destacadas, para ver 3 productos de esa categoría sin salir de Home.
5. **Conversión**: badge de urgencia real (no inventado) en las colecciones destacadas — "Quedan 3 piezas de Gota de Ámbar" cuando el stock real sea bajo, tirando de `product.stock` existente.
6. **Mobile**: los 5 tiles de categoría pasan de grid 2 columnas a un carrusel horizontal con snap — en 375px 2 columnas dejan cada tile muy estrecho para el texto de categoría.
7. **Accesibilidad**: añadir un `<h2 className="sr-only">` antes de cada sección (categorías/colecciones/destacados) para que la navegación por landmarks de un lector de pantalla tenga puntos de referencia claros, no solo el `<h1>` del hero.
8. **Performance**: el hero SVG generativo ya es ligero (sin imágenes pesadas) — mantener ese criterio cuando se sustituya por fotografía real: `next/image` con `priority` solo en el hero, lazy en el resto.
9. **SEO**: añadir JSON-LD `Organization` con `sameAs` a Instagram/redes reales en el `<head>` global (hoy el schema solo existe en PDP a nivel `Product`).
10. **Memorable**: al hacer scroll por "Colecciones destacadas", que el fondo de cada tile cambie de tono gradualmente siguiendo el color de marca de esa colección (ya definido en `collection.color`) en vez de quedar fijo — coherente con el sistema de color ya existente, sin añadir dependencias nuevas.

**P2 · Impacto Alto · Esfuerzo Medio · Riesgo Bajo** (conjunto).

---

## B. Catálogo, Novedades, Best Sellers, categorías — Pendientes/Colgantes/Pulseras/Charms (#2-8)

1. **Conservar**: filtros reales por material/precio/color que ya funcionan de verdad (no decorativos), badges reales (Best Seller/Novedad/Personalizable/Agotado), grid responsive limpio.
2. **Visual**: cards con más "aire" en el estado hover — hoy el hover solo cambia el compare-icon; añadir una elevación sutil (`translateY` + sombra) coherente con el resto del sitio (colecciones/lookbook ya la usan).
3. **UX**: contador de resultados visible ("18 piezas") junto al selector de orden — hoy no hay ninguna confirmación de cuántos productos hay tras filtrar.
4. **Funcionalidad**: "filtros activos" como chips removibles individualmente encima del grid (hoy solo existe "Limpiar todo", sin ver qué está activo sin abrir la sidebar).
5. **Conversión**: en la categoría "Pendientes/Colgantes/Pulseras/Charms", una sección final tipo "Guía de estilo" (mencionada en el PDF como aspiración, no como gap: la referencia visual ya está MATCHED sin ella) con 3-4 combinaciones reales enlazando a Style Lab/Charm Studio — cierra el círculo entre descubrir y personalizar.
6. **Mobile**: el `<details>` de "Más filtros" en mobile pierde la posición de scroll al aplicar un filtro (el `router.push` con `scroll:false` ya lo evita para la página, pero el `<details>` se cierra) — mantenerlo abierto tras aplicar un filtro en mobile.
7. **Accesibilidad**: los swatches de color del filtro solo tienen `aria-label`/`title` — añadir el nombre del color también visible en un tooltip persistente al enfocar con teclado (no solo hover con ratón).
8. **Performance**: `filterProducts` recalcula en cada render del Server Component — con 12-48 productos es irrelevante hoy, pero si el catálogo crece merece memoización o paginación real en vez de mostrar todo en una página.
9. **SEO**: metadata dinámica ya existe por categoría (`generateMetadata`) — añadir `<link rel="canonical">` explícito por combinación de filtros para evitar contenido duplicado indexable (`?material=...&color=...`).
10. **Memorable**: transición de "grano" entre imagen de categoría e imagen de producto al hacer clic (mismo tratamiento visual, sin librería nueva — solo CSS) para que la navegación catálogo→PDP se sienta continua.

**P2 · Impacto Alto · Esfuerzo Medio · Riesgo Bajo** (conjunto, salvo el guía de estilo que es P3/Esfuerzo Alto por necesitar contenido curado nuevo).

---

## C. Producto / PDP (#9)

1. **Conservar**: acordeones traducidos, galería con miniaturas, trust row y badge "Hecha a mano" ya añadidos, Combínalo con/Colección relacionada.
2. **Visual**: separar visualmente el precio tachado (`compareAtPrice`) con más contraste cuando exista descuento — hoy el componente `Price` ya lo soporta pero conviene revisar el contraste en dark mode específicamente.
3. **UX**: **sticky add-to-cart en mobile con precio + selector de cantidad + botón**, que aparezca solo cuando el bloque de compra original salga del viewport y desaparezca si el usuario vuelve a subir — patrón estándar de conversión en PDP mobile, hoy no existe ningún sticky bar en PDP.
4. **Funcionalidad**: indicador visual de stock más granular que el actual ("14 disponibles" en texto plano) — barra o icono de nivel (alto/medio/bajo) reutilizando `getStockStatus` ya construido para el chat.
5. **Conversión**: bloque "Recomendación de charms compatibles" cuando el producto es una pulsera/collar apto para Charm Studio — cross-sell real con productos del catálogo, no genérico.
6. **Mobile**: la galería de miniaturas verticales a la izquierda no cabe cómodamente en 375px — pasar a miniaturas horizontales bajo la imagen principal por debajo de `sm`.
7. **Accesibilidad**: el zoom del lightbox (`ProductLightbox`) no tiene anuncio `aria-live` del nivel de zoom actual para usuarios de lector de pantalla — añadirlo (ya existe el `%` visual, falta el anuncio).
8. **Performance**: las composiciones `ProductLightField`/`ProductVisual` generan SVG en cada render — están memoizables por `product.id`, aunque el coste real hoy es bajo.
9. **SEO**: el JSON-LD `Product` ya existe — añadir `aggregateRating` real cuando `mas-queridas` tenga reseñas por producto individual (hoy las reseñas viven solo en la página de Best Sellers, no por producto).
10. **Memorable**: micro-interacción al añadir al carrito — el icono del carrito en el header "recibe" visualmente la pieza (un pequeño elemento que viaja desde el botón hasta el icono), con fallback instantáneo si `prefers-reduced-motion`.

**P1** el sticky mobile (impacto alto en conversión, esfuerzo bajo, riesgo bajo) · resto **P2**.

---

## D. Colecciones y Colección individual (#10-11)

1. **Conservar**: nombres/taglines reales de las 6 colecciones, color de marca por colección ya integrado en toda la web.
2. **Visual**: en la colección individual, header más grande con el color de marca de fondo en vez de compartir el mismo layout genérico que el listado.
3. **UX**: tabs de filtro (Todas/Nuevas/Más vendidas) en el índice de colecciones — hoy no existen; dan una forma rápida de cruzar colección × popularidad sin ir al catálogo general.
4. **Funcionalidad**: contador real de piezas por colección visible en la card del índice (ej. "6 piezas"), dato ya disponible en `collection.productIds.length`.
5. **Conversión**: "Comprar la colección completa" como acción agrupada (añadir las N piezas al carrito de una vez) en la página de colección individual.
6. **Mobile**: grid de 3 columnas de colecciones pasa a 1 en mobile con mucho espacio en blanco vertical por tile — comprimir el aspect-ratio en mobile.
7. **Accesibilidad**: el color de marca como único diferenciador entre colecciones en el índice no es suficiente por sí solo (contraste) — reforzar con el nombre siempre visible en texto (ya está) y comprobar contraste AA real de cada `collection.color` sobre el fondo.
8. **Performance**: sin problema detectado.
9. **SEO**: cada colección individual ya tiene metadata propia — añadir `BreadcrumbList` JSON-LD (Inicio > Colecciones > [Nombre]).
10. **Memorable**: transición de color de fondo del header al hacer scroll desde el índice hasta la colección seleccionada (usando el `color` de marca ya definido).

**P2 · Impacto Medio · Esfuerzo Bajo-Medio · Riesgo Bajo.**

---

## E. Lookbook, Mood Shop, Shop the Moment, The Edit (#12-16)

1. **Conservar**: el shoppable look funcional de Lookbook (hotspots reales), el filtrado real por mood en Mood Shop (ya cubierto por E2E), la curación editorial de The Edit.
2. **Visual**: unificar el tratamiento de "placeholder + silueta" entre estas 4 páginas — hoy cada una usa una composición ligeramente distinta; un único componente `EditorialPlaceholder` con variantes de tono reduciría inconsistencias sutiles.
3. **UX**: en Lookbook, tabs de filtro (Diarios/Ocasión/Verano/Capas) y botón "Ver todos los looks" — existían en el mockup como affordance de navegación entre looks, hoy solo se ve el grid completo sin agrupar.
4. **Funcionalidad**: "Guardar look" real (ya existe `SavedLooksSection` en el Joyero Digital) — verificar que el botón de guardar esté presente en Lookbook individual, no solo accesible desde la cuenta.
5. **Conversión**: en Shop the Moment, mostrar el ahorro de comprar el "momento" completo si se ofrece descuento por conjunto (hoy no hay descuento — si se decide añadirlo, mostrarlo explícitamente).
6. **Mobile**: los hotspots del Lookbook (puntos sobre la imagen) tienen un área táctil pequeña — aumentar a mínimo 44×44px de zona de toque aunque el punto visual sea más pequeño.
7. **Accesibilidad**: los hotspots necesitan `aria-label` descriptivo ("Ver Collar Brújula, 49€") en vez de solo un `+` visual.
8. **Performance**: sin problema detectado.
9. **SEO**: The Edit y Mood Shop no tienen contenido textual sustancial indexable — un párrafo editorial por sección ayudaría a que Google entienda de qué trata cada una, más allá de imágenes de producto.
10. **Memorable**: en Mood Shop, transición de paleta de color de toda la sección (no solo los productos) según el mood elegido — ya existe el concepto de tono por mood, llevarlo al fondo de la página completa reforzaría la sensación de "cambiar de ambiente".

**P2 · Impacto Medio-Alto · Esfuerzo Medio · Riesgo Bajo.**

---

## F. Journal y Artículo Journal (#17-18)

1. **Conservar**: contenido editorial real (no relleno), chrome ya traducido a 3 idiomas.
2. **Visual**: imagen de cabecera por artículo con tratamiento consistente (hoy varía el crop entre artículos).
3. **UX**: **índice sticky lateral** en artículos largos (secciones con anclas), útil en los artículos con varios apartados.
4. **Funcionalidad**: **tiempo de lectura estimado** ("4 min de lectura") — cálculo trivial por recuento de palabras, sin dependencias nuevas.
5. **Conversión**: **productos relacionados** al final del artículo cuando el artículo mencione piezas concretas (ya hay ejemplos como "cuidar baño de oro" que podría enlazar a productos con ese material).
6. **Mobile**: tipografía de cuerpo del artículo un punto más grande en mobile (line-length actual es correcto en desktop, algo ajustado en 375px).
7. **Accesibilidad**: `Compartir artículo` con opciones nativas (`navigator.share` con fallback a copiar enlace) — mejora real de acceso sin depender de redes concretas.
8. **Performance**: sin problema detectado (contenido ligero).
9. **SEO**: **el más importante de este bloque** — añadir JSON-LD `Article`/`BlogPosting` con fecha de publicación y autor; hoy el Journal es contenido real pero sin schema, perdiendo oportunidad de rich results.
10. **Memorable**: **guardar artículo** para leer después (lista simple en localStorage, mismo patrón que wishlist) — encaja con el tono editorial de la sección.

**P1** SEO schema (impacto alto, esfuerzo bajo) · **P2** tiempo de lectura + productos relacionados · **P3** guardar artículo/compartir.

---

## G. Nuestra historia (#19)

1. **Conservar**: hitos reales del archivo de marca, coherencia con `/archivo`.
2. **Visual**: timeline visual de los hitos (hoy es texto corrido) — reutilizando los mismos años/milestones que ya existen en `lib/archive.ts` para no duplicar contenido.
3. **UX**: enlace cruzado más visible hacia `/atelier` (proceso) y `/archivo` (memoria) — hoy la relación entre las 3 páginas de "historia de marca" no es obvia para quien llega a una sola.
4. **Funcionalidad**: ninguna nueva relevante — es una página editorial, no necesita más interacción.
5. **Conversión**: CTA suave hacia Colecciones al final ("Descubre las colecciones que nacen de esta historia").
6. **Mobile**: sin problema detectado.
7. **Accesibilidad**: sin problema detectado.
8. **Performance**: sin problema detectado.
9. **SEO**: `AboutPage`/`Organization` JSON-LD.
10. **Memorable**: nada adicional — es contenido de marca, no necesita adorno.

**P3 · Impacto Bajo-Medio · Esfuerzo Bajo · Riesgo Bajo.**

---

## H. Gift Finder y Regalos (#20-21)

1. **Conservar**: el wizard de 4 pasos funcional real, la doble vía (asistente paso a paso vs. "Regalos con intención" por destinatario/ocasión).
2. **Visual**: barra de progreso conectada entre los 4 pasos (hoy son pills independientes) — refuerza sensación de wizard, no de pasos sueltos.
3. **UX**: permitir **volver atrás** dentro del wizard sin perder las selecciones anteriores (verificar que el estado persiste al usar el botón "Atrás" del navegador, no solo con un botón interno).
4. **Funcionalidad**: guardar el resultado del Gift Finder como enlace compartible (mismo patrón de token que Gift Story) para poder enviarlo a quien va a decidir el regalo.
5. **Conversión**: mostrar el envoltorio de regalo y la dedicatoria como parte visible del resultado del wizard (hoy están en checkout, desconectados del momento de descubrimiento).
6. **Mobile**: los 7 avatares de "¿Para quién es?" en grid 4+3 dejan el último avatar centrado solo — ajustar a grid par o mostrar 2 columnas fijas en mobile para evitar la asimetría.
7. **Accesibilidad**: navegación por teclado entre pasos del wizard (flechas o Tab lógico), hoy depende solo de clics.
8. **Performance**: sin problema detectado.
9. **SEO**: `/regalos` como página de aterrizaje de campaña merece metadata orientada a búsquedas tipo "regalo para [persona]" — ya tiene título/descripción, revisar keywords reales.
10. **Memorable**: al completar el wizard, una micro-celebración sutil (no intrusiva) antes de mostrar resultados — coherente con el tono cálido de la marca.

**P2 · Impacto Alto · Esfuerzo Medio · Riesgo Bajo.**

---

## I. Personalización, Charm Studio, Style Lab, Layering/Stacks (#22-25)

1. **Conservar**: Charm Studio con precio real y añadir a cesta real, Style Lab con combinador funcional — ambos ya hacen lo que prometen, no son maquetas.
2. **Visual**: previsualización más grande del resultado final en Charm Studio (hoy los slots son pequeños) — un panel de vista previa a tamaño mayor a la derecha.
3. **UX**: en Style Lab, guardar combinaciones favoritas con nombre propio (hoy se pueden construir pero no está claro si persisten entre sesiones — verificar y, si no, añadirlo).
4. **Funcionalidad**: en Personalización, previsualización de texto/iniciales en tiempo real sobre la silueta del producto (hoy es un formulario sin vista previa visual).
5. **Conversión**: mostrar "combinaciones populares" reales (basadas en qué se añade junto en Charm Studio, aunque sea con datos demo iniciales) como inspiración de partida.
6. **Mobile**: los slots de Charm Studio necesitan confirmarse cómodos para drag-and-drop táctil — si el drag real es complicado en touch, el patrón actual "tocar para añadir" (según lo visto) es más robusto: mantenerlo como principal en mobile.
7. **Accesibilidad**: cada slot y cada charm disponible necesita `aria-label` descriptivo con precio incluido, para que se pueda componer sin ver la pantalla.
8. **Performance**: sin problema detectado.
9. **SEO**: página de herramienta, no crítica para SEO — asegurar que no bloquea indexación de nada relevante.
10. **Memorable**: animación de "encaje" cuando un charm se coloca en un slot — refuerzo táctil/visual del gesto de personalizar.

**P2 · Impacto Alto (Charm Studio/Style Lab son diferenciadores de marca) · Esfuerzo Medio · Riesgo Bajo.**

---

## J. Concierge / Chat VENNICA (#26)

*(Nota: el chat ya se revisó y reconstruyó en fase 1 — esto son mejoras sobre la base ya funcional, no gaps.)*

1. **Conservar**: arquitectura por capas (UI → API → provider → DataTools → escalado humano), resolución de contexto entre turnos ya verificada, seguridad de pedidos (auth-gated, sin IDOR).
2. **Calidad de respuesta**: ampliar el vocabulario de intención (sinónimos, erratas comunes) — el clasificador actual es por regex; añadir normalización de plurales/conjugaciones más allá de "cuidar/cuido" ya corregido.
3. **Recomendaciones**: cuando `catalog_search` no encuentra nada con el presupuesto exacto, sugerir automáticamente el producto real más cercano por debajo Y por encima del presupuesto (hoy solo dice "no tengo nada, prueba el catálogo").
4. **Búsqueda semántica**: fuera de alcance realista sin backend/embeddings — no proponerlo como próximo paso; el enfoque por reglas actual es honesto y correcto para esta demo.
5. **Contexto**: recordar no solo el último producto sino la última categoría/presupuesto mencionados, para preguntas de seguimiento tipo "¿y más baratas?".
6. **Cards de producto**: añadir un botón "Añadir a wishlist" directamente en la card de producto dentro del chat (hoy solo enlaza a la ficha).
7. **Acciones desde chat**: permitir "añadir al carrito" directamente desde la card sin salir del chat, con confirmación inline.
8. **Escalado humano**: mostrar un resumen editable del mensaje a WhatsApp antes de abrir el enlace (hoy se genera y abre directo) — dar al usuario la oportunidad de revisar/ajustar el contexto antes de enviarlo.
9. **UX mobile**: confirmar que el teclado virtual no tapa el campo de texto en iOS Safari (problema común con posición `fixed` + teclado) — verificar específicamente en dispositivo/simulador real.
10. **Seguridad**: rate-limiting básico en `/api/assistant` (hoy no hay límite de peticiones por IP/sesión) — mitigación barata contra abuso, aunque el endpoint no expone datos sensibles sin sesión.

**P1**: rate-limiting (riesgo bajo actual pero esfuerzo mínimo) y confirmar teclado mobile · **P2** resto.

---

## K. Visual Search (#27)

1. **Conservar**: la honestidad de no fingir un análisis de imagen que no existe, filtrado real por tono/categoría.
2. **Visual**: mostrar el catálogo filtrado con transición suave al cambiar tono/categoría en vez de salto instantáneo.
3. **UX**: combinar ambos filtros con un resumen tipo "Mostrando: Dorado cálido + Pendientes" visible.
4. **Funcionalidad**: sin cambios mayores — el alcance honesto ya está bien definido.
5. **Conversión**: enlazar desde aquí a Gift Finder cuando no haya resultados con la combinación elegida ("¿Buscas para regalar? Prueba el Gift Finder").
6. **Mobile**: sin problema detectado.
7. **Accesibilidad**: los swatches de tono ya tienen label — confirmar foco visible con teclado.
8. **Performance**: sin problema detectado.
9. **SEO**: página de utilidad, no crítica.
10. **Memorable**: nada adicional necesario — mantener la honestidad del alcance es más valioso que decorarla.

**P3 · Impacto Bajo · Esfuerzo Bajo · Riesgo Bajo.**

---

## L. Try-On (#28)

*(Ya cerrado en fase 1 con nivel 1 progresivo — esto son mejoras sobre esa base, dentro de lo técnicamente viable sin AR real.)*

1. **Conservar**: arquitectura `TryOnProvider`/`Demo2DTryOnProvider` preparada para adapters futuros, fallback cámara→foto siempre funcional, privacidad (procesamiento local).
2. **Visual**: guía visual de posicionamiento (silueta de referencia tenue) sobre la foto para ayudar a colocar el overlay en el sitio correcto.
3. **UX**: deshacer/rehacer de la última transformación (mover/escalar/girar) con un solo botón, no solo "Restablecer" completo.
4. **Funcionalidad**: guardar la previsualización en la wishlist como imagen adjunta (hoy solo se descarga localmente).
5. **Conversión**: CTA "Añadir al carrito" directamente desde la vista de previsualización, no solo desde el panel lateral.
6. **Mobile**: pinch-to-zoom nativo del navegador puede interferir con el drag del overlay — verificar y, si hace falta, desactivar el zoom de página en esa vista concreta.
7. **Accesibilidad**: ya tiene alternativa sin cámara/foto — mantenerla siempre visible, no solo como fallback tras error.
8. **Performance**: el canvas de composición es ligero — sin problema.
9. **SEO**: no aplica (herramienta interactiva).
10. **Memorable**: comparación lado a lado de dos piezas ya existe (`compareProduct`) — destacarla más visualmente, es una función real infrautilizada en la UI actual.

**P2 · Impacto Medio · Esfuerzo Medio · Riesgo Bajo.**

---

## M. Gift Story privada (#29)

1. **Conservar**: token privado real, flujo de creación funcional.
2. **Visual**: plantilla visual más rica para la historia (hoy es texto sobre fondo simple) — 2-3 estilos de tarjeta a elegir.
3. **UX**: previsualización en vivo mientras se escribe la historia, no solo tras crearla.
4. **Funcionalidad**: opción de añadir una foto propia (subida local, no servidor) a la historia.
5. **Conversión**: sugerir productos reales relacionados con la ocasión indicada en el formulario.
6. **Mobile**: sin problema detectado.
7. **Accesibilidad**: sin problema detectado.
8. **Performance**: sin problema detectado.
9. **SEO**: la página con token no debe indexarse (confirmar `robots: noindex` en `/gift-story/[token]`).
10. **Memorable**: animación de "apertura" de la historia al visitarla con el enlace, tipo revelar una carta — coherente con el tono de regalo.

**P3 · Impacto Medio · Esfuerzo Medio · Riesgo Bajo.**

---

## N. Búsqueda y Historial de búsqueda (#30, #89)

1. **Conservar**: búsqueda real en memoria, navegación por teclado, historial reciente ya cerrado en fase 1.
2. **Visual**: agrupar resultados por tipo con un pequeño separador visual (hoy están en una lista continua con solo el badge de color).
3. **UX**: mostrar "búsquedas populares" reales (basadas en categorías del catálogo) cuando el historial esté vacío, en vez de solo el mensaje genérico.
4. **Funcionalidad**: autocompletar/sugerencias mientras se escribe (hoy filtra tras cada letra, pero sin sugerencias de corrección de errores tipográficos).
5. **Conversión**: destacar resultados con stock bajo o "Best Seller" dentro de los resultados de búsqueda.
6. **Mobile**: overlay a pantalla completa ya implementado — confirmar que el teclado no tapa los primeros resultados en iOS.
7. **Accesibilidad**: anunciar por `aria-live` el número de resultados encontrados tras cada búsqueda.
8. **Performance**: búsqueda en memoria sobre catálogo pequeño — sin problema; vigilar si el catálogo crece mucho.
9. **SEO**: no aplica (overlay, no indexable).
10. **Memorable**: nada necesario — la búsqueda debe ser rápida y discreta, no protagonista.

**P3 · Impacto Bajo-Medio · Esfuerzo Bajo · Riesgo Bajo.**

---

## O. Wishlist (#31)

1. **Conservar**: persistencia real en localStorage, integración con PDP/catálogo.
2. **Visual**: vista de cuadrícula más visual (hoy es lista) con opción de alternar a lista.
3. **UX**: **"Mover todo al carrito"** con un clic, respetando stock (omitir agotados con aviso).
4. **Funcionalidad**: compartir la wishlist (enlace de solo lectura) — útil para regalos ("esto es lo que me gusta").
5. **Conversión**: aviso de bajada de precio o cambio de stock en piezas de la wishlist (requiere comparar snapshot vs. estado actual, viable con los datos ya existentes).
6. **Mobile**: sin problema detectado.
7. **Accesibilidad**: confirmar que quitar un ítem de la wishlist anuncia el cambio por `aria-live`.
8. **Performance**: sin problema detectado.
9. **SEO**: no aplica (página personal).
10. **Memorable**: nada necesario.

**P2** el aviso de stock/precio (valor de retención real) · **P3** resto.

---

## P. Carrito (#32)

1. **Conservar**: cálculo real de totales, envoltorio de regalo y dedicatoria integrados, recomendaciones "Ideas que combinan contigo".
2. **Visual**: sin cambios mayores — el patrón de tabla/lista actual es claro.
3. **UX**: confirmar visualmente al eliminar un ítem (deshacer con toast, 5 segundos) en vez de eliminación instantánea sin margen de error.
4. **Funcionalidad**: guardar el carrito para más tarde (mover un ítem a wishlist directamente desde el carrito).
5. **Conversión**: barra de progreso hacia envío gratis ("Añade 12€ más para envío gratis") — dato ya disponible (`totalPrice` vs. umbral de envío gratis usado en otras páginas).
6. **Mobile**: sin problema detectado.
7. **Accesibilidad**: confirmar foco gestionado correctamente tras eliminar un ítem (no perder el foco en el vacío).
8. **Performance**: sin problema detectado.
9. **SEO**: no aplica.
10. **Memorable**: nada necesario.

**P1** la barra de envío gratis (impacto directo en ticket medio, esfuerzo bajo) · **P2** resto.

---

## Q. Checkout completo: Checkout, Checkout regalo, Pago, Pago fallido, Confirmación, Tracking (#33-38)

1. **Conservar**: flujo de 3 pasos real, simulación honesta de pago fallido ya cerrada en fase 1, tracking simulado declarado como tal.
2. **Visual**: indicador de pasos con el paso completado en verde/check más claro (hoy usa el color de marca para todo).
3. **UX**: **resumen editable "revisar y confirmar"** más compacto en mobile — hoy repite toda la info; un acordeón colapsable por sección (envío/pago/regalo) ahorraría scroll.
4. **Funcionalidad**: guardar dirección de envío para próxima compra si el usuario está autenticado (ya existe el sistema de direcciones en cuenta — conectar automáticamente).
5. **Conversión**: mostrar los métodos de pago aceptados (iconos Visa/Mastercard/etc.) de forma más visible junto al selector — refuerzo de confianza estándar de ecommerce.
6. **Mobile**: el formulario de envío es largo en mobile — considerar autocompletado de dirección (si se conecta un proveedor real en el futuro) o al menos agrupar campos relacionados visualmente.
7. **Accesibilidad**: confirmar que el estado de error de pago fallido mueve el foco al mensaje de error (`role="alert"` ya existe — verificar gestión de foco).
8. **Performance**: sin problema detectado.
9. **SEO**: `noindex` en todo el flujo de checkout (confirmar).
10. **Memorable**: en la confirmación, una micro-animación de "sello" o "lacrado" de la historia del pedido, coherente con el tono de packaging/regalo de la marca.

**P2 · Impacto Alto (checkout es la página de mayor impacto en revenue) · Esfuerzo Medio · Riesgo Medio** (tocar checkout siempre exige regresión cuidadosa).

---

## R. Login, Registro, Recuperar contraseña (#39-41)

1. **Conservar**: flujo de recuperación de contraseña real cerrado en fase 1 (token HMAC, anti-enumeración), auth con scrypt real.
2. **Visual**: unificar el card de login/registro con más aire y jerarquía entre el toggle de modo y el formulario.
3. **UX**: mostrar fuerza de contraseña en tiempo real al registrarse (mínimo ya validado en servidor — añadir feedback visual en cliente).
4. **Funcionalidad**: "Mantener sesión iniciada" ya existe como checkbox "Recuérdame" — confirmar que efectivamente cambia la duración de la cookie de sesión.
5. **Conversión**: registro social (Google/Apple) quedaría fuera de alcance realista sin backend real — no proponerlo como próximo paso a corto plazo, solo mencionarlo como posible integración futura de terceros.
6. **Mobile**: sin problema detectado.
7. **Accesibilidad**: confirmar `autocomplete` correcto en los inputs (`email`, `new-password`, `current-password`) para gestores de contraseñas.
8. **Performance**: sin problema detectado.
9. **SEO**: `noindex` en `/account*` (confirmar).
10. **Memorable**: nada necesario — un login debe ser rápido y sin fricción, no protagonista.

**P2 · Impacto Medio · Esfuerzo Bajo · Riesgo Bajo.**

---

## S. Cuenta/Dashboard, Pedidos, Pedido individual (#42-44)

1. **Conservar**: filtrado correcto de pedidos por sesión (sin IDOR, ya verificado en fase 1 de seguridad).
2. **Visual**: estado del pedido con icono + color coherente con el tracking de `/aftercare` (hoy son dos representaciones ligeramente distintas del mismo concepto).
3. **UX**: buscador/filtro simple dentro de "Mis pedidos" cuando haya varios (por fecha o estado).
4. **Funcionalidad**: descarga de factura/recibo en PDF simple (aunque sea generado en cliente) para cada pedido.
5. **Conversión**: "Volver a comprar" con un clic para pedidos anteriores (añade todos los ítems del pedido al carrito de nuevo).
6. **Mobile**: sin problema detectado.
7. **Accesibilidad**: sin problema detectado.
8. **Performance**: sin problema detectado.
9. **SEO**: no aplica.
10. **Memorable**: nada necesario.

**P2** recibo PDF + volver a comprar · **P3** resto.

---

## T. Joyero Digital, Pasaporte Digital, Looks guardados (#45-47)

1. **Conservar**: piezas reales compradas mostradas correctamente, pasaporte con datos reales (no inventados), honestidad explícita sobre lo que aún no existe (certificado/nº de serie).
2. **Visual**: el Pasaporte podría tener un tratamiento más "documento" (borde, sello, tipografía distinta) para diferenciarse visualmente de una ficha de producto normal.
3. **UX**: desde el Joyero Digital, acceso directo a "Pedir reparación" de esa pieza concreta (ya existe `/reparaciones`, falta enlazar con contexto de la pieza).
4. **Funcionalidad**: compartir el Pasaporte públicamente (ya existe QR — confirmar que el enlace compartido no expone datos de otros pedidos ni de la sesión).
5. **Conversión**: sugerir piezas complementarias a lo que ya tiene el usuario en su Joyero (cross-sell basado en compras reales, no genérico).
6. **Mobile**: sin problema detectado.
7. **Accesibilidad**: sin problema detectado.
8. **Performance**: sin problema detectado.
9. **SEO**: `noindex` en Pasaporte salvo que se decida hacerlo público e indexable a propósito (a valorar por negocio, no una decisión técnica).
10. **Memorable**: el propio concepto de Pasaporte ya es el elemento memorable de este bloque — reforzarlo visualmente (punto 2) antes que añadir nada más.

**P2 · Impacto Medio · Esfuerzo Bajo-Medio · Riesgo Bajo.**

---

## U. Club (#48)

1. **Conservar**: cálculo honesto y real de puntos sobre pedidos reales, transparencia explícita sobre qué no está conectado todavía (canje).
2. **Visual**: barra de progreso hacia el siguiente nivel (hoy solo se ve el nivel actual y una lista estática de niveles).
3. **UX**: mostrar cuánto falta en euros para el siguiente nivel ("Te faltan 23€ para Lunar").
4. **Funcionalidad**: canje real de puntos como descuento en checkout — es la pieza que falta para que el Club sea un incentivo completo, no solo informativo.
5. **Conversión**: notificación (banner discreto) cuando el usuario sube de nivel tras una compra.
6. **Mobile**: sin problema detectado.
7. **Accesibilidad**: sin problema detectado.
8. **Performance**: sin problema detectado.
9. **SEO**: no aplica.
10. **Memorable**: nombres de nivel ya usan identidad de marca (Raíces/Lunar/Luz) — mantenerlo, es coherente y ya es memorable.

**P1** el canje real de puntos (es la función que completa el círculo de valor del Club) · **P2** resto.

---

## V. Direcciones, Preferencias, Newsletter preferences (#49-50, #66)

1. **Conservar**: CRUD real de direcciones, gestión de idioma/newsletter ya traducidos.
2. **Visual**: sin cambios mayores.
3. **UX**: marcar una dirección como predeterminada visualmente más claro (badge, no solo un radio oculto).
4. **Funcionalidad**: autocompletar código postal → ciudad/provincia (con una tabla local de códigos postales españoles, sin depender de una API externa de pago).
5. **Conversión**: no aplica directamente — son páginas de gestión, no de descubrimiento.
6. **Mobile**: sin problema detectado.
7. **Accesibilidad**: sin problema detectado.
8. **Performance**: sin problema detectado.
9. **SEO**: no aplica.
10. **Memorable**: nada necesario.

**P3 · Impacto Bajo · Esfuerzo Bajo-Medio · Riesgo Bajo.**

---

## W. Materiales, Proceso artesanal (Atelier), Packaging (#51-53)

1. **Conservar**: descripciones sensoriales reales por material, proceso de 5 pasos honesto, packaging ya cerrado en fase 1.
2. **Visual**: fotografías macro de textura (aunque sean generativas/demo) específicas por material en vez de un swatch de patrón repetido.
3. **UX**: enlazar cada material directamente a los productos que lo usan desde la propia descripción (ya existe la lista de productos por material — mejorar su visibilidad).
4. **Funcionalidad**: comparador de materiales lado a lado (2-3 materiales con sus propiedades).
5. **Conversión**: en Packaging, mostrar el envoltorio de regalo como upsell visual directo con enlace a activarlo en el carrito actual (si hay uno).
6. **Mobile**: sin problema detectado.
7. **Accesibilidad**: sin problema detectado.
8. **Performance**: sin problema detectado.
9. **SEO**: contenido educativo real — buen candidato para keywords de "materiales bisutería artesanal", asegurar metadata rica.
10. **Memorable**: el propio "Trazabilidad" (taller propio, materiales verificables, pasaporte) ya es el elemento diferenciador — no necesita adorno adicional, necesita visibilidad (enlazarlo más desde Home/Footer, ya presente).

**P3 · Impacto Bajo-Medio · Esfuerzo Bajo · Riesgo Bajo.**

---

## X. Cuidados, Reparaciones/Second Life, Repair status (#54-55, #94)

1. **Conservar**: flujo de reparación real cerrado en fase 1 con estado simulado honesto, consejos de cuidado con iconos.
2. **Visual**: el estado de reparación podría mostrarse también dentro de la cuenta del usuario (lista de "Mis reparaciones"), no solo tras enviar el formulario en esa misma sesión.
3. **UX**: formulario de reparación pre-rellenado con datos de la pieza cuando se llega desde el Joyero Digital (ver bloque T, punto 3).
4. **Funcionalidad**: subir una foto del daño (local, sin servidor real) junto a la solicitud de reparación.
5. **Conversión**: no aplica directamente — es una experiencia de retención/postventa, no de venta.
6. **Mobile**: sin problema detectado.
7. **Accesibilidad**: sin problema detectado.
8. **Performance**: sin problema detectado.
9. **SEO**: `/cuidados` es buen contenido indexable (consejos reales) — ya tiene metadata, confirmar que no está en `noindex` por error.
10. **Memorable**: nada adicional necesario.

**P2** "Mis reparaciones" en cuenta (cierra el círculo con #94, actualmente solo visible tras enviar) · **P3** resto.

---

## Y. Contacto, FAQ (#56-57)

1. **Conservar**: selector de motivo ya existente en Contacto, WhatsApp directo, tarjeta de tienda física corregida en fase 1 (ya no depende de iframe externo).
2. **Visual**: sin cambios mayores.
3. **UX**: **estado de respuesta estimada** visible ("Normalmente respondemos en menos de 24h") ya existe como texto — reforzarlo con una indicación de disponibilidad en tiempo real si el chat está "activo" (hora local de España).
4. **Funcionalidad**: en FAQ, votar "¿te ha sido útil esta respuesta?" por pregunta — señal barata de qué contenido falta.
5. **Conversión**: enlazar desde FAQ directamente al chat/WhatsApp cuando una búsqueda no encuentra resultados (ya existe el mensaje, falta el enlace directo de escalado).
6. **Mobile**: sin problema detectado.
7. **Accesibilidad**: sin problema detectado.
8. **Performance**: sin problema detectado.
9. **SEO**: FAQ es candidato perfecto para JSON-LD `FAQPage` — impacto real en rich results de Google, esfuerzo bajo con el contenido ya existente.
10. **Memorable**: nada necesario — contacto debe ser eficiente, no decorativo.

**P1** JSON-LD `FAQPage` (esfuerzo mínimo, impacto SEO real) · **P2** resto.

---

## Z. Envíos, Devoluciones, Returns flow (#58-59, #93)

1. **Conservar**: condiciones reales y claras ya unificadas en una sola página de política + tarjetas de acceso desde Aftercare.
2. **Visual**: sin cambios mayores — es contenido legal/informativo, la claridad importa más que la decoración.
3. **UX**: formulario real de solicitud de devolución (hoy se indica "contáctanos con fotos" pero no hay un formulario dedicado como el de reparaciones) — mismo patrón que `RepairForm`.
4. **Funcionalidad**: seguimiento del estado de una devolución solicitada (mismo patrón `DEMO_SIMULATED` que reparaciones/pedidos).
5. **Conversión**: no aplica — es una experiencia de confianza/postventa.
6. **Mobile**: sin problema detectado.
7. **Accesibilidad**: sin problema detectado.
8. **Performance**: sin problema detectado.
9. **SEO**: contenido de políticas, `noindex` no es necesario pero tampoco prioritario para SEO positivo.
10. **Memorable**: nada necesario.

**P2** formulario real de devolución con estado (mismo patrón ya construido para reparaciones, esfuerzo bajo por reutilización) · resto no aplica.

---

## AA. Legales, Cuenta-privacidad, Cuenta-seguridad (#60-65, #91-92)

1. **Conservar**: centro de consentimiento de cookies real cerrado en fase 1, exportación de datos + solicitud de borrado ya funcionales, cambio de contraseña real.
2. **Visual**: sin cambios mayores — páginas legales deben ser sobrias.
3. **UX**: índice de contenidos sticky en Términos/Privacidad (documentos largos) para saltar a la sección relevante.
4. **Funcionalidad**: en Seguridad de cuenta, mostrar historial de últimos inicios de sesión (fecha, no IP completa por privacidad) — señal de confianza real y barata de construir con los datos que ya existen en la sesión.
5. **Conversión**: no aplica.
6. **Mobile**: sin problema detectado.
7. **Accesibilidad**: la página `/accesibilidad` ya declara el compromiso — confirmar que se actualiza si cambia algo real (no dejar que quede desactualizada respecto al estado real del sitio).
8. **Performance**: sin problema detectado.
9. **SEO**: páginas legales en `noindex,follow` es lo estándar — confirmar.
10. **Memorable**: nada necesario.

**P3 · Impacto Bajo · Esfuerzo Bajo-Medio · Riesgo Bajo.**

---

## BB. 404, 500, Mantenimiento, Offline (#67-69, #71)

1. **Conservar**: personalidad de marca mantenida en el 404, plantilla de mantenimiento honesta (no activada en producción, declarado así).
2. **Visual**: sin cambios mayores.
3. **UX**: en el 404, sugerir las 3-4 rutas más visitadas del sitio (Home/Shop/Colecciones/Contacto) además del enlace genérico a Home.
4. **Funcionalidad**: página Offline (Service Worker) — confirmar qué contenido queda realmente disponible sin red (catálogo cacheado básico sería ideal, aunque es esfuerzo alto).
5. **Conversión**: no aplica.
6. **Mobile**: sin problema detectado.
7. **Accesibilidad**: sin problema detectado.
8. **Performance**: el Service Worker ya existe — auditar qué rutas cachea realmente.
9. **SEO**: 404/500 deben devolver los códigos HTTP correctos (confirmar, no solo visualmente parecer un error).
10. **Memorable**: nada más allá de lo ya hecho.

**P3 · Impacto Bajo · Esfuerzo Bajo · Riesgo Bajo**, salvo auditar el Service Worker que es **P2/Esfuerzo Alto** si se decide ampliar el catálogo offline.

---

## CC. Producto agotado/waitlist, Back in Stock Center (#70, #74)

1. **Conservar**: flujo real de "avísame" con persistencia y gestión desde cuenta.
2. **Visual**: sin cambios mayores.
3. **UX**: mostrar en la propia card de producto agotado cuántas personas más esperan ese reabastecimiento (dato real, ya se acumula en `back-in-stock-requests.json`) — prueba social honesta.
4. **Funcionalidad**: notificación real por email cuando vuelva el stock (hoy es solo un registro, sin envío — mismo patrón DemoEmailProvider ya usado en recuperación de contraseña).
5. **Conversión**: alto — la notificación de vuelta a stock es de las funciones con más ROI de esta lista si se conecta un proveedor de email real.
6. **Mobile**: sin problema detectado.
7. **Accesibilidad**: sin problema detectado.
8. **Performance**: sin problema detectado.
9. **SEO**: no aplica.
10. **Memorable**: nada necesario.

**P1** email real de "vuelta a stock" (alto impacto en recuperar ventas perdidas, esfuerzo medio si se conecta un proveedor) · **P3** contador social.

---

## DD. Comparador, Recently viewed (#72-73)

1. **Conservar**: tabla comparativa real y funcional, carril de vistos recientemente ya cerrado.
2. **Visual**: en el comparador, resaltar automáticamente la fila donde hay diferencia real entre los productos comparados (ej. precio más bajo en verde).
3. **UX**: límite claro de cuántos productos se pueden comparar a la vez (verificar si existe, y comunicarlo si el usuario intenta añadir un quinto).
4. **Funcionalidad**: añadir al carrito los productos comparados directamente desde la tabla (ya existe `AddToCartButton` en cada columna — confirmar que funciona bien en mobile con scroll horizontal).
5. **Conversión**: CTA "Comprar el más popular" cuando uno de los comparados sea Best Seller.
6. **Mobile**: la tabla ya tiene scroll horizontal — confirmar que es descubrible (indicador visual de que hay más contenido a los lados).
7. **Accesibilidad**: confirmar que la tabla usa `<th scope="row">` correctamente para lectores de pantalla.
8. **Performance**: sin problema detectado.
9. **SEO**: no aplica (página personal/utilitaria).
10. **Memorable**: nada necesario.

**P3 · Impacto Bajo-Medio · Esfuerzo Bajo · Riesgo Bajo.**

---

## EE. Drops, Ediciones limitadas (#75-76)

1. **Conservar**: honestidad explícita ("sin cuentas atrás falsas"), numeración demo declarada como tal.
2. **Visual**: barra de progreso de unidades reclamadas/disponibles en Ediciones limitadas (dato ya existe: `claimed`/`editionSize`).
3. **UX**: sin cambios mayores.
4. **Funcionalidad**: filtro para ver solo "disponibles" vs. "agotadas" en Ediciones limitadas.
5. **Conversión**: la barra de progreso del punto 2 ya es en sí misma un driver de conversión honesto (no cuenta atrás falsa, sino disponibilidad real).
6. **Mobile**: sin problema detectado.
7. **Accesibilidad**: sin problema detectado.
8. **Performance**: sin problema detectado.
9. **SEO**: sin cambios necesarios.
10. **Memorable**: nada adicional.

**P2** barra de progreso de unidades (esfuerzo mínimo, refuerza la honestidad ya presente) · resto no aplica.

---

## FF. Eventos, Citas/Atelier (#77-78)

1. **Conservar**: RSVP real, formulario de citas real con confirmación manual declarada como tal.
2. **Visual**: sin cambios mayores.
3. **UX**: calendario visual simple (no interactivo, solo lista agrupada por mes) en vez de la lista plana actual de eventos.
4. **Funcionalidad**: recordatorio real por email antes del evento (mismo patrón DemoEmailProvider) para quien hizo RSVP.
5. **Conversión**: no aplica directamente — son experiencias de comunidad/marca.
6. **Mobile**: sin problema detectado.
7. **Accesibilidad**: sin problema detectado.
8. **Performance**: sin problema detectado.
9. **SEO**: eventos con fecha son buen candidato a JSON-LD `Event` si se quiere aparecer en búsquedas de eventos locales de Zaragoza.
10. **Memorable**: nada adicional necesario — mantener la honestidad demo es más importante.

**P3 · Impacto Bajo · Esfuerzo Bajo-Medio · Riesgo Bajo.**

---

## GG. Tienda física (#79)

1. **Conservar**: Zaragoza real claramente diferenciada de las ubicaciones demo.
2. **Visual**: mapa real (no iframe frágil — mismo criterio ya aplicado en `/contacto`) con marcador de la tienda.
3. **UX**: horario visible junto a la dirección (ya existe en Contacto — replicarlo aquí para consistencia).
4. **Funcionalidad**: sin cambios mayores.
5. **Conversión**: no aplica.
6. **Mobile**: sin problema detectado.
7. **Accesibilidad**: sin problema detectado.
8. **Performance**: sin problema detectado.
9. **SEO**: `LocalBusiness` JSON-LD con la dirección real de Zaragoza — impacto real en SEO local.
10. **Memorable**: nada necesario.

**P2** `LocalBusiness` schema (impacto SEO local real, esfuerzo bajo) · resto **P3**.

---

## HH. Colaboraciones, Press/Media (#80-81)

1. **Conservar**: honestidad de marcar todo como demo, nunca fabricar outlets o colaboradoras reales.
2. **Visual**: sin cambios mayores.
3. **UX**: sin cambios mayores.
4. **Funcionalidad**: formulario real de contacto de prensa dedicado (hoy enlaza al formulario general de Contacto con un motivo genérico) — un campo adicional "Medio/publicación" ayudaría a filtrar mejor esas consultas.
5. **Conversión**: no aplica.
6. **Mobile**: sin problema detectado.
7. **Accesibilidad**: sin problema detectado.
8. **Performance**: sin problema detectado.
9. **SEO**: sin cambios necesarios mientras el contenido siga siendo demo (no se debe optimizar SEO de contenido ficticio).
10. **Memorable**: nada necesario.

**P3 · Impacto Bajo · Esfuerzo Bajo · Riesgo Bajo.**

---

## II. Trazabilidad, Archivo, Exposiciones (#82-84)

1. **Conservar**: hechos reales (taller propio, Zaragoza) nunca mezclados con certificaciones inventadas, scroll storytelling real en Exposiciones.
2. **Visual**: timeline visual en Archivo (mismo comentario que Nuestra historia, bloque G) — año/hito ya estructurado, falta la representación gráfica.
3. **UX**: navegación entre capítulos de la Exposición con indicador de progreso (capítulo 3 de 5).
4. **Funcionalidad**: sin cambios mayores.
5. **Conversión**: productos reales ya enlazados desde Exposiciones — mantenerlo, es el patrón correcto.
6. **Mobile**: sin problema detectado.
7. **Accesibilidad**: sin problema detectado.
8. **Performance**: sin problema detectado.
9. **SEO**: contenido editorial real de marca — buen candidato a metadata rica si se decide promocionarlo.
10. **Memorable**: la Exposición digital ya es el elemento más ambicioso de este bloque — no necesita más, necesita visibilidad (enlace más prominente desde `/experiencias`).

**P3 · Impacto Bajo-Medio · Esfuerzo Bajo-Medio · Riesgo Bajo.**

---

## JJ. My Stories, Year in VENNICA (#85-86)

1. **Conservar**: hub de Gift Stories propias/recibidas, recap anual con datos reales del usuario.
2. **Visual**: Year in VENNICA con más tratamiento visual tipo "resumen anual compartible" (formato imagen/tarjeta) en vez de solo texto/números.
3. **UX**: sin cambios mayores.
4. **Funcionalidad**: descargar/compartir el Year in VENNICA como imagen (canvas local, mismo patrón que Try-On).
5. **Conversión**: sugerir una pieza "para celebrar el año" al final del recap, basada en categorías más compradas por el usuario.
6. **Mobile**: sin problema detectado.
7. **Accesibilidad**: sin problema detectado.
8. **Performance**: sin problema detectado.
9. **SEO**: no aplica (contenido personal).
10. **Memorable**: **este bloque es en sí mismo el más "memorable" candidato de toda la web** — invertir aquí (compartible, visual, personal) tiene más retorno emocional que añadir motion a páginas de catálogo.

**P2 · Impacto Medio (retención/marca) · Esfuerzo Medio · Riesgo Bajo.**

---

## KK. Tarjeta regalo, Gift card redeem (#87-88)

1. **Conservar**: creación y canje reales con saldo que se descuenta de verdad en checkout — ya cerrado y correcto.
2. **Visual**: diseño de la tarjeta regalo (hoy es un bloque de texto con el código) más parecido a una tarjeta regalo visual real, para que tenga sentido "regalarla" como imagen.
4. **Funcionalidad**: envío real por email al destinatario (mismo patrón DemoEmailProvider) — hoy se indica explícitamente que hay que compartirla a mano, sería la mejora natural.
5. **Conversión**: alto — una tarjeta regalo que se pueda enviar directamente reduce fricción real de compra de última hora.
6. **Mobile**: sin problema detectado.
7. **Accesibilidad**: sin problema detectado.
8. **Performance**: sin problema detectado.
9. **SEO**: `/gift-cards` como página de producto propio merece metadata orientada a "tarjeta regalo joyería".
10. **Memorable**: el diseño visual de tarjeta (punto 2) es el elemento memorable natural de este bloque.

**P1** envío real por email (impacto directo en conversión de última hora) · **P2** diseño visual de tarjeta.

---

## LL. Alertas y notificaciones (#90)

1. **Conservar**: centro de notificaciones real conectado a back-in-stock.
2. **Visual**: sin cambios mayores.
3. **UX**: agrupar por tipo si en el futuro hay más tipos de alerta además de back-in-stock (hoy solo hay una, así que no es urgente).
4. **Funcionalidad**: marcar como leídas/archivar notificaciones antiguas.
5. **Conversión**: no aplica directamente.
6. **Mobile**: sin problema detectado.
7. **Accesibilidad**: sin problema detectado.
8. **Performance**: sin problema detectado.
9. **SEO**: no aplica.
10. **Memorable**: nada necesario.

**P3 · Impacto Bajo · Esfuerzo Bajo · Riesgo Bajo.**

---

## MM. Experiencias privadas / campañas tokenizadas (#95)

1. **Conservar**: el patrón de token privado de Gift Story ya cubre honestamente este caso de uso — no inventar una "campaña" separada sin contenido real detrás.
2. **Visual**: sin cambios — reutilizar el patrón ya construido.
3. **UX**: sin cambios.
4. **Funcionalidad**: si en el futuro se necesitan campañas tokenizadas distintas a Gift Story (ej. acceso anticipado a un drop), reutilizar la misma infraestructura de token (`lib/giftStory.ts`) en vez de construir un sistema paralelo.
5. **Conversión**: potencial alto si se usa para acceso anticipado real a Drops/Ediciones limitadas — pero no construirlo sin un caso de uso de negocio confirmado.
6-10. No aplica sin un caso de uso concreto definido — proponer infraestructura sin necesidad real sería exactamente el tipo de "mejora genérica" que este documento evita.

**P3 · Impacto Bajo (sin caso de uso confirmado) · Esfuerzo N/A hasta que se defina · Riesgo Bajo.**

---

## Índice de cobertura (verificación de que las 95 IDs están cubiertas)

A:1 · B:2-8 · C:9 · D:10-11 · E:12-16 · F:17-18 · G:19 · H:20-21 · I:22-25 · J:26 · K:27 · L:28 · M:29 · N:30,89 · O:31 · P:32 · Q:33-38 · R:39-41 · S:42-44 · T:45-47 · U:48 · V:49-50,66 · W:51-53 · X:54-55,94 · Y:56-57 · Z:58-59,93 · AA:60-65,91-92 · BB:67-69,71 · CC:70,74 · DD:72-73 · EE:75-76 · FF:77-78 · GG:79 · HH:80-81 · II:82-84 · JJ:85-86 · KK:87-88 · LL:90 · MM:95.

**95/95 cubiertas.**

## Resumen de prioridades P1 (mayor valor/esfuerzo)

1. PDP: sticky add-to-cart mobile.
2. Carrito: barra de progreso hacia envío gratis.
3. Club: canje real de puntos como descuento.
4. FAQ: JSON-LD `FAQPage`.
5. Journal: JSON-LD `Article`.
6. Back in Stock: email real de aviso de reposición.
7. Tarjeta regalo: envío real por email al destinatario.
8. Chat: rate-limiting en `/api/assistant` + verificar teclado mobile.

Todo lo demás es P2/P3 — mejoras reales pero no bloqueantes para considerar la web terminada en su fase 1.
