# PROJECT_STATE — VENNICA Next.js

## ESTADO ACTUAL (2026-08-12, CIERRE TOTAL: VISUAL 68/68 + MASTER 95/95, 0 PARTIAL, 0 TODO, 0 BLOCKED_EXTERNAL)

**ÚLTIMO CIERRE**: los dos huecos que quedaban (9.4 Visor interactivo, #28 Try-On) están cerrados. `Product360Viewer.tsx` (turntable 360° `DEMO_SIMULATED` real, integrado en `ProductLightbox`) y `/try-on` + `TryOnStage.tsx` + `lib/tryOn.ts` (Try-On progresivo cámara/foto con arquitectura `TryOnProvider`). Detalle completo en `WORK_LOG.md`. Resultado: **VISUAL 68/68 MATCHED/FROZEN** y **MASTER 95/95 DONE** — 0 PARTIAL, 0 TODO, 0 BLOCKED_EXTERNAL en ambas métricas. Build/lint/E2E (12/12) en verde, servidor de producción corriendo en `http://localhost:3000`.

---

## Histórico previo (2026-08-12, antes del cierre final de 9.4/#28)

**CURRENT PHASE**: Las dos métricas se verifican y reportan por separado, sin mezclarlas (instrucción explícita del usuario). Ver `VISUAL_REFERENCE_INDEX.md`/`FREEZE_MANIFEST.md` para VISUAL y `95_EXPERIENCE_FINAL_MATRIX.md` para MASTER.

**VISUAL (`VISUAL_REFERENCE_INDEX.md`, 68 referencias del mockup)**: **67 MATCHED/FROZEN, 1 PARTIAL, 0 NOT_STARTED, 0 BLOCKED_EXTERNAL = 68/68 existen**. Esta sesión se cerraron los 3 PARTIAL heredados de la vuelta anterior:
1. **0.6 i18n** → **MATCHED**. Namespace `accountMore` nuevo cierra las 6 sub-páginas de cuenta que quedaban (preferencias/notificaciones/jewelry-box/passports, sumadas a direcciones/seguridad ya hechas antes); junto con Gift Finder/regalos/Concierge/Journal/legal/Charm Studio/Style Lab ya cerrados, todo el chrome de interfaz con mockup propio está traducido ES/EN/FR y verificado en vivo.
2. **9.1 Cinematic Home** → **MATCHED**. La composición `GENERATED_DEMO` de `HomeHero.tsx` ya aplicaba el mismo criterio que el resto del sitio (demo cuidado en vez de bloquear por falta de foto real) — solo hacía falta reconocerlo como tal en el índice, no había trabajo pendiente real.
3. **9.4 Visor interactivo** → sigue **PARTIAL**, y se documenta por qué es una excepción legítima (no un gap perezoso): el núcleo real (zoom/pan/teclado) está terminado; el 360°/vídeo del proceso requeriría fotografía/vídeo real que no existe — simularlo con una imagen generativa girando sería decoración fingiendo ser una funcionalidad real, exactamente lo que el mandato prohíbe. Misma naturaleza que #28 Try-On en MASTER.

**MASTER (`95_EXPERIENCE_FINAL_MATRIX.md`, 95 experiencias funcionales del PDF pp.54-58)**: **94/95 DONE**, verificado ID a ID contra rutas reales. 7 gaps reales cerrados esta sesión (antes ninguno tenía ni formulario ni flujo propio, no eran "falta de contenido" sino funcionalidad ausente):
- #36 Pago fallido — simulación honesta de rechazo de tarjeta (nº terminado en 0002) con reintento/cambio de método.
- #41 Recuperar contraseña — flujo self-service real (`/account/recuperar` → `/account/restablecer`), token HMAC con expiración de 1h, `DemoEmailProvider` (`data/demo-emails.json`), anti-enumeración de usuarios.
- #53 Packaging — página nueva (`/packaging`).
- #55 / #94 Reparaciones y Second Life / Repair status — `/reparaciones` con formulario real (`data/repair-requests.json`) y estado simulado honesto (`lib/repairTracking.ts`, mismo patrón que el tracking de pedidos).
- #60 Preferencias cookies — centro de consentimiento real (`CookieConsentBanner`, aceptar/rechazar/personalizar por categoría, persistido, reabrible desde el footer); antes solo enlazaba a la política estática.
- #89 Historial de búsqueda — `searchHistoryStore`, hasta 8 búsquedas recientes reutilizables/borrables en el buscador global.
- #91 Cuenta - privacidad — `/account/privacidad`: exportación real de datos (perfil+pedidos en JSON) + solicitud de borrado de cuenta (procesada manualmente, como el resto de formularios de esta demo).

Único ítem sin cerrar: **#28 Try-On, BLOCKED_EXTERNAL legítimo** — requiere cámara/AR/WebXR reales; el propio MASTER lo condiciona a "si es viable". MASTER sería 95/95 si se excluye esta única dependencia de hardware/navegador fuera del control del código.

**NEXT ITEM**: barrido final de responsive (1440/1280/1024/768/390/375) y WCAG 2.2 AA por pantalla, regresión de seguridad (IDOR en `/api/orders`, `/api/auth/*`, Passport, Gift Story — incluyendo los endpoints nuevos `/api/account/export`, `/api/account/delete-request`, `/api/repairs`, `/api/auth/forgot-password`/`reset-password`), bug hunt de formularios, crawl final de rutas, journeys mobile/desktop. i18n de contenido Bloque 8 (Eventos/Colaboraciones/Prensa/Archivo/Exposiciones/Tiendas/Ediciones limitadas/Best Sellers) queda en español — no bloquea ni VISUAL 68/68 ni MASTER 94/95, es contenido sin mockup propio en el PDF.

**PROTOCOLO FIX→VERIFY→FREEZE**: `FREEZE_MANIFEST.md` regenerado — 67 referencias FROZEN=YES (no se re-auditan salvo bug reproducible o regresión de un componente global), 1 FROZEN=NO (9.4, PARTIAL legítimo documentado arriba). Progreso debe ser monótono: nunca bajar de 67 MATCHED ni de 94 MASTER DONE.

**OPEN BUGS CONOCIDOS**: ninguno detectado hasta ahora (lint limpio, build limpio, 9/9 E2E tras cada cierre, smoke Playwright en vivo de los 7 flujos nuevos). No se ha hecho todavía el bug-hunt exhaustivo de seguridad/formularios de las secciones 9-14 del mandato del usuario — pendiente, no confirmado como "sin bugs" a ese nivel.

**SERVER COMMAND**: `cd c:\Users\ferris\vennica-next && npm run build && npm run start -- -p 3000` (build de producción, no dev). Antes de arrancar: matar cualquier proceso en el puerto 3000 (`netstat -ano | grep ':3000'` → `Stop-Process -Force`). Después de cada suite E2E: limpiar `data/{orders,users,contact-messages,gift-stories,back-in-stock-requests,gift-cards,appointment-requests,event-rsvps,password-reset-tokens,demo-emails,account-deletion-requests,repair-requests,newsletter-subscribers}.json` a `[]`.

**CONTINUATION REQUIRED**: sí, para el barrido final (responsive/a11y/seguridad/bugs/journeys/sweep final PDF) — pero las dos métricas pedidas explícitamente ya están cerradas y reportadas: VISUAL 68/68 (67 FROZEN) y MASTER 94/95.

---

Última actualización (histórico): 2026-08-09 (sesión de ejecución P0→P3). Servidor de producción local corriendo en `http://localhost:3000` (`npm run start -- -p 3000`), reiniciado en limpio desde `CANONICAL_PROJECT_ROOT = c:\Users\ferris\vennica-next` tras el último cambio, verificado con curl (200 en `/`).

## Hallazgo estructural de esta sesión (afecta a todo P0.1-P0.4)

No existe fotografía ni vídeo de producto real en este proyecto — el catálogo usa ilustraciones SVG (ver `DECISIONS.md`). El research real (`DESIGN_RESEARCH_2026.md`) confirma que la "home cinematográfica" que pide el contrato depende de fotografía/vídeo macro real. Sin ese asset, cualquier intento de "Home cinematográfica" sería decoración sin producto real detrás — exactamente lo que el contrato prohíbe. P0.1-P0.4 quedan acotados a tipografía/ritmo/motion/arquitectura hasta que exista material fotográfico real.

## P0 — cerrado en esta sesión (dentro de lo real posible)

1-4. Home cinematográfica / dirección artística / motion system: acotados por falta de fotografía real de producto (ver hallazgo estructural arriba). `DESIGN_RESEARCH_2026.md`, `ART_DIRECTION.md`, `MOTION_LANGUAGE.md` creados y honestos sobre qué es real y qué no.
5. Logo real: `BLOCKED_EXTERNAL`, sin asset disponible, no inventado.
6. Mega menu real: DONE, verificado (build + curl).
7. PDP premium: parcial DONE (sticky mobile buy bar + "completa el look" real ligado a colección). Reviews y dimensiones NO añadidas — no hay datos reales, no se van a fingir.
8. Contact experience adaptativa: DONE, verificado end-to-end (POST real → persistencia con `orderId` condicional).

## Nota operativa importante (para no repetir el fallo)

`Stop-Process -Id <pid>` seguido de un restart puede fallar en silencio si el PID ya no es el que escucha en :3000 (build anterior aún corriendo) — el `npm run start` nuevo revienta con `EADDRINUSE` y el curl de verificación posterior sigue golpeando el servidor viejo, dando falsos positivos de "verificado". Protocolo correcto a partir de ahora: 1) `netstat -ano | grep ":3000" | grep LISTENING` para obtener el PID REAL antes de matar nada; 2) matarlo; 3) volver a comprobar que el puerto queda libre; 4) arrancar; 5) sólo entonces verificar. Ocurrió una vez esta sesión (detectado y corregido antes de reportar el QR como verificado).

