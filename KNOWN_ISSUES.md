# KNOWN_ISSUES — lo que el prompt maestro pide y NO existe

Ninguno de los siguientes está implementado ni parcialmente maquetado como falso "done". Se listan explícitamente para no fingir que están terminados.

| Item pedido | Estado | Nota |
|---|---|---|
| Visor 3D/WebGL de producto | NOT IMPLEMENTED | No se intentó; requeriría modelos 3D reales que no existen (solo hay ilustraciones SVG). |
| Try-on AR | NOT_VIABLE (evaluado explícitamente, no simplemente omitido) | Requiere: (1) modelos 3D de producto — no existen, el catálogo es SVG; (2) tracking facial/de mano en el navegador — no puedo probar código de cámara real en este entorno de ejecución (sin navegador con permisos de cámara disponible para verificar); (3) sin (1) y (2) verificados de verdad, cualquier "Try-On" sería una demo con overlay falso sobre vídeo, exactamente lo que el contrato prohíbe (§77: "si todavía no es fiable, NO prometas algo falso"). Decisión: no construir. |
| Concierge/estilista con IA | BLOCKED EXTERNAL | UI del chat ya tiene el botón (deshabilitado); falta API key de un LLM y lógica de prompt. |
| Homepage cinemática con scroll storytelling avanzado | NOT IMPLEMENTED | Home actual tiene reveals con IntersectionObserver, no secuencias de vídeo/parallax cinemático. |
| Páginas de regalo con QR privado | NOT IMPLEMENTED | `/regalos` tiene wizard de recomendación, no generación de QR ni páginas privadas por token. |
| Charm/stack builder (drag-and-drop) | NOT IMPLEMENTED | No construido. |
| Club de fidelización con puntos | PARCIALMENTE IMPLEMENTADO | `/club` calcula puntos reales (1€=1pt) sobre pedidos reales; el canje automático de puntos en checkout NO está conectado. |
| Charm/stack builder (drag-and-drop) | PARCIALMENTE IMPLEMENTADO | `/style-lab/ear-stack` es un combinador real (click, no drag) de hasta 3 pendientes con precio real y alta al carrito; no hay drag-and-drop ni charm builder de collar/pulsera. |
| Internacionalización completa ES/EN | NOT IMPLEMENTED | Todo el contenido está solo en español. |
| View Transitions API | NOT IMPLEMENTED | Navegación usa el enrutado estándar de Next/React, sin transiciones de vista nativas. |
| Diseño de sonido | NOT IMPLEMENTED | No hay audio en el sitio. |
| Páginas 500/offline/mantenimiento personalizadas | PARCIALMENTE IMPLEMENTADO | 404, 500 (`error.tsx`) y `/offline` (con Service Worker real) ya existen y están probados. Falta solo la página de "mantenimiento" (no aplica sin un flujo de despliegue real que la active). |
| Gift QR privado | PARCIALMENTE IMPLEMENTADO | `/gift-story/create` → `/gift-story/[token]` genera una página privada real (no indexada, borrable) con mensaje/fecha/lugar. Falta generar el QR visual en sí (solo se comparte el enlace) y la integración con el flujo de checkout/envoltorio. |
| 60-100+ rutas del sitemap completo | NOT IMPLEMENTED | El build genera 54 rutas reales (home, shop, PDPs, colecciones, lookbook, journal, legales, cuentas, API). No se han inventado rutas vacías para llegar al número. |
| Pasarela de pago real | BLOCKED EXTERNAL | Requiere clave de Stripe; checkout queda como demo explícita. |
| Envío de email real (newsletter/contacto/pedidos) | BLOCKED EXTERNAL | Requiere clave de Resend (u otro proveedor); actualmente se persiste en JSON local. |
| Número de WhatsApp real | BLOCKED EXTERNAL | Placeholder en `.env.example`, pendiente de que el negocio dé el número real. |

Cualquier futura sesión: no marcar ninguna de estas filas como DONE sin haber verificado funcionamiento real (no solo maquetación visual).

## Página 44 del PDF — "Estados especiales" (parcial)
- [x] 404: calcado con imagen de producto real + "Únete a la familia VENNICA" (newsletter real vía /api/newsletter) + fila "Sigue explorando".
- [ ] Modo mantenimiento (`02·Mantenimiento`, "Volveremos pronto" + countdown + waitlist email) — NO implementado. Requeriría un toggle real (middleware) que hoy no existe; no lo fingimos con un botón decorativo. Pendiente si se decide activar de verdad un modo mantenimiento.
- [ ] Agotado / waitlist por producto (`03`, aviso "Avísame cuando vuelva" en un PDP agotado) — el catálogo demo no tiene productos con stock=0 marcados para esto; se puede añadir cuando se trabaje Shop/PDP en profundidad. No fabricado todavía.
- [ ] Tiendas / Stockists (`04`, mapa + listado de puntos de venta) — NO implementado; no tenemos direcciones reales de tiendas físicas VENNICA verificadas, así que no se inventan direcciones falsas. Si el cliente confirma puntos de venta reales, se construye con datos reales.

