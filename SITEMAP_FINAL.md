# SITEMAP_FINAL

Generado a partir de la salida real de `npm run build` (no una lista aspiracional). Actualizado tras cada familia completada, per protocolo del usuario. Total actual: **47 rutas de página + 10 endpoints de API + 3 rutas de sistema (sitemap.xml/robots.txt/manifest)**.

Familias: `DISCOVER` `SHOP` `WORLD` `EXPERIENCE` `ACCOUNT` `AFTERCARE` `EDITORIAL` `UTILITY` `LEGAL` `SYSTEM` (arquitectura conceptual del Bloque D del prompt maestro).

| Route | Family | Purpose | Status | Verified |
|---|---|---|---|---|
| `/` | SHOP+DISCOVER | Home cinematográfica + entrada a todo el ecosistema | VERIFIED | Sí (build+curl+contenido real) |
| `/shop` | SHOP | PLP con filtros/orden/búsqueda reales | VERIFIED | Sí |
| `/producto/[slug]` (12) | SHOP | PDP con sticky buy bar, complete-the-look, JSON-LD | VERIFIED | Sí |
| `/colecciones` | SHOP | Índice de colecciones reales | VERIFIED | Sí |
| `/colecciones/[slug]` (3: raices/tricolor/nocturna) | SHOP+DISCOVER | Microsite de colección | VERIFIED (funcional) | Gate A sí, Gate B pendiente de elevar (ver NEXT_TASK) |
| `/cart` | SHOP | Carrito completo | VERIFIED | Sí (sesión anterior) |
| `/checkout`, `/checkout/success` | SHOP | Checkout demo + confirmación | VERIFIED (demo explícito) | Sí |
| `/wishlist` | SHOP | Lista de deseos real | VERIFIED | Sí |
| `/regalos` | SHOP+EXPERIENCE | Wizard de regalo real | VERIFIED | Sí |
| `/drops` | SHOP | Novedades/ediciones limitadas reales | VERIFIED | Sí |
| `/gift-story/create`, `/gift-story/[token]` | EXPERIENCE | Historia de regalo privada + QR real | VERIFIED | Sí (end-to-end, byte-verificado) |
| `/style-lab/ear-stack` | EXPERIENCE | Combinador drag&drop de pendientes | VERIFIED | Sí |
| `/charms-studio` | EXPERIENCE | Compositor drag&drop cadena+charms | VERIFIED (Gate A) | Build/lint/ruta sí; sin E2E navegador (decisión de alcance documentada) |
| `/visual-search` | EXPERIENCE | Filtro visual honesto (no finge IA de imagen) | VERIFIED | Sí |
| `/lookbook` | DISCOVER+EXPERIENCE | Índice de looks, color por mood real | VERIFIED (Gate A+B) | Sí — ver MASTER_CHECKLIST para detalle de ambos gates |
| `/lookbook/[slug]` (3) | DISCOVER+EXPERIENCE | Escena shoppable: hotspots, guardar look, comprar look completo | VERIFIED (Gate A+B) | Sí |
| `/account` | ACCOUNT | Espacio personal (no dashboard SaaS): saludo+antigüedad real, grid de accesos, pedidos | VERIFIED (Gate A+B) | Sí — ver MASTER_CHECKLIST |
| `/account/pedidos/[id]` | ACCOUNT | Detalle real de pedido, protegido por dueño | VERIFIED | Sí |
| `/account/direcciones` | ACCOUNT | Direcciones guardadas reales (CRUD) | VERIFIED | Sí (end-to-end) |
| `/account/preferencias` | ACCOUNT | Newsletter real (alta/baja) + idioma/apariencia | VERIFIED | Sí |
| `/account/seguridad` | ACCOUNT | Cambio de contraseña real (scrypt) | VERIFIED | Sí (end-to-end) |
| `/account/jewelry-box` | ACCOUNT | Piezas realmente compradas | VERIFIED | Sí (end-to-end) |
| `/account/passports/[id]` | ACCOUNT+AFTERCARE | Pasaporte real, protegido por compra real, QR de compartir | VERIFIED | Sí |
| `/club` | ACCOUNT | Puntos reales sobre pedidos reales | VERIFIED (parcial) | Canje en checkout no conectado |
| `/journal` | WORLD/EDITORIAL | Portada de revista (destacado + grid con chips de categoría) | VERIFIED (Gate A+B) | Sí — ver MASTER_CHECKLIST |
| `/journal/[slug]` (4) | WORLD/EDITORIAL | Apertura tipo revista + drop-cap, artículos reales | VERIFIED (Gate A+B) | Sí |
| `/atelier` | WORLD | Proceso artesanal + desglose real de materiales | VERIFIED (Gate A+B) | Sí |
| `/edit`, `/edit/[slug]` (3) | EDITORIAL/DISCOVER | Curación editorial con voz ("Nº 01/02/03"), distinta de Colecciones/Lookbook | VERIFIED (Gate A+B) | Sí — ver MASTER_CHECKLIST |
| `/mood-shop` | DISCOVER | Compra por sensación (Atrevida/Serena/Nostálgica/Luminosa), no filtros renombrados | VERIFIED (Gate A+B) | Sí — ver MASTER_CHECKLIST |
| `/shop-the-moment` | DISCOVER | Combinaciones ya pensadas por ocasión real, con compra del look completo | VERIFIED (Gate A+B) | Sí — ver MASTER_CHECKLIST |
| `/contacto` | UTILITY | Rediseñada calcada de p.37 del PDF: WhatsApp real, email, tienda física, formulario | VERIFIED | Sí |
| `/nosotros` | WORLD | Historia real de marca | VERIFIED | Sí |
| `/materiales` | WORLD | Educativo+sensorial+comprable: 6 materiales con textura propia y productos reales | VERIFIED (Gate A+B) | Sí — ver MASTER_CHECKLIST |
| `/aftercare` | AFTERCARE | Hub unificado: tracking real+simulado, cuidados, devoluciones, reparación, pasaporte | VERIFIED (Gate A+B) | Sí — ver MASTER_CHECKLIST |
| `/cuidados` | WORLD/AFTERCARE | Guías de cuidado reales | VERIFIED | Sí |
| `/faq`, `/help` | UTILITY | Ayuda | VERIFIED | Sí |
| `/legal/*` (5) | LEGAL | Aviso legal, privacidad, cookies, envíos/devoluciones, términos y condiciones | VERIFIED | Sí |
| `/accesibilidad` | LEGAL/UTILITY | Compromiso honesto de accesibilidad (implementado vs. pendiente) | VERIFIED | Sí — ver MASTER_CHECKLIST |
| `/offline` | SYSTEM | Fallback de Service Worker real | VERIFIED | Sí (sesión anterior) |
| `/api/*` (7) | SYSTEM | Auth, contacto, gift-story+QR, newsletter, pedidos | VERIFIED | Sí, probados con curl real en esta sesión y la anterior |
| `sitemap.xml`, `robots.txt`, `manifest.webmanifest` | SYSTEM | SEO técnico | VERIFIED | Sí (sesión anterior) |

## MISSING (pendiente, no inventado como existente)

Aftercare como experiencia unificada (`/track`, `/returns`, `/repair`, `/second-life` — hoy repartido en legal/passport sin una página "post-compra" propia), i18n, gran parte del sitemap de 60-100+ rutas del Bloque C del prompt maestro. Ver `PROJECT_STATE.md` → `NEXT_TASK` para el orden exacto.