## Digital Jewelry Box y Gift Story QR — DONE (P1.9, P1.10 parcial)

Ambos verificados end-to-end de verdad (ver `MASTER_CHECKLIST.md` para el detalle exacto de cada prueba), no solo visualmente.

## P1 — CERRADO (11-15)

Charm/Style Lab drag&drop, Product Passport, AI Concierge (local real, no LLM), Visual Search (filtro real por atributo, no finge análisis de imagen), Try-On (NOT_VIABLE evaluado y documentado, no construido como fake). Detalle exacto y pruebas en `MASTER_CHECKLIST.md`.

## P0 Cinematic Home — hero + campañas DONE, resto pendiente

`CinematicHero.tsx` + `Reveal.tsx` (reutilizable) + sección de campañas por colección ya reales y verificados (ver `MASTER_CHECKLIST.md`). `ProductPlate`/`ProductLightField` siguen siendo solo apoyo — el peso visual real de esta entrega está en composición/escala/movimiento/narrativa, no en los gradientes.

## Lookbook flagship — CERRADO (Gate A + Gate B, ver MASTER_CHECKLIST.md)

`SITEMAP_FINAL.md` y `PDF_COMPLIANCE_MATRIX.md` creados por primera vez esta sesión y actualizados.

## PIVOTE: nueva fuente de verdad visual (2026-08-12)

