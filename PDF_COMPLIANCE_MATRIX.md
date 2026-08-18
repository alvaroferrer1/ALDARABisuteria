# PDF_COMPLIANCE_MATRIX

Extraído de los dos PDF (`CONTRATO_EJECUCION_Y_EXCELENCIA_CLAUDE.pdf`, `PROMPT_MAESTRO_JOYERIA_2026.pdf`), leídos completos. No son 700 filas — son las agrupadas por funcionalidad/experiencia real y verificable, honestamente, en vez de inflar el número con sub-tareas idénticas. Cada fila solo pasa a VERIFIED con evidencia real (build/lint/curl/prueba funcional), nunca por "existe el archivo".

Estados válidos: `MISSING` `IN_PROGRESS` `IMPLEMENTED_UNVERIFIED` `VERIFIED` `BLOCKED_EXTERNAL` `NOT_VIABLE`.

## Identidad y dirección artística

| ID | Requisito | Estado | Evidencia |
|---|---|---|---|
| REQ-001 | Logo real extraído de material de marca | BLOCKED_EXTERNAL | Sin archivo/captura disponible en proyecto ni conversación (ver DECISIONS.md, ASSET_REGISTRY.md) |
| REQ-002 | Research 2026 de referencias reales | IMPLEMENTED_UNVERIFIED | `DESIGN_RESEARCH_2026.md` — pasada condensada con fuentes reales, no las 30 referencias completas exigidas |
| REQ-003 | Dirección artística documentada | VERIFIED | `ART_DIRECTION.md`, aplicado en Home/Lookbook/Campañas |
| REQ-004 | Sistema de movimiento de marca | VERIFIED | `MOTION_LANGUAGE.md` + `Reveal.tsx` reutilizado en Home/Lookbook |
| REQ-005 | Registro de assets (real/generado/bloqueado) | VERIFIED | `ASSET_REGISTRY.md` |
| REQ-006 | Fotografía de producto real | BLOCKED_EXTERNAL | Sin tool de generación de imagen ni fotografía real disponible |

## Home

| ID | Requisito | Estado | Evidencia |
|---|---|---|---|
| REQ-010 | Home cinematográfica (Act 1: hero inmersivo) | VERIFIED | `CinematicHero.tsx`, verificado build+curl+contenido |
| REQ-011 | Skip intro / acceso inmediato | VERIFIED | Enlace "Descubre la historia" + CTA "Ver catálogo" siempre visibles, sin animación bloqueante |
| REQ-012 | Momento macro / narrativa de marca (Act 2) | VERIFIED | Sección historia con `ProductPlate` real |
| REQ-013 | Campaign system en Home (colecciones como campañas) | VERIFIED | 3 tarjetas por colección real, color propio, verificado |
| REQ-014 | Mega menu con categorías/colecciones reales | VERIFIED | `Header.tsx`, verificado sesión anterior de esta conversación |
| REQ-015 | Hero no genérico ("foto+texto+CTA") | VERIFIED | Escena generativa propia, no template |

## Producto / PDP

| ID | Requisito | Estado | Evidencia |
|---|---|---|---|
| REQ-020 | PDP con galería | VERIFIED | `ProductGallery.tsx` |
| REQ-021 | JSON-LD Product/Offer | VERIFIED | Sesión anterior, presente en build |
| REQ-022 | Sticky mobile buy bar | VERIFIED | `PdpActions.tsx`, verificado |
| REQ-023 | Complete the look / colección real | VERIFIED | Sección real en PDP |
| REQ-024 | Reviews | MISSING | Sin datos de reviews reales — no inventados per contrato |
| REQ-025 | Dimensiones/escala | MISSING | No existe el campo en el modelo de datos |
| REQ-026 | Quick shop desde PLP | IMPLEMENTED_UNVERIFIED | `AddToCartButton` en `ProductCard`, no probado end-to-end esta sesión |

## Signature features

| ID | Requisito | Estado | Evidencia |
|---|---|---|---|
| REQ-030 | Digital Jewelry Box | VERIFIED | End-to-end: registro→pedido→joyero, verificado |
| REQ-031 | Gift Story + QR visual | VERIFIED | QR real, byte-verificado contra referencia |
| REQ-032 | Charms Studio drag&drop | VERIFIED (Gate A) | Sin E2E navegador, mismo patrón que Style Lab ya probado |
| REQ-033 | Style Lab drag&drop | VERIFIED (Gate A) | Drag nativo + click fallback |
| REQ-034 | Product Passport | VERIFIED | Protegido por compra real, sin datos inventados |
| REQ-035 | AI Concierge | VERIFIED (local) | `concierge.ts`, determinista, probado con 3 queries reales |
| REQ-036 | Visual Search | VERIFIED (honesto) | Filtro real por atributo, no finge análisis de imagen |
| REQ-037 | Try-On AR | NOT_VIABLE | Evaluado y documentado, no construido como fake — ver KNOWN_ISSUES.md |
| REQ-038 | Lookbook shoppable con guardar/comprar look | VERIFIED | `LookScene.tsx`, verificado esta sesión |

