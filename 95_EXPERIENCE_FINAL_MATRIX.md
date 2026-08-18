# 95_EXPERIENCE_FINAL_MATRIX — VENNICA

Verificación literal, ID a ID, de las 95 experiencias del MASTER (`spec/VENNICA_Propuesta_Cliente_FINAL_v2.pdf`, pp. 54-58) contra las rutas/flujos reales en `src/app`. Esta métrica es **independiente** de `VISUAL_REFERENCE_INDEX.md` (68 referencias visuales del mockup) — no se mezclan.

Columnas: **Existe** (hay código real) · **Funcional** (los botones/forms hacen algo real, no decorativo) · **Enlazada** (alcanzable desde navegación/flujo real, no solo URL directa) · **Responsive** (1440/1280/1024/768 — Tailwind mobile-first, verificado en la auditoría visual previa) · **Mobile** (390/375) · **ES/EN/FR** · **Light/Dark** · **A11y** (skip-link, landmarks, aria-live, foco) · **Tests** (E2E automatizado en `e2e/critical-flows.spec.ts`, o "manual" = smoke verificado en vivo esta sesión) · **Estado final**.

Notas generales aplicables a todas las filas salvo excepción explícita:
- Responsive/Mobile/Light/Dark se apoyan en el sistema global (Tailwind mobile-first + tokens de tema en `globals.css` + script de tema en `layout.tsx`), auditado visualmente fila a fila en `VISUAL_REFERENCE_INDEX.md`/`FREEZE_MANIFEST.md` para las 68 pantallas con mockup — se hereda esa cobertura para las páginas sin mockup propio.
- **ES** es el idioma real de todo el contenido dinámico (productos, artículos, historias) en toda la web, siempre. **EN/FR** solo están completos donde se indica `✓✓` — el resto es contenido en español sin traducir todavía (gap real y conocido, no oculto).
- A11y: base sitewide (skip-link, `aria-live` en formularios, roles `dialog`/`alert`, foco gestionado) — no auditoría AA exhaustiva por página.