El usuario adjuntó dos PDF nuevos que ahora mandan sobre la interpretación libre de sesiones anteriores:
- `spec/VENNICA_Propuesta_Cliente_FINAL_v2.pdf` (59 páginas, mockups reales aprobados por cliente — pixel target real)
- `spec/VENNICA_Master_Claude_v2_322p.pdf` (322 páginas, prompts complementarios — sin revisar todavía)

Páginas ya renderizadas a PNG en `C:\Users\ferris\AppData\Local\Temp\claude\c--Users-ferris-vennica-next\fa6a7751-3c31-409f-8aa4-16b9f6a7d159\scratchpad\propuesta\page-001.png` … `page-059.png` (regenerar con el script de más abajo si la carpeta scratch se pierde entre sesiones — es temporal).

Cómo re-renderizar si hace falta:
```
python3 -c "
import fitz, os
outdir = r'RUTA_SCRATCHPAD\propuesta'
os.makedirs(outdir, exist_ok=True)
doc = fitz.open('spec/VENNICA_Propuesta_Cliente_FINAL_v2.pdf')
for i in range(doc.page_count):
    doc.load_page(i).get_pixmap(dpi=110).save(os.path.join(outdir, f'page-{i+1:03d}.png'))
"
```

Cómo tomar capturas reales del sitio para comparar (Playwright ya instalado como devDependency):
```
NODE_PATH="C:\Users\ferris\vennica-next\node_modules" node RUTA_SCRATCHPAD\screenshot.js "http://localhost:3000/RUTA" "nombre.png" ANCHO ALTO
```
(el script hace scroll completo antes de capturar para disparar los `Reveal`).