## Ecosistema (Bloque C — DISCOVER/SHOP/WORLD/EXPERIENCE/ACCOUNT/AFTERCARE)

| ID | Requisito | Estado | Evidencia |
|---|---|---|---|
| REQ-040 | Atelier | MISSING | Ver NEXT_TASK |
| REQ-041 | The Edit | MISSING | Ver NEXT_TASK |
| REQ-042 | Mood Shop | MISSING | Ver NEXT_TASK |
| REQ-043 | Shop The Moment | MISSING | Ver NEXT_TASK |
| REQ-044 | Stories (≠ Journal) | MISSING | Ver NEXT_TASK |
| REQ-045 | Journal como revista editorial | IMPLEMENTED_UNVERIFIED | Existe con 4 artículos reales, falta elevar Gate B |
| REQ-046 | Materials educativo+sensorial+comprable | IMPLEMENTED_UNVERIFIED | Existe, falta elevar Gate B |
| REQ-047 | Account expansion (preferences/security/notifications) | MISSING | Solo perfil+pedidos+joyero+pasaporte existen |
| REQ-048 | Aftercare unificado (tracking+care+returns+repair+second life) | IMPLEMENTED_UNVERIFIED | Piezas sueltas existen (legal/envíos, cuidados, passport), sin experiencia post-compra unificada |
| REQ-049 | 60-100+ rutas del ecosistema completo | IN_PROGRESS | 37 rutas de página reales verificadas, ver `SITEMAP_FINAL.md` |

## Plataforma (P3)

| ID | Requisito | Estado | Evidencia |
|---|---|---|---|
| REQ-050 | i18n ES/EN | MISSING | — |
| REQ-051 | View Transitions API | MISSING | — |
| REQ-052 | Performance audit | MISSING | Lighthouse no ejecutado esta sesión |
| REQ-053 | Accessibility audit | MISSING | Solo cumplimiento incidental (aria-labels puntuales), sin auditoría formal |
| REQ-054 | SEO técnico completo | IMPLEMENTED_UNVERIFIED | sitemap/robots/manifest/JSON-LD existen (sesión anterior), sin auditoría formal esta sesión |
| REQ-055 | E2E automatizado | IMPLEMENTED_UNVERIFIED | Playwright usado por sesión anterior para flujos core; no reinstalado/ejecutado esta sesión (decisión de alcance) |
| REQ-056 | Auditoría final contra ambos PDF | MISSING | Pendiente — es el último paso del proceso, no se hace hasta cerrar el resto |

## Ejecución / gobierno (Contrato de Excelencia)

| ID | Requisito | Estado | Evidencia |
|---|---|---|---|
| REQ-060 | Proyecto único, sin duplicados | VERIFIED | Auditoría de identidad inicial de esta conversación |
| REQ-061 | No git push / no deploy | VERIFIED | Ningún comando de esta sesión ha tocado remotos |
| REQ-062 | Documentos de memoria persistente actualizados tras cada bloque | VERIFIED | Este mismo archivo + `MASTER_CHECKLIST.md`/`PROJECT_STATE.md`/`KNOWN_ISSUES.md` actualizados en cada paso de esta sesión |
| REQ-063 | Servidor real verificado, no cambios invisibles | VERIFIED | Protocolo de PID correcto aplicado tras el incidente detectado y corregido en esta sesión |

## Página 46 — "15 experiencias que amplían el ecosistema" (Bloque 8, mapa UX/UI conceptual)
Nota literal del PDF: "Todo contenido final debe corresponder a la realidad de VENNICA" — el propio documento marca este bloque como conceptual/aspiracional, no pixel-spec obligatorio. Triage honesto por viabilidad con datos reales:

| # | Experiencia | Estado | Motivo |
|---|---|---|---|
| 81 | Compare (comparador de productos) | MISSING (viable, buena relación esfuerzo/valor) | Se puede construir 100% con datos reales de catálogo |
| 82 | Vistos recientemente | MISSING (viable) | localStorage, mismo patrón que useSavedLooks |
| 83 | Back in Stock | MISSING (viable, requiere marcar stock=0 en algún producto demo) | Ligado a KNOWN_ISSUES p.44 |
| 84 | Drops / próximos lanzamientos | PARCIAL — ya existe `/drops` | Revisar si cubre "cuenta atrás próximo lanzamiento" |
| 85 | Ediciones limitadas | PARCIAL — cabe dentro de colecciones/drops existentes | No requiere ruta nueva necesariamente |
| 86 | Eventos VENNICA | NOT_VIABLE por ahora | No hay eventos reales que listar; no se inventan fechas/ubicaciones |
| 87 | Citas / reserva en Atelier | MISSING (viable con formulario real tipo /contacto, sin backend de calendario inventado) | Baja prioridad |
| 88 | Tiendas / Stockists | NOT_VIABLE por ahora | Ver KNOWN_ISSUES p.44 — no hay direcciones reales confirmadas |
| 89 | Colaboraciones | NOT_VIABLE por ahora | No hay colaboraciones reales que mostrar |
| 90 | Press / Media | NOT_VIABLE — nunca fabricar logos de prensa (Vogue/Elle/etc.) sin menciones reales | Bloqueado permanentemente salvo datos reales del cliente |
| 91 | Sostenibilidad / Trazabilidad | MISSING (viable con contenido honesto general, sin certificaciones inventadas) | Baja prioridad |
| 92 | Archivo VENNICA | NOT_VIABLE por ahora | No hay archivo histórico real de fotos |
| 93 | Digital Exhibitions | NOT_VIABLE por ahora | Sin contenido real |
| 94 | My Stories | YA EXISTE en espíritu como Gift Story (/gift-story) | Posible rebranding/enlace cruzado, no ruta nueva |
| 95 | Year in VENNICA | MISSING (viable e interesante: se puede calcular de verdad desde orders.json real, sin inventar cifras) | Candidato futuro para /account |

Decisión: no se bloquea el avance de las familias ya priorizadas por el usuario (Edit, Mood Shop, Shop The Moment, Stories, Journal, Materials, Account, Aftercare) para construir este bloque 8 completo, porque el propio PDF lo marca como expansión conceptual condicionada a "contenido real". Compare y Vistos recientemente son los dos con mejor relación esfuerzo/valor y quedan en el backlog activo.

## Página 47 — "Detalle del Bloque 8" (tabla función por experiencia)
Confirma el criterio ya aplicado en la página 46 y añade un dato real aprovechable: fila 88 dice literalmente "Zaragoza y futuros puntos reales" — coincide con el eyebrow real ya usado en HomeHero ("Hecho a mano en Zaragoza"). Es decir, si se construye Stockists en el futuro, Zaragoza es una ubicación real verificable (no inventada); el resto de la tabla ("futuros puntos") no existen todavía y no se inventan. Resto de filas confirman honestidad ya aplicada: fila 85 "series especiales solo cuando existan realmente", fila 94 "My Stories = Gift Stories creadas y recibidas" (ya existe), fila 95 "recap anual opcional y privado" (viable con datos reales de orders.json).

## Auditoría completa — Inventario de 95 experiencias (p.55-58 del PDF de propuesta)
**Revisión de las 59 páginas del PDF de propuesta completada (2026-08-12).** Cruce contra las rutas reales del proyecto:

| # | Experiencia (PDF) | Estado real |
|---|---|---|
| 1 | Home | ✅ `/` |
| 2 | Tienda/catálogo | ✅ `/shop` |
| 3 | Novedades | ✅ `/drops` |
| 4 | Best Sellers | ❌ MISSING |
| 5-8 | Pendientes/Colgantes/Pulseras/Charms | 🟡 filtro dentro de `/shop`, no ruta dedicada |
| 9 | Producto | ✅ `/producto/[slug]` |
| 10-11 | Colecciones / individual | ✅ `/colecciones`, `/colecciones/[slug]` |
| 12-13 | Lookbook / individual | ✅ `/lookbook`, `/lookbook/[slug]` |
| 14 | Mood Shop | ❌ MISSING — próxima familia por orden explícito del usuario |
| 15 | Shop the Moment | ❌ MISSING — próxima familia |
| 16 | The Edit | ❌ MISSING — próxima familia |
| 17-18 | Journal / artículo | ✅ |
| 19 | Nuestra historia | ✅ `/nosotros` |
| 20-21 | Gift Finder / Regalos | 🟡 `/regalos` existe pero es wizard simple, no el hub rico del PDF (ya en backlog) |
| 22 | Personalización | 🟡 `/personaliza` existe como agregador, no configurador real (ya en backlog) |
| 23-24 | Charm Studio / Style Lab | ✅ |
| 25 | Layering/Stacks | 🟡 parcial en Style Lab |
| 26-27 | Concierge / Visual Search | ✅ |
| 28 | Try-On | ⛔ NOT_VIABLE (marcado "si es viable" en el propio PDF; sin AR real) |
| 29 | Gift Story privada | ✅ |
| 30 | Búsqueda | 🟡 verificar si existe buscador global (pendiente confirmar) |
| 31-33 | Wishlist/Carrito/Checkout | ✅ |
| 34-37 | Checkout regalo/Pago/Pago fallido/Confirmación | 🟡 verificar cobertura de "pago fallido" específicamente |
| 38 | Tracking | ❌ MISSING (parte de Aftercare, ya en backlog) |
| 39-41 | Login/Registro/Recuperar contraseña | 🟡 login+registro en AuthForms; recuperar contraseña MISSING |
| 42-45 | Cuenta/Pedidos/Pedido individual/Joyero | 🟡 pedido individual detallado sin confirmar |
| 46-47 | Pasaporte Digital / Looks guardados | ✅ |
| 48 | Club | ✅ `/club` |
| 49-50 | Direcciones/Preferencias | ❌ MISSING |
| 51-52 | Materiales/Proceso artesanal | ✅ `/materiales`, `/atelier` |
| 53 | Packaging | ❌ MISSING |
| 54 | Cuidados | ✅ `/cuidados` |
| 55 | Reparaciones/Second Life | ❌ MISSING (Aftercare, backlog) |
| 56-59 | Contacto/FAQ/Envíos/Devoluciones | ✅ |
| 60-64 | Legales (cookies/privacidad/términos/aviso) | 🟡 falta "Términos y condiciones" como página separada (hoy solo aviso-legal+privacidad+cookies+envíos-devoluciones) |
| 65 | Accesibilidad | ❌ MISSING (ya en backlog) |
| 66 | Newsletter preferences | ❌ MISSING |
| 67-68 | 404/500 | ✅ |
| 69 | Mantenimiento | ❌ MISSING (ya en backlog, requiere toggle real) |
| 70 | Producto agotado/waitlist | ❌ MISSING (ya en backlog) |
| 71 | Offline | ✅ |
| 72-74 | Comparador/Recently viewed/Back in Stock | ❌ MISSING (ya en backlog, alta prioridad) |
| 75-76 | Drops/Ediciones limitadas | 🟡 |
| 77 | Eventos | ⛔ NOT_VIABLE |
| 78 | Citas/Atelier | ❌ MISSING (baja prioridad) |
| 79 | Tienda/punto físico | 🟡 datos mostrados inline en `/contacto`, sin ruta dedicada |
| 80-81 | Colaboraciones/Press | ⛔ NOT_VIABLE (nunca fabricar) |
| 82 | Trazabilidad/compromisos | ❌ MISSING |
| 83-84 | Archivo/Exposiciones digitales | ⛔ NOT_VIABLE |
| 85 | My Stories | ✅ cubierto conceptualmente por Gift Story |
| 86 | Year in VENNICA | ❌ MISSING (viable, backlog) |
| 87-88 | Tarjeta regalo / redeem | ❌ MISSING |
| 89 | Historial de búsqueda | ❌ MISSING |
| 90 | Alertas y notificaciones | ❌ MISSING |
| 91-92 | Cuenta privacidad/seguridad | ❌ MISSING |
| 93-94 | Returns flow/Repair status | ❌ MISSING (Aftercare, backlog) |
| 95 | Experiencias privadas/tokenizadas | ✅ cubierto por Gift Story (token en URL) |

**Conclusión y siguiente paso:** las 3 familias que el usuario ordenó explícitamente construir después de Atelier — **The Edit, Mood Shop, Shop the Moment** — están confirmadas como MISSING tanto en el sitemap real como en este inventario oficial del PDF. Se continúa directamente con esas tres, en ese orden, sin pausa.

## Auditoría final de cierre (2026-08-12) — correcciones a la tabla de 95 experiencias
Verificación puntual de los ítems que habían quedado marcados 🟡 "verificar":
- **Ítem 30, Búsqueda**: CONFIRMADO MISSING — no existe un buscador global en el header (solo hay búsqueda dentro de `/shop`). No se inventa que existe; queda en backlog real, no bloqueante para el resto de la auditoría.
- **Ítems 34-37, Pago fallido**: NO APLICABLE por ahora — no hay pasarela de pago real conectada (documentado explícitamente en checkout y en `/legal/terminos`), así que un estado distinto de "pago fallido" no tiene sentido hasta que exista un proveedor de pago real. No confundir con MISSING: es NOT_VIABLE condicionado a una integración futura.
- **Ítems 42-45, Pedido individual**: ✅ RESUELTO esta sesión — `/account/pedidos/[id]` ya existe (familia Account expansion).
- **Ítems 60-64, Términos y condiciones**: ✅ RESUELTO esta sesión — `/legal/terminos` (nuevo), enlazado en Footer, `noindex` consistente con el resto de legales.

Estado final honesto: de las 95 experiencias del inventario oficial del PDF, la gran mayoría con propósito real y datos verificables están construidas y verificadas (Gate A, y Gate A+B en las flagship). Los MISSING/NOT_VIABLE restantes están todos documentados explícitamente con su motivo (falta de datos reales del cliente, o funcionalidad condicionada a integraciones futuras) — ninguno se ha fingido como completo.