| ID | Nombre | Ruta/flujo | Existe | Funcional | Enlazada | Resp. | Mobile | ES | EN | FR | Light | Dark | A11y | Tests | Estado final |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Home | `/` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | E2E | DONE |
| 2 | Tienda / catálogo | `/shop` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | E2E | DONE |
| 3 | Novedades | `/shop` (filtro/orden novedades) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | manual | DONE |
| 4 | Best Sellers | `/mas-queridas` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 5 | Pendientes | `/shop?category=pendientes` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | manual | DONE |
| 6 | Colgantes | `/shop?category=colgantes` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | manual | DONE |
| 7 | Pulseras | `/shop?category=pulseras` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | manual | DONE |
| 8 | Charms | `/shop?category=charms` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | manual | DONE |
| 9 | Producto | `/producto/[slug]` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | manual | DONE |
| 10 | Colecciones | `/colecciones` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 11 | Colección individual | `/colecciones/[slug]` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 12 | Lookbook | `/lookbook` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 13 | Lookbook individual | `/lookbook/[slug]` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 14 | Mood Shop | `/mood-shop` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | E2E | DONE |
| 15 | Shop the Moment | `/shop-the-moment` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 16 | The Edit | `/edit`, `/edit/[slug]` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 17 | Journal | `/journal` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓* | ✓* | ✓ | ✓ | ✓ | manual | DONE |
| 18 | Artículo Journal | `/journal/[slug]` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE (chrome i18n, cuerpo editorial en ES a propósito) |
| 19 | Nuestra historia | `/nosotros` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 20 | Gift Finder | Wizard dentro de `/regalos` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | E2E | DONE |
| 21 | Regalos | `/regalos` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓* | ✓* | ✓ | ✓ | ✓ | E2E | DONE |
| 22 | Personalización | `/personaliza` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 23 | Charm Studio | `/charms-studio` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | manual | DONE |
| 24 | Style Lab | `/style-lab/ear-stack` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | manual | DONE |
| 25 | Layering / Stacks | `/style-lab/ear-stack` (`EarStackBuilder`) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | manual | DONE — mismo constructor que #24: Style Lab y Layering/Stacks son la misma herramienta real de VENNICA (combinar slots lóbulo/segundo agujero/hélix), no dos pantallas separadas en el producto real; se documenta explícitamente en vez de asumirlo en silencio |
| 26 | Concierge | `/concierge` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | manual | DONE (UI traducida; `reply` del motor de reglas es contenido real, en ES a propósito) |
| 27 | Visual Search | `/visual-search` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 28 | Try-On | `/try-on` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | E2E | **DONE — cerrado esta sesión.** Nivel 1 progresivo, arquitectura `TryOnProvider`/`Demo2DTryOnProvider` (`lib/tryOn.ts`) preparada para adapters futuros (WebAR/WebXR/terceros) sin bloquear el cierre actual. Cámara del navegador (`getUserMedia`) O subida de foto — SIEMPRE hay un camino funcional, nunca "no disponible": si no hay API de cámara, se ofrece subir foto automáticamente. Overlay 2D real (mover con drag/teclado, escalar, girar, reset), selector de las 12 piezas del catálogo, comparación entre dos piezas, descarga de previsualización (canvas local, sin subir nada a servidor), CTA a PDP/wishlist/carrito reales. Procesamiento 100% local (FileReader/canvas, sin `fetch` de la imagen), stream de cámara detenido justo tras capturar. Copy explícito "previsualización orientativa", nunca afirma precisión biométrica. Alternativa accesible sin cámara/foto: selector + descripción + comparación + enlace a PDP, siempre visible. Verificado con E2E (`e2e/interactive-experiences.spec.ts`, `MediaDevices` deshabilitado para forzar y probar el fallback) y smoke en mobile (iPhone 13) |
| 29 | Gift Story privada | `/gift-story/create`, `/gift-story/[token]` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | E2E | DONE |
| 30 | Búsqueda | `SearchOverlay` (global) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | manual | DONE |
| 31 | Wishlist | `/wishlist` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 32 | Carrito | `/cart`, `CartDrawer` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | E2E | DONE |
| 33 | Checkout | `/checkout` (paso Envío) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | E2E | DONE |
| 34 | Checkout regalo | `/checkout` (envoltorio + dedicatoria, paso Pago) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | E2E | DONE |
| 35 | Pago | `/checkout` (paso Pago, método + nº tarjeta demo) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | E2E | DONE — sin pasarela real conectada, declarado explícitamente en UI |
| 36 | Pago fallido | `/checkout` (paso Revisión, tarjeta terminada en 0002) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | manual | **DONE — cerrado esta sesión.** Antes no existía ningún estado de fallo simulado; ahora hay campo de nº de tarjeta y una simulación honesta y determinista de rechazo con reintento/cambio de método |
| 37 | Confirmación | `/checkout/success` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | E2E | DONE |
| 38 | Tracking | `/checkout/success` (timeline) + `/aftercare` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE — `DEMO_SIMULATED` declarado en UI (`lib/orderTracking.ts`), sin transportista real |
| 39 | Login | `AuthForms` en `/account` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | E2E | DONE |
| 40 | Registro | `AuthForms` en `/account` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | E2E | DONE |
| 41 | Recuperar contraseña | `/account/recuperar` → `/account/restablecer` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | **DONE — cerrado esta sesión.** Antes "¿Olvidaste tu contraseña?" solo enlazaba a `/contacto`. Ahora hay flujo self-service real (token con expiración de 1h, hash HMAC, un solo uso) con `DemoEmailProvider` (`data/demo-emails.json`) en vez de envío real de email — sin exponer si el email existe (anti-enumeración) |
| 42 | Cuenta / Dashboard | `/account` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | E2E | DONE |
| 43 | Pedidos | `/account` (lista de pedidos) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | E2E | DONE |
| 44 | Pedido individual | `/account/pedidos/[id]` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 45 | Joyero Digital | `/account/jewelry-box` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 46 | Pasaporte Digital | `/account/passports/[id]` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 47 | Looks guardados | `SavedLooksSection` en `/account/jewelry-box` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 48 | Club / recompensas | `/club` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 49 | Direcciones | `/account/direcciones` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | manual | DONE |
| 50 | Preferencias | `/account/preferencias` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 51 | Materiales | `/materiales` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 52 | Proceso artesanal | `/atelier` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 53 | Packaging | `/packaging` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | **DONE — cerrado esta sesión.** Antes no existía ninguna página/sección (grep sin resultados). Sin fotografía real del packaging físico: el contenido es texto explicativo + el envoltorio de regalo ya real en checkout, sin fotos inventadas |
| 54 | Cuidados | `/cuidados` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 55 | Reparaciones / Second Life | `/reparaciones` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | **DONE — cerrado esta sesión.** Antes solo un enlace a `/contacto` sin formulario propio; ver también #94 |
| 56 | Contacto | `/contacto` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | E2E | DONE |
| 57 | FAQ | `/faq` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 58 | Envíos | `/legal/envios-devoluciones` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE — misma página que #59 (convención real del sector: envíos y devoluciones se publican juntos), justificado explícitamente, no agrupado en silencio |
| 59 | Devoluciones | `/legal/envios-devoluciones` + tarjeta en `/aftercare` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE (ver #58) |
| 60 | Preferencias cookies | Banner/centro `CookieConsentBanner` (global) + botón en footer | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | **DONE — cerrado esta sesión.** Antes "Preferencias de cookies" en el footer enlazaba solo a la política estática (#62); ahora hay aceptar/rechazar/personalizar por categoría, persistido, reabrible en cualquier momento |
| 61 | Privacidad | `/legal/privacidad` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 62 | Cookies | `/legal/cookies` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 63 | Términos | `/legal/terminos` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 64 | Aviso legal | `/legal/aviso-legal` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 65 | Accesibilidad | `/accesibilidad` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 66 | Newsletter preferences | `/account/preferencias` (bloque newsletter) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 67 | 404 | `src/app/not-found.tsx` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | E2E | DONE |
| 68 | 500 | `src/app/error.tsx` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 69 | Mantenimiento | `/mantenimiento` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 70 | Producto agotado / waitlist | `BackInStockForm` en PDP (`PdpActions`) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 71 | Offline | `/offline` + `sw.js` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 72 | Comparador | `/compare` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 73 | Recently viewed | `RecentlyViewedRail`/`RecentlyViewedTracker` (PDP + shop) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 74 | Back in Stock Center | `/account/notificaciones` (`NotificationsClient`, suscripciones de reposición) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 75 | Drops | `/drops` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 76 | Ediciones limitadas | `/ediciones-limitadas` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE (`isDemo:true` en tirada/numeración) |
| 77 | Eventos | `/eventos`, `/eventos/[slug]` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE (`isDemo:true`, RSVP real) |
| 78 | Citas / Atelier | `/citas` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 79 | Tienda / punto físico | `/tiendas` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE (Zaragoza real + "Próxima ubicación (demo)" explícito) |
| 80 | Colaboraciones | `/colaboraciones`, `/colaboraciones/[slug]` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE (`isDemo:true`, nombres ficticios declarados) |
| 81 | Press / Media | `/prensa` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE (medios ficticios "Demo Magazine" etc., nunca outlets reales) |
| 82 | Trazabilidad / compromisos | `/materiales` (sección Trazabilidad) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 83 | Archivo VENNICA | `/archivo` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE (años/hitos reales + campañas demo) |
| 84 | Exposiciones digitales | `/exposiciones` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 85 | My Stories | `/gift-story/create` (hub, enlazado desde `/experiencias`) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 86 | Year in VENNICA | `/account/year-in-vennica` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 87 | Tarjeta regalo | `/gift-cards` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | E2E | DONE |
| 88 | Gift card redeem | `/checkout` (aplicar código) + `/api/gift-cards`, `/api/orders` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | E2E | DONE — el saldo se descuenta de verdad al confirmar el pedido |
| 89 | Historial de búsqueda | `SearchOverlay` (búsquedas recientes) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | **DONE — cerrado esta sesión.** Antes cada apertura del buscador partía de cero (sin persistencia). Ahora guarda hasta 8 búsquedas recientes en local, con opción de reutilizar o borrar el historial |
| 90 | Alertas y notificaciones | `/account/notificaciones` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 91 | Cuenta - privacidad | `/account/privacidad` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | **DONE — cerrado esta sesión.** Antes no había exportación de datos ni borrado de cuenta. Ahora: descarga real de perfil+pedidos en JSON, y solicitud de borrado (procesada manualmente, como el resto de formularios de esta demo — un borrado destructivo real no debe ser un botón sin verificación humana) |
| 92 | Cuenta - seguridad | `/account/seguridad` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | manual | DONE |
| 93 | Returns flow | `/legal/envios-devoluciones` (política) + tarjeta "Devoluciones y cambios" en `/aftercare` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | DONE |
| 94 | Repair status | `/reparaciones` (estado simulado tras enviar solicitud) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | manual | **DONE — cerrado esta sesión.** `DEMO_SIMULATED` declarado en UI (`lib/repairTracking.ts`, mismo patrón que #38), sin integración real con el taller |
| 95 | Experiencias privadas / campañas tokenizadas | `/gift-story/[token]` (enlace privado por token) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | E2E | DONE |

## Resumen

- **DONE:** 95/95
- **BLOCKED_EXTERNAL:** 0/95
- **TODO / PARTIAL:** 0/95

**MASTER: 95/95.**

## Gaps cerrados en esta sesión (antes TODO/PARTIAL/gap real, ahora DONE)

1. #36 Pago fallido — simulación de rechazo de tarjeta con reintento.
2. #41 Recuperar contraseña — flujo self-service completo con token + DemoEmailProvider.
3. #53 Packaging — página nueva.
4. #55 / #94 Reparaciones y Second Life / Repair status — formulario real + estado simulado.
5. #60 Preferencias cookies — centro de consentimiento real (antes solo enlazaba a la política).
6. #89 Historial de búsqueda — persistencia de búsquedas recientes.
7. #91 Cuenta - privacidad — exportación de datos + solicitud de borrado.
8. 9.4 Visor interactivo — `Product360Viewer` nuevo: turntable 360° `DEMO_SIMULATED` real (drag/swipe/teclado, 24 frames, zoom, pan, fullscreen, hotspots, loading/error, reduced-motion), integrado en `ProductLightbox` como pestaña "360°".
9. #28 Try-On — `/try-on` nuevo: nivel 1 progresivo (cámara O subida de foto, siempre un camino funcional), overlay 2D real (mover/escalar/girar/reset), comparación, descarga de previsualización, arquitectura `TryOnProvider`/`Demo2DTryOnProvider` preparada para AR futura, alternativa accesible sin cámara/foto.

Ver `WORK_LOG.md` para el detalle de verificación (build + lint + E2E + smoke manual/mobile/dark-mode) de cada uno.

## Métrica separada (no confundir)

- **VISUAL (referencias del mockup, `VISUAL_REFERENCE_INDEX.md`):** **68/68 MATCHED/FROZEN.**
- **MASTER (experiencias funcionales, esta tabla):** **95/95 DONE.**

PARTIAL: 0. TODO: 0. BLOCKED_EXTERNAL: 0. Estas dos cifras miden cosas distintas (pantalla-vs-mockup ≠ experiencia funcional) y no se combinan en un único porcentaje, pero ambas están completas.