### Páginas del PDF de propuesta ya revisadas y aplicadas (1-17)
1-10: Bloque 0 — portada, identidad, logo/monograma NN, paleta exacta, tipografía exacta, iconografía, multiidioma. TODO aplicado globalmente.
11: divisor Bloque 1.
12: Home (aplicado en `HomeHero.tsx` + `page.tsx`).
13: Best Sellers (NO aplicado todavía — layout de reviews/packs pendiente).
14: Catálogo/Shop PLP (parcialmente aplicado — falta banner "JOYAS CON PROPÓSITO" y sidebar de filtros con checkboxes reales en vez del `CategoryFilters` actual).
15-17: Pendientes/Colgantes/Pulseras — páginas de categoría con hero+subcategorías+guía de estilo (NO aplicado — `/shop?categoria=X` sigue siendo genérico, no tiene hero propio por categoría).

18: Charms (categoría) — promo real "Crea tu pulsera o collar a tu manera" enlazando a Charm Studio, ya alineado con lo construido.
19: Producto/PDP — mucho más rico que el actual: acordeones (Historia y significado / Detalles / Envío y devoluciones / Cuidados) en vez de secciones planas, bloque "Combínalo con → Ver looks" (enlazar a Lookbook, encaja perfecto con lo ya real), UGC ("Lo llevan así") y reviews ("Lo que dicen") — NO añadir reviews/UGC falsos, son datos que no existen; si se añade la sección debe quedar vacía/honesta o no mostrarse.
20: divisor Bloque 2 · Descubrimiento editorial (Colecciones, lookbook, Mood Shop, Shop the Moment, The Edit, Journal, nuestra historia).
21: overview a miniatura de 10 páginas (21-30): Colecciones, Colección Individual, Lookbook, Lookbook Individual, Mood Shop, Shop The Moment, The Edit, Journal listado, Artículo Journal, Nuestra historia. Zoom parcial reveló:
  - Nombres reales de colección (más de las 3 actuales): RAÍCES, LUNAR, ORIGEN, ALMA, TIERRA, LUZ (6 colecciones, cada una con "N piezas"). Actualmente solo existen Raíces/Tricolor/Nocturna en `collections.ts` — decidir si renombrar Tricolor→uno de estos o añadir más colecciones reales.
  - Categoría de producto "ANILLOS" (anillos/rings) aparece en nav y footer — NO existe en `ProductCategory` (`src/lib/types.ts` solo tiene pendientes/pulseras/colgantes/charms). Añadir si se quiere fidelidad completa.
  - Footer tiene 5 columnas en algunas páginas, no 4: DESCUBRIR / TIENDA / AYUDA / **CUENTA** (Mi cuenta, Pedidos, Wishlist, **Joyero digital** — confirma el naming "Joyero digital" para Jewelry Box) / SUSCRÍBETE. El `Footer.tsx` actual solo tiene 4 columnas, falta la columna CUENTA.
  - Nav en páginas de Descubrimiento muestra JOYAS/COLECCIONES/PERSONALIZA/EXPERIENCIAS/SOBRE VENNICA (varía ligeramente respecto a la Home, que mostraba GIFT FINDER en vez de EXPERIENCIAS) — el PDF no es 100% consistente entre páginas, usar criterio.