## Cosmético menor: botón flotante de WhatsApp se superpone a veces a tarjetas de producto
Detectado visualmente en `/mood-shop` (mobile, 390px) pero es un widget global fijo (no específico de esta página) — en scrolls concretos su z-index queda sobre el icono de wishlist de la tarjeta superior. No bloquea la interacción (el botón de wishlist sigue siendo clicable en la mayoría de posiciones), pero conviene revisar el z-index/posición del widget flotante en una pasada de pulido visual general, no solo en Mood Shop.

## RESUELTO — Fuga de datos real en GET /api/orders (2026-08-12)
El endpoint `GET /api/orders` sin parámetros devolvía TODOS los pedidos del sistema (direcciones, emails, importes de cualquier cliente) sin autenticación. Con `?id=` devolvía el pedido completo sin comprobar que quien preguntaba fuera el dueño. Nada en la app llamaba a este endpoint así (código muerto, no explotado en producción de esta demo), pero era una ruta real y alcanzable. Corregido: ahora exige `id` + `email` exactos y solo devuelve ESE pedido si coinciden — mismo patrón que un tracking de invitado real. Usado por el nuevo `/aftercare`.

## BLOQUEADO_EXTERNO — View Transitions API (React <ViewTransition>) no disponible en las dependencias instaladas (2026-08-12)
El propio Next.js 16.3.0 de este proyecto documenta (`node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`) el componente declarativo `<ViewTransition>` de React como forma soportada de implementar transiciones de vista en el App Router. Se intentó `import { unstable_ViewTransition as ViewTransition } from "react"` en `ProductCard.tsx` para el patrón de "shared element morph" (miniatura de catálogo → imagen de PDP, el patrón "Product Reveal" ya señalado como pendiente en MOTION_LANGUAGE.md).

**Verificado, no es un error de nombre de import**: la versión de React realmente instalada (`react@19.2.8`, confirmado en `package.json` y en `node_modules/@types/react/index.d.ts`) NO exporta `ViewTransition` ni `unstable_ViewTransition` bajo ningún nombre — ni siquiera el propio React vendorizado internamente por Next (`node_modules/next/dist/compiled/react/*.js`) lo incluye. El build falla con `TS2305: Module "react" has no exported member`. Es decir: la documentación de este Next.js describe una funcionalidad que requiere una versión de React más nueva (canary) que la que está realmente instalada en `node_modules`.

**Decisión**: NO se actualiza `react`/`react-dom` al canal canary para desbloquear esto. Es un cambio de dependencia de raíz, no un cambio de contenido — canary es explícitamente un canal inestable de React (puede tener breaking changes entre versiones), y arriesgar la estabilidad de las ~45 rutas ya verificadas de todo el sitio por una funcionalidad de motion no parece razonable sin confirmación explícita del cliente/usuario. Revertido el intento, build limpio de nuevo, servidor re-verificado con curl (PID 15948).

**Si se quiere desbloquear en el futuro**: actualizar `react`/`react-dom` a una versión canary compatible con Next 16.3 (`npm install react@canary react-dom@canary` o la versión concreta que Next 16.3 declare como peer para esta feature), volver a intentar el mismo patrón de `ProductCard.tsx`/`ProductGallery.tsx` documentado aquí, y re-ejecutar el barrido completo de regresión de las ~45 rutas antes de dar por bueno el cambio.

## Confirmado (no es un gap, es una decisión correcta ya aplicada): reseñas/UGC en PDP y Best Sellers
Auditoría visual de esta sesión confirma que tanto la p.13 ("Best Sellers") como la p.19 ("Producto") del PDF de propuesta muestran reseñas con nombre y estrellas ("★★★★★ 4,9 de 139 reseñas", "Marta S. · Compra verificada"), fotos de "Lo llevan así" (UGC) y packs con precios inventados. La PDP real (`/producto/[slug]`) ya NO incluye nada de esto — confirmado correcto, no es un gap de fidelidad visual: fabricar reseñas con nombres y estrellas falsas sería el tipo exacto de dato no verificable que este proyecto se ha negado a inventar desde el principio de la sesión. Se documenta aquí explícitamente tras la auditoría visual para que quede claro que la omisión es intencional, no un olvido.