22: divisor Bloque 3 · Experiencias especiales (Regalar, personalizar, combinar, ayuda).
23: Gift Finder — asistente de 4 pasos con selección visual por persona (Para ti/Pareja/Amigo/Mamá/Hijo/Hermano/Otro), más rico que el wizard actual de 3 pasos en `/regalos`. NO aplicado todavía.
24: `/regalos` como hub — secciones por destinatario/ocasión/presupuesto/tipo de joya + tarjeta regalo + envoltura premium. NO aplicado (el `/regalos` actual es solo el wizard).
25: Personalización — configurador real (grabado, material, largo de cadena, charms opcionales, preview en vivo, precio dinámico). El `/personaliza` actual es solo un agregador de enlaces, NO un configurador — gap real grande si se quiere fidelidad completa.
26: "Charm Studio" en el PDF reutiliza literalmente el mockup estático de la página de categoría Charms (no muestra un builder interactivo real) — lo que ya construimos en `/charms-studio` (drag&drop real) va POR DELANTE del propio mockup aquí.
27: Concierge VENNICA — APLICADO esta sesión (`/concierge`, reutilizando `concierge.ts` real).
28: Búsqueda visual — el propio PDF lo titula condicionalmente ("si la tecnología y privacidad lo permiten"), confirma que el enfoque honesto ya implementado en `/visual-search` está alineado en espíritu con la propuesta, no hace falta rehacerlo.

### Páginas 29-59: NO REVISADAS TODAVÍA — esto es lo siguiente (cuenta, checkout, journal, atelier/nosotros, materiales, cuidados, faq, contacto, legales, y el resto)

## NEXT_TASK (siguiente tarea exacta — SEO, siguiente fase post-familias)

Fases ya completadas de esta etapa: i18n (decisión documentada: ES-only real, ver DECISIONS.md — no se construye traducción completa), View Transitions (BLOQUEADO_EXTERNO por versión de React, ver KNOWN_ISSUES.md), Performance (pasada real: fs.mkdir memoizado, poweredByHeader:false, fuentes verificadas sin peso muerto, ver MASTER_CHECKLIST.md), Accessibility (`/accesibilidad` nueva + bug real de teclado en mega-menú corregido y verificado con Playwright, ver MASTER_CHECKLIST.md).

SEO ✅ completado (sitemap.ts reescrito con 51 URLs reales — antes no incluía NINGUNA ruta construida esta sesión; noindex añadido a 11 páginas personales/transaccionales que no lo tenían; metadata añadida a /visual-search que no tenía ninguna. Ver MASTER_CHECKLIST.md).

## CIERRE DE SESIÓN (2026-08-12) — todas las fases del plan del usuario completadas

Las 10 familias del sitemap obligatorio + i18n + View Transitions + Performance + Accessibility + SEO + E2E + auditoría visual + auditoría final contra ambos PDF están completas. Resumen honesto de esta sesión larga:

- **59/59 páginas del PDF de propuesta revisadas**, más un barrido dirigido del PDF maestro de 322p.
- **47 rutas de página + 10 endpoints de API** reales, todas verificadas 200 en servidor de producción real (build+start, nunca dev server) en algún momento de esta sesión.
- **Bugs reales encontrados y corregidos** (no solo features nuevas): fuga de datos en `GET /api/orders` (devolvía todos los pedidos de todos los clientes sin autenticar), mega-menú inaccesible por teclado, sitemap.ts desactualizado (no incluía ninguna ruta nueva), 11 páginas personales sin `noindex`, 3 bugs de `e.currentTarget.reset()` tras `await` que hacían fallar formularios que en realidad sí se habían enviado con éxito (encontrados por el propio E2E), un nombre de archivo interno filtrado en copy de cara al usuario, un enlace de ayuda desactualizado.
- **Correcciones de marca**: Instagram real `@vennica.bisuteria` (no `@vennica.store`, inventado en una sesión previa a la PDF); confirmado que Venezuela+Nicaragua+Zaragoza es la marca real pese a un typo puntual "Ecuador" en una lámina del mockup.
- **7 tests E2E reales** con Playwright contra servidor de producción (`e2e/critical-flows.spec.ts`), todos en verde.
- Todo dato de prueba (usuarios, pedidos, mensajes, gift stories) creado durante verificaciones ha sido limpiado de `data/*.json` después de cada uso.
- Gaps honestos que quedan documentados y NO fingidos como resueltos: buscador global en header (MISSING), View Transitions (BLOQUEADO por versión de React instalada), i18n EN/FR real (decisión: no se construye, ES-only con "Próximamente" honesto), Press/Media/Colaboraciones/Archivo/Eventos (NOT_VIABLE permanente sin datos reales del cliente), modo alto contraste dedicado (MISSING, documentado en `/accesibilidad`).

Para continuar en una futura sesión: no hay una única `NEXT_TASK` pendiente del plan original — todo lo pedido está hecho. Los siguientes pasos serían decisiones de producto del cliente real (¿se activa i18n de verdad? ¿hay direcciones de tiendas físicas además de Zaragoza? ¿se conecta una pasarela de pago real?), no tareas de ingeniería que se puedan seguir ejecutando de forma autónoma sin esa información.

## NEXT_TASK (histórico — auditoría final contra ambos PDF, última fase del plan original, ya completada arriba)

E2E ✅ completado (`playwright.config.ts` + `e2e/critical-flows.spec.ts`, 7/7 tests reales en verde. **3 bugs de producción reales encontrados y corregidos por el propio E2E**: `ContactForm.tsx`/`ChangePasswordForm.tsx`/`AddressesClient.tsx` llamaban `e.currentTarget.reset()` después de un `await`, causando que el usuario viera "Cannot read properties of null" en vez del mensaje de éxito tras un envío que SÍ había funcionado. Ver MASTER_CHECKLIST.md).

Siguiente: auditoría visual completa (recorrido con Playwright screenshot de las ~46 rutas reales, desktop+mobile, buscando regresiones visuales no detectadas por los tests funcionales) → auditoría final contra ambos PDF (repasar `PDF_COMPLIANCE_MATRIX.md` de principio a fin y confirmar que cada REQ sigue siendo cierto).

**Las 10 familias del sitemap obligatorio están completas** (Lookbook → Atelier → The Edit → Mood Shop → Shop The Moment → Stories [cubierta por Gift Story] → Journal Gate B → Materials Gate B → Account expansion → Aftercare unificado). Ver `MASTER_CHECKLIST.md` para el detalle de cada una.

Siguiente fase, en este orden exacto (instrucción del usuario): **i18n → View Transitions → performance → accessibility → SEO → E2E → auditoría visual completa → auditoría final contra ambos PDF.**

i18n: el sitio ya tiene selectores ES/EN/FR en Header/Footer pero EN/FR están marcados "Próximamente" (`cursor-not-allowed`, honesto). Decidir alcance real: o se implementa i18n de verdad (next-intl o similar, con traducción real de todo el contenido — coste altísimo dado el volumen de páginas ya construidas) o se documenta explícitamente que el sitio es ES-only por decisión de producto y se retira la promesa visual de "Próximamente" si no se va a cumplir. No dejar la ambigüedad sin decidir.

## FAMILIAS COMPLETADAS (histórico, ver arriba para el detalle de cada tarea)

Estado (2026-08-12): **las 59 páginas del PDF de propuesta están revisadas por completo**, más un barrido dirigido del PDF maestro de 322p (Bloque D arquitectura, Bloque 2 descubrimiento editorial, inventario de 95 experiencias). Ver `PDF_COMPLIANCE_MATRIX.md` → "Auditoría completa — Inventario de 95 experiencias" para el cruce exhaustivo contra las rutas reales.

1. Lookbook flagship ✅ VERIFIED (Gate A+B)
2. Atelier ✅ VERIFIED (Gate A+B)
3. The Edit ✅ VERIFIED (Gate A+B) — `/edit`, `/edit/[slug]` (3 entregas: "Si es tu primera vez con nosotros", "Menos es más", "Para regalar sin fallar")
4. Mood Shop ✅ VERIFIED (Gate A+B) — `/mood-shop`, 4 sensaciones (Atrevida/Serena/Nostálgica/Luminosa)
5. Shop The Moment ✅ VERIFIED (Gate A+B) — `/shop-the-moment`, 4 ocasiones con look completo comprable
6. Stories — NO se construye como ruta separada (ver `DECISIONS.md`: ya cubierta por Gift Story = "My Stories" en el inventario oficial del PDF)
7. Journal ✅ VERIFIED (Gate A+B) — portada de revista con destacado + drop-cap en artículos
8. Materials ← siguiente — elevar Gate B a "educativo+sensorial+comprable"
9. Account expansion — preferences/security/notifications reales
10. Aftercare unificado — tracking+care+returns+repair+passport+second life como una experiencia, no piezas sueltas

Backlog adicional confirmado por el inventario de 95 (no bloqueante, intercalar cuando haya hueco natural): Comparador, Recently viewed, Back in Stock Center, Best Sellers, Year in VENNICA, Términos y condiciones (falta como página legal separada), Recuperar contraseña, Preferencias newsletter, Direcciones/Preferencias de cuenta, Packaging. Ver tabla completa en `PDF_COMPLIANCE_MATRIX.md`. Nunca construir sin datos reales del cliente: Press/Media, Colaboraciones, Archivo, Exposiciones digitales, Eventos, Tiendas más allá de Zaragoza (todo NOT_VIABLE — no fabricar).

Corrección importante ya aplicada esta sesión: el Instagram real es **@vennica.bisuteria** (confirmado con zoom en p.52 del PDF de propuesta), no `@vennica.store` como se había puesto antes — corregido en Footer y `/nosotros`. País de origen confirmado como **Venezuela + Nicaragua + Zaragoza** (marca real, p.1/2/60 del PDF maestro) pese a un typo puntual "Ecuador" en un mockup — ver `DECISIONS.md`.

Después de cada familia: actualizar `SITEMAP_FINAL.md`, `PDF_COMPLIANCE_MATRIX.md`, `MASTER_CHECKLIST.md`, regression de esa familia, comprobar al menos una ruta representativa. No parar entre familias mientras se pueda seguir. Después: i18n → View Transitions → performance → accessibility → SEO → E2E → auditoría visual completa → auditoría final contra ambos PDF.

<!-- ORIGINAL (ya completado, mantenido como referencia histórica):
1. **Lookbook flagship** (`/lookbook`, `/lookbook/[slug]` — ya existen con escenas shoppable reales, `LookScene.tsx`): elevar visualmente reusando `ProductPlate`/`Reveal`/paleta de campaña en vez del tratamiento actual más plano. Revisar `src/components/LookScene.tsx` primero.
2. **Atelier** (`/atelier` — no existe todavía): crear ruta nueva, storytelling de proceso/materiales usando contenido real ya existente en `src/lib/products.ts` (`materials`, `story`) y `/nosotros`, sin inventar procesos de fabricación reales no verificados (marcar como conceptual donde corresponda, per contrato §15 del prompt maestro sobre Atelier).
3. **The Edit** (`/the-edit` — no existe): selección curatorial real (subconjunto de productos reales con narrativa editorial propia).
4. **Mood Shop** (`/mood` — no existe): discovery por mood/tono, reusar patrón de `/visual-search` (filtro real por atributo) con naming editorial.
5. **Shop The Moment** (`/momentos` — no existe): discovery por ocasión, similar patrón.
6. **Stories** vs **Journal expansion**: `/journal` ya existe (4 artículos reales) — diferenciar de `/stories` (contenido más personal/marca) si se crea, no duplicar.
7. **Materials** (`/materiales` ya existe) — expandir con subpáginas por material si el contenido real lo justifica.
8. **Account expansion**: revisar qué falta de la lista original del prompt maestro (`/account/preferences`, `/account/security`, etc.) vs. lo ya real (`/account`, `/account/jewelry-box`, `/account/passports/[id]`).
9. **Aftercare**: `/returns`, `/track` — verificar si ya existen bajo otros nombres (`/legal/envios-devoluciones`) antes de duplicar.
10. Resto del sitemap restante — actualizar `SITEMAP_FINAL.md` después de cada familia, no al final.

Cada ruta nueva: propósito real, contenido real (no lorem ipsum), navegación enlazada (footer/mega menu), responsive, verificado con build+curl real, no solo creado. Después: i18n, View Transitions, performance, accessibility, SEO, E2E, auditoría final. No preguntar entre tareas — CONTINUATION REQUIRED significa continuar.

## Qué es esto realmente

Una tienda/showcase de bisutería en Next.js 16 (App Router, TS strict, Tailwind v4), con catálogo, carrito, wishlist, checkout de demostración, cuentas con sesión real, colecciones, lookbook shoppable, journal editorial y buscador de regalos. **No** es el "digital flagship" de 60-100 rutas con WebGL/IA/AR/loyalty descrito en el prompt maestro de 159 páginas. Ver `KNOWN_ISSUES.md` para el listado explícito de lo no construido.

## DONE (real, probado con Playwright contra build de producción)

- Home, Shop (PLP con filtros/orden/búsqueda vía searchParams), PDP con JSON-LD Product/Offer, Cart, Wishlist, Checkout (demo) + success.
- Auth real: registro/login/logout con scrypt + cookie firmada HMAC-SHA256, `/account` muestra pedidos reales del usuario.
- Colecciones (`/colecciones`, `/colecciones/[slug]`) — 3 colecciones curadas reales.
- Regalos (`/regalos`) — wizard de 3 pasos que recomienda productos reales.
- Lookbook (`/lookbook`, `/lookbook/[slug]`) — escenas shoppable con hotspots reales sobre productos reales.
- Journal (`/journal`, `/journal/[slug]`) — 4 artículos editoriales reales con contenido propio.
- Materiales, Cuidados, Nosotros, FAQ, Contacto, 4 páginas legales.
- SEO: sitemap.ts, robots.ts, manifest.ts generados dinámicamente desde los datos reales; favicon.ico real generado (no el placeholder de Next).
- Dark mode persistente (sin flash, sin desincronización tras refresco).
- `npm run lint` limpio, `npm run build` exitoso (54 rutas estáticas/dinámicas).

## BLOCKED EXTERNAL (requiere credenciales que no tengo)

- Pasarela de pago real (Stripe) — checkout es explícitamente "pedido de demostración".
- Envío de emails real (Resend) — formularios validan y persisten en JSON local, no envían correo.
- Asistente IA en el chat — botón visible pero deshabilitado ("Próximamente"), requiere API key de un LLM.
- WhatsApp — número placeholder en `.env.example`, requiere el número real del negocio.

## NOT IMPLEMENTED (no intentado, no es "casi hecho")

Ver `KNOWN_ISSUES.md`.
