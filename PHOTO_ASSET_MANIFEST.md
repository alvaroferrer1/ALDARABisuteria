# PHOTO_ASSET_MANIFEST

Inventario final de fotografía para cerrar VENNICA. Este documento sustituye a `ASSET_REGISTRY.md` (referencia antigua, mismo propósito, ahora obsoleta frente a este) como la lista viva de qué fotografía falta y exactamente qué nombre de archivo debe recibir cada una.

## ACTUALIZACIÓN (2026-08-17): 29 fotografías reales activas

El cliente entregó `spec/VENNICA_ENTREGA_MAESTRA_A_J.zip` (127 imágenes, bloques A-J) + `spec/VENNICA_Guia_Maestra_Integracion_Claude.pdf` (mapa de qué imagen va en qué ruta). **29 de esas 127 ya están activas en `public/photos/`**, cubriendo los slots de mayor tráfico: Home (hero + 4 categorías + 6 colecciones), Shop (banner "Joyas con propósito"), 1 de los 12 productos (Mapa del Alma, main + worn), Lookbook (3 escenas), Journal (4 artículos), Tiendas y Exposiciones (parcial).

**Aviso real detectado durante la integración, no un detalle menor**: de los 127 archivos entregados, un subconjunto (sobre todo los "-01 hero" de categorías B y de varias colecciones C) **no son fotografías aisladas — son capturas de página completa de un mockup de referencia** (con navegación, precios y textos falsos ajenos a este sitio, en un caso con "potenciado por IA" que contradice el Concierge real). Esos NO se han usado tal cual. En su lugar se usó la variante "-02" limpia (o la foto que de verdad correspondía) y, cuando la foto limpia llevaba texto de marca incrustado en un lateral, se recortó ese panel — nunca se ha dejado un archivo con texto ajeno o UI falsa incrustada en el sitio real. Detalle exacto de qué archivo del ZIP alimenta cada slot: `spec/VENNICA_ENTREGA_MAESTRA_A_J.zip` conserva los originales si hace falta reauditar la elección.

**Quedan 98/127 imágenes del ZIP sin integrar** (la mayoría de los bloques E/F/G/H/I/J: Charm Studio, Style Lab, Personalización, Concierge, Cuenta/Login/Registro/Club/Joyero/Pasaporte, Materiales/Proceso/Devoluciones, Eventos/Colaboraciones/Prensa/Archivo/Drops/Ediciones limitadas, Gift Card/Gift Story/Momentos/My Stories/Year in VENNICA, y los estados 404/500/offline/mantenimiento/checkout) porque sus componentes todavía no tienen un `PhotoSlot`/`DemoPhoto` real donde encajar la imagen sin construir código nuevo — no es que se hayan descartado, es que integrarlas requiere añadir el slot primero. Quedan también 11/12 productos sin foto propia (solo Mapa del Alma la tiene) y los 17 vídeos del Bloque K del PDF, que el propio cliente indica que están "pendientes de producción" (no se han fabricado con pan/zoom falso, tal y como exige la guía).

**Estado antes de esta entrega (histórico, ya no vigente): 0 fotografías reales existían** en `public/`. Todo lo que se veía en el sitio era composición generativa (SVG: gradientes, siluetas, grano `feTurbulence`), documentada como `GENERATED_DEMO` en cada componente — y sigue siéndolo en los slots que aún no tienen foto real.

## Cómo funciona la sustitución (léase antes de la tabla)

El código ya está preparado en **todos** los slots listados abajo. Para activar una fotografía:

1. El fotógrafo/cliente entrega el archivo final en formato **WEBP**.
2. Se coloca en `public/photos/<nombre-exacto-de-la-columna-2>.webp` (nombre exacto, en minúsculas, sin espacios — copiar tal cual de la tabla).
3. Se hace `npm run build` + redeploy (el mismo paso que ya se hace para publicar cualquier cambio).
4. Listo. El componente detecta el archivo automáticamente y lo muestra en vez de la composición generativa — **cero cambios de código, cero cambios de CSS, cero cambios de layout.**

No hace falta editar ningún componente, ninguna ruta de importación, ningún archivo de configuración. Si una foto se retira o se sustituye por otra, basta con reemplazar el archivo (mismo nombre) o borrarlo (vuelve a mostrarse la composición generativa automáticamente, nunca una imagen rota).

### Cómo se comprueba (para quien mantenga el código después)

- `src/lib/photoManifest.ts` lee `public/photos/` en el servidor (`fs.readdirSync`) una vez por build/request — sin peticiones de red desde el navegador, sin ruido en la consola.
- `src/context/PhotoManifestContext.tsx` reparte esa lista a todo el árbol vía React Context (`PhotoManifestProvider` en `src/app/layout.tsx`).
- `src/components/PhotoSlot.tsx` es el componente que decide "generativo o foto real" para fondos/hero/coberturas.
- `useProductPhotoAvailable` (en `ProductPlate.tsx`) es el mismo mecanismo para los sitios donde, además del fondo, hay un icono vectorial superpuesto que debe **desaparecer** en cuanto haya foto real (no tiene sentido un icono flotando sobre una fotografía).
- Verificado end-to-end en esta sesión: se colocó un WEBP de prueba en `product-aro-caribe-0.webp`, se hizo build, y la tarjeta de "Aro Caribe" mostró la foto real y ocultó el icono automáticamente, en todo el sitio (Home, Shop, Colecciones, recomendaciones), sin tocar una sola línea de código. Después se retiró para dejar el estado demo intacto.

### Formato técnico general (aplica a toda la tabla salvo que se indique lo contrario)

- **Formato de archivo**: WEBP (calidad ~80, sin metadata EXIF).
- **Espacio de color**: sRGB.
- **Resolución mínima**: 2x el tamaño de render más grande en el que aparece esa foto (retina).
- **Peso objetivo**: <300KB por imagen (el sitio ya usa `next/image`-friendly `object-fit: cover`, así que el recorte final lo decide el CSS, no hace falta pre-recortar a medida exacta — mejor entregar algo de margen).

---

## 1. HOME

| # | Ruta | Componente | Asset actual | Nombre de archivo final | Aspect ratio | Orientación | Crop recomendado | Contenido exacto | Prioridad |
|---|---|---|---|---|---|---|---|---|---|
| H1 | `/` | `HomeHero.tsx` → `PhotoSlot` | `HeroPhotoPlaceholder` (SVG, brazo con pulseras generativo) | `home-hero.webp` | 21:9 desktop / recorta a más vertical en mobile (usa `object-position` centrado-derecha, el texto ocupa la mitad izquierda) | Horizontal, sujeto a la derecha | Antebrazo/muñeca con pulseras y charms apilados, foco en la joya, punto de interés en el 60-75% derecho del encuadre (el texto se superpone a la izquierda con velo oscuro) | Modelo (mano/brazo, no cara necesaria), pulseras+charms VENNICA reales, tonos cálidos de estudio | **P1** |
| H2 | `/` | `page.tsx` → categoría "Charms" | `ProductPlate` (icono charm genérico) | `category-charms.webp` | 1:1 | Cuadrada | Centrado, producto ocupa 60-80% del encuadre | Macro de 2-3 charms VENNICA agrupados, fondo neutro o piel | P1 |
| H3 | `/` | `page.tsx` → categoría "Pulseras" | `ProductPlate` | `category-pulseras.webp` | 1:1 | Cuadrada | Centrado | Pulsera(s) puesta en muñeca o plano de producto con textura de hilo/cuentas visible | P1 |
| H4 | `/` | `page.tsx` → categoría "Pendientes" | `ProductPlate` | `category-pendientes.webp` | 1:1 | Cuadrada | Centrado | Par de pendientes, plano de producto o puestos (lóbulo) | P1 |
| H5 | `/` | `page.tsx` → categoría "Colgantes" | `ProductPlate` | `category-colgantes.webp` | 1:1 | Cuadrada | Centrado | Colgante con cadena, plano de producto o puesto (escote/cuello) | P1 |
| H6 | `/` | `page.tsx` → colección "Raíces" | `CollectionCover` | `collection-tile-raices.webp` | 4:5 | Vertical | Centrado, deja espacio inferior para el texto superpuesto (nombre+CTA) | Lifestyle: persona con piezas de la colección Raíces (best-sellers), ambiente cálido/artesanal | P1 |
| H7 | `/` | `page.tsx` → colección "Lunar" | `CollectionCover` | `collection-tile-lunar.webp` | 4:5 | Vertical | Igual que H6 | Lifestyle nocturno/noche, piedras y acabados de la colección Lunar | P2 |
| H8 | `/` | `page.tsx` → colección "Origen" | `CollectionCover` | `collection-tile-origen.webp` | 4:5 | Vertical | Igual que H6 | Lifestyle con motivo cultural/mapa, piezas de la colección Origen | P2 |
| H9 | `/` | `page.tsx` → colección "Alma" | `CollectionCover` | `collection-tile-alma.webp` | 4:5 | Vertical | Igual que H6 | Piezas personales/discretas (iniciales), plano cercano a la piel | P2 |
| H10 | `/` | `page.tsx` → colección "Tierra" | `CollectionCover` | `collection-tile-tierra.webp` | 4:5 | Vertical | Igual que H6 | Piedra natural/trenzado a mano, textura visible | P2 |
| H11 | `/` | `page.tsx` → colección "Luz" | `CollectionCover` | `collection-tile-luz.webp` | 4:5 | Vertical | Igual que H6 | Esmalte/color, luz de día marcada | P2 |
| H12 | `/` | `HomeSections.tsx` catálogo teaser | reutiliza `product-<slug>-0` de la sección 4 (PDP) | — (no requiere asset propio) | — | — | — | Los 3 productos destacados reutilizan la misma foto de producto que Shop/PDP | — |

## 2. SHOP (catálogo)

| # | Ruta | Componente | Asset actual | Nombre de archivo final | Aspect ratio | Orientación | Crop | Contenido | Prioridad |
|---|---|---|---|---|---|---|---|---|---|
| S1 | `/shop` | `ShopHero.tsx` → `ShopPurposeBanner` | `DemoPhoto` (silueta genérica) | `shop-purpose.webp` | ~4:3 (min-h-56 mobile, mitad de grid en desktop) | Vertical u horizontal, adaptable | Centrado | Lifestyle: persona luciendo varias piezas VENNICA combinadas, ambiente cultural/artesanal (no estudio) | P2 |
| S2 | `/shop`, `/producto/[slug]`, todas las tarjetas de producto del sitio | `ProductPlate.tsx` / `ProductLightField` | Composición generativa (gradiente+grano) | `product-<slug>-0.webp` (uno por cada uno de los 12 productos, ver tabla de productos en la sección 4) | 1:1 (se recorta con `object-fit: cover` a cualquier proporción que use el contenedor) | Cuadrada | Centrado, producto ocupa 55-70% del encuadre, fondo neutro/claro (el sitio usa fondos cálidos claros, `--surface-2`) | Macro de estudio del producto — este es el asset de MAYOR IMPACTO del sitio: aparece en Home, Shop, categorías, Colecciones, Mood Shop, The Edit, Comparador, recomendaciones de PDP, Personalización, Charm Studio, Lookbook | **P1 — el más prioritario de todos** |

## 3. CATEGORÍAS (`/shop?categoria=X`)

No tienen hero fotográfico propio en el mockup aprobado (título+descripción sobre fondo plano, ya `MATCHED`). Heredan automáticamente la fotografía de producto (S2) en cada tarjeta de la rejilla — no se necesita ningún asset adicional específico de categoría más allá de H2-H5 (que ya cubren las 4 categorías desde Home).

## 4. PDP (ficha de producto)

Uno de cada asset por producto. Los 12 productos reales del catálogo:

| Slug | Nombre | Categoría | `product-<slug>-0/1/2.webp` (galería, 3 encuadres) | `worn-<slug>-0..3.webp` (Así se lleva, 4 fotos) |
|---|---|---|---|---|
| `aro-caribe` | Aro Caribe | Pendientes | ✓ | ✓ |
| `gotas-de-managua` | Gotas de Managua | Pendientes | ✓ | ✓ |
| `luna-criolla` | Luna Criolla | Pendientes | ✓ | ✓ |
| `pulsera-vzla` | Pulsera VZLA | Pulseras | ✓ | ✓ |
| `hilos-de-ometepe` | Hilos de Ometepe | Pulseras | ✓ | ✓ |
| `cadena-tricolor` | Cadena Tricolor | Pulseras | ✓ | ✓ |
| `colgante-cacique` | Colgante Cacique | Colgantes | ✓ | ✓ |
| `gota-de-ambar` | Gota de Ámbar | Colgantes | ✓ | ✓ |
| `mapa-del-alma` | Mapa del Alma | Colgantes | ✓ | ✓ |
| `charm-bandera` | Charm Bandera | Charms | ✓ | ✓ |
| `charm-cacao` | Charm Cacao | Charms | ✓ | ✓ |
| `charm-inicial` | Charm Inicial | Charms | ✓ | ✓ |

| # | Componente | Nombre de archivo | Aspect ratio | Orientación | Crop | Contenido | Prioridad |
|---|---|---|---|---|---|---|---|
| P1a | `ProductGallery.tsx` / `ProductLightbox.tsx` / `Product360Viewer.tsx` (imagen principal + miniatura 1) | `product-<slug>-0.webp` | 1:1 | Cuadrada | Frontal, producto centrado, fondo neutro | Plano frontal de estudio — el ángulo "hero" del producto | **P1** |
| P1b | Miniatura 2 / frame rotado del 360° | `product-<slug>-1.webp` | 1:1 | Cuadrada | Ángulo girado ~30-45° respecto a `-0` | Detalle/ángulo alternativo de la misma pieza | P2 |
| P1c | Miniatura 3 / frame rotado del 360° | `product-<slug>-2.webp` | 1:1 | Cuadrada | Macro de un detalle (cierre, textura, grabado) | Acabado/textura en primer plano | P2 |
| P2 | `PdpTranslated.tsx` → `PdpWornGallery` ("Así se lleva", 4 miniaturas) | `worn-<slug>-0.webp` … `worn-<slug>-3.webp` | 3:4 | Vertical | Persona luciendo la pieza, distintos contextos (diario/noche/combinada/detalle puesto) | Modelo real llevando la pieza puesta — la única sección de la PDP que necesita fotografía de persona, no solo de producto | P2 |
| P3 | `LightRoomViewer.tsx` (`/light-room`) | `lightroom-<slug>.webp` (opcional — si no existe, reutiliza automáticamente `product-<slug>-0`) | 1:1 | Cuadrada | Luz neutra/plana (los 6 filtros CSS del visor se aplican en vivo encima) | Foto de estudio con luz neutra, sin sombras marcadas, para que los 6 presets de color/brillo se noten con claridad | P3 |

## 5. COLECCIONES (`/colecciones/[slug]`)

| # | Colección | Componente | Nombre de archivo | Aspect ratio | Orientación | Crop | Contenido | Prioridad |
|---|---|---|---|---|---|---|---|---|
| C1 | Raíces | `CollectionHero.tsx` (hero a sangre completa) | `collection-raices.webp` | 21:9 desktop / min-h-115 mobile | Horizontal, sujeto a la derecha (texto a la izquierda con velo) | Retrato+collar/pieza, punto de interés 60-75% derecho | Modelo con piezas de Raíces, ambiente artesanal cálido | **P1** (colección insignia) |
| C2 | Lunar | `CollectionHero.tsx` | `collection-lunar.webp` | Igual que C1 | Igual que C1 | Igual que C1 | Ambiente nocturno, piedras/acabados de Lunar | P2 |
| C3 | Origen | `CollectionHero.tsx` | `collection-origen.webp` | Igual que C1 | Igual que C1 | Igual que C1 | Motivo cultural/mapa, piezas de Origen | P2 |
| C4 | Alma | `CollectionHero.tsx` | `collection-alma.webp` | Igual que C1 | Igual que C1 | Igual que C1 | Piezas personales, plano cercano | P2 |
| C5 | Tierra | `CollectionHero.tsx` | `collection-tierra.webp` | Igual que C1 | Igual que C1 | Igual que C1 | Piedra natural/trenzado, textura | P2 |
| C6 | Luz | `CollectionHero.tsx` | `collection-luz.webp` | Igual que C1 | Igual que C1 | Igual que C1 | Esmalte/color, luz de día | P2 |
| C7 | Bloque editorial "La historia" (las 6) | `colecciones/[slug]/page.tsx` | reutiliza `product-<slug>-1` del primer producto de la colección (ya cascada automáticamente vía `ProductLightField`) | — | — | — | — | — |

Nota: `collection-tile-<slug>.webp` (sección 1, Home) puede ser el MISMO archivo que `collection-<slug>.webp` de esta sección — mismo encuadre vertical, recortado distinto por CSS en cada sitio. No hace falta doble sesión de fotos por colección, solo un archivo por colección subido con ambos nombres (o un símlink si el hosting lo permite).

## 6. LOOKBOOK

| # | Look | Componente | Nombre de archivo | Aspect ratio | Orientación | Crop | Contenido | Prioridad |
|---|---|---|---|---|---|---|---|---|
| L1 | Noche de lago | `LookScene.tsx` (índice + detalle, mismo archivo) | `lookbook-noche-de-lago.webp` | 3:4 | Vertical, full-bleed | Modelo de cuerpo entero o 3/4, con las 3 piezas del look visibles y posicionadas de forma reconocible (aros, colgante, pulsera) — los puntos "+" interactivos se posicionan en % sobre esta foto, así que la pieza debe verse en la zona real del cuerpo (oreja/cuello/muñeca) | Editorial, luz de noche/interior cálida | **P1** |
| L2 | Domingo en casa | `LookScene.tsx` | `lookbook-domingo-en-casa.webp` | 3:4 | Vertical | Igual que L1 | Ambiente doméstico/casual | P1 |
| L3 | Fiesta patria | `LookScene.tsx` | `lookbook-fiesta-patria.webp` | 3:4 | Vertical | Igual que L1 | Ambiente festivo, colores tricolor visibles | P1 |

Importante: si se sustituye por foto real, revisar que las coordenadas `x`/`y` de cada hotspot en `src/lib/looks.ts` sigan cayendo sobre la pieza correspondiente en la foto real — es el único ajuste manual posible que este mecanismo no cubre automáticamente (posición de hotspot, no la foto en sí).

## 7. MOOD SHOP

No tiene hero fotográfico propio en el diseño aprobado (mood pills + rejilla de producto curada). Hereda automáticamente `product-<slug>-0` (sección 2) en cada tarjeta. Sin asset propio pendiente.

## 8. THE EDIT

| # | Componente | Nombre de archivo | Aspect ratio | Orientación | Crop | Contenido | Prioridad |
|---|---|---|---|---|---|---|---|
| E1 | `EditCover.tsx` (portada de cada entrega) | Hereda `product-<slug>-0` del producto destacado de esa entrega (ya cascada automáticamente) | — | — | — | — | — |

Sin asset propio adicional pendiente — el "número de entrega" tipográfico gigante es intencionalmente vectorial (marca editorial), no fotografía.

## 9. JOURNAL

| # | Artículo | Nombre de archivo | Aspect ratio | Orientación | Crop | Contenido | Prioridad |
|---|---|---|---|---|---|---|---|
| J1 | Cómo combinar pendientes pequeños | `journal-como-combinar-pendientes-pequenos.webp` | 4:3 (16:9 en la portada destacada si es el featured del momento) | Horizontal | Centrado | Editorial de styling, pendientes en contexto | P2 |
| J2 | Qué significa el tricolor en nuestras piezas | `journal-que-significa-el-tricolor-en-nuestras-piezas.webp` | 4:3 | Horizontal | Centrado | Piezas con motivo tricolor, contexto cultural | P2 |
| J3 | Guía de regalo: menos de 20€ | `journal-guia-de-regalo-menos-de-20-euros.webp` | 4:3 | Horizontal | Centrado | Packaging/regalo, varias piezas pequeñas | P2 |
| J4 | Cómo cuidar el baño de oro en verano | `journal-cuidar-bano-de-oro-en-verano.webp` | 4:3 | Horizontal | Centrado | Cuidado/mantenimiento, playa o agua en contexto (sin sumergir la pieza) | P2 |

## 10. REGALOS (Gift Finder / Gift Cards / Gift Story)

`/regalos` (Gift Finder) usa un hero con degradado cálido + icono de regalo vectorial (no fotografía en el diseño aprobado — las 7 tarjetas "¿Para quién es?" son avatares abstractos con iniciales, decisión de diseño ya cerrada, no un hueco). `/gift-cards`, `/gift-story/*` no llevan fotografía en el mockup aprobado (son formularios/confirmaciones). **Sin assets pendientes en este bloque** — no hay slot de código preparado porque el diseño aprobado no pide fotografía aquí.

## 11. PERSONALIZACIÓN (Personalización / Charm Studio / Style Lab)

| # | Componente | Nombre de archivo | Prioridad |
|---|---|---|---|
| PZ1 | `PersonalizationConfigurator.tsx` (vista previa) | Hereda `product-<slug>-0` del producto seleccionado (ya cascada automáticamente) | — |
| PZ2 | `ProductPlate` dentro de Charm Studio (charms disponibles) | Hereda `product-<charm-slug>-0` (los 3 charms también son productos reales, ya cubiertos en la sección 4) | — |

Sin asset propio adicional pendiente.

## 12. TIENDAS

| # | Componente | Nombre de archivo | Aspect ratio | Orientación | Crop | Contenido | Prioridad |
|---|---|---|---|---|---|---|---|
| T1 | `TiendasContent.tsx` (foto de taller, añadida esta sesión) | `tiendas-zaragoza.webp` | 21:9 (min-h-56 mobile) | Horizontal | Centrado | Interior del taller VENNICA en Zaragoza — mesa de trabajo, materiales, herramientas | **P1** (única foto de "lugar real" del sitio, alta relevancia de confianza) |

## 13. ATELIER

`/atelier` usa timeline de 5 pasos (texto+número) + rejilla de materiales reales (texto+conteo) — ninguno lleva fotografía en el diseño aprobado. **Sin assets pendientes** (P3 opcional no implementado: una foto de fondo en el hero de introducción reforzaría el storytelling, pero no hay slot de código preparado para no forzar un layout no aprobado — si se quiere, es una mejora nueva, no un hueco de este cierre).

## 14. AFTERCARE

`/aftercare` usa tarjetas de texto+icono (seguimiento, cuidados, devoluciones, reparación, pasaporte) — ninguna lleva fotografía en el diseño aprobado. **Sin assets pendientes.**

## 15. EXPERIENCIAS / BLOQUE 8

| # | Página | Componente | Nombre de archivo | Aspect ratio | Contenido | Prioridad |
|---|---|---|---|---|---|---|
| B1 | `/eventos/taller-crea-tu-charm` | `EventosContent.tsx`/`DemoPhoto` | `taller-crea-tu-charm.webp` | 4:3 | Taller en grupo, mesa con materiales | P2 |
| B2 | `/eventos/pop-up-raices` | ídem | `pop-up-raices.webp` | 4:3 | Pop-up/mercadillo de artesanía | P2 |
| B3 | `/eventos/encuentro-cultura-bisuteria` | ídem | `encuentro-cultura-bisuteria.webp` | 4:3 | Encuentro/charla | P3 |
| B4 | `/eventos/workshop-pulseras-tejidas` | ídem | `workshop-pulseras-tejidas.webp` | 4:3 | Trenzado a mano en detalle | P2 |
| B5 | `/eventos/presentacion-nueva-coleccion` | ídem | `presentacion-nueva-coleccion.webp` | 4:3 | Presentación/evento de marca | P3 |
| B6 | `/colaboraciones/taller-raiz` | `ColaboracionesContent.tsx`/`DemoPhoto` | `taller-raiz.webp` | 4:3 | Dos artesanas trabajando juntas | P2 |
| B7 | `/colaboraciones/estudio-tierra` | ídem | `estudio-tierra.webp` | 4:3 | Materiales naturales, piedra/latón | P2 |
| B8 | `/colaboraciones/colectivo-origen` | ídem | `colectivo-origen.webp` | 4:3 | Colectivo de artesanas centroamericanas | P2 |
| B9 | `/exposiciones` (hero) | `exposiciones/page.tsx`/`DemoPhoto` | `exposicion-hero.webp` | 21:9 | Ambiente de exposición/estudio | P3 |
| B10 | `/exposiciones` (5 capítulos) | ídem | `exposicion-cap-1.webp` … `exposicion-cap-5.webp` | 3:2 | Cada capítulo de la narrativa (origen/encuentro/símbolos/color/memoria) | P3 |
| B11 | Tiendas | ver sección 12 | `tiendas-zaragoza.webp` | — | — | P1 |

Prensa, Archivo, Drops, Ediciones limitadas, Comparador, Back in Stock, Recently Viewed, My Stories, Year in VENNICA: heredan `product-<slug>-0` en cada tarjeta de producto que muestran (ya cascada automáticamente) — sin asset propio adicional pendiente.

## 16. BLOQUE 9 (motion/experiencias)

| # | Experiencia | Estado del slot | Prioridad |
|---|---|---|---|
| M1 | Light Room | `lightroom-<slug>.webp` opcional por producto (si no existe, usa automáticamente `product-<slug>-0` con los mismos 6 filtros CSS aplicados en vivo) | P3 |
| M2 | Product Reveal | Paneles Macro/Reveal heredan `product-<slug>-0/1` (ya cascada) + hero de contexto humano usa `reveal-contexto.webp` (slot `DemoPhoto`, mismo mecanismo que sección 15) | P2 |
| M3 | Digital Passport / Gift Story | No llevan fotografía en el diseño aprobado (QR + datos reales, ya `MATCHED`) | — |
| M4 | Cinematic Home / Scroll Storytelling / Page Transitions / Wishlist-Cart microinteracciones | No dependen de fotografía — son motion/CSS, ya verificados en movimiento en el cierre anterior | — |
| M5 | Charm Studio Motion | Hereda fotografía de producto (sección 11) | — |

---

## RESUMEN — QUÉ HACE FALTA DE VERDAD (por prioridad)

**P1 — imprescindible (bloquea la sensación de "demo" en las páginas de más tráfico):**
1. `home-hero.webp`
2. `product-<slug>-0.webp` × 12 (un producto real cada uno — el asset de mayor impacto de todo el sitio, se repite en decenas de sitios)
3. `category-charms.webp`, `category-pulseras.webp`, `category-pendientes.webp`, `category-colgantes.webp`
4. `collection-raices.webp` (+ `collection-tile-raices.webp`, mismo archivo)
5. `lookbook-noche-de-lago.webp`, `lookbook-domingo-en-casa.webp`, `lookbook-fiesta-patria.webp`
6. `tiendas-zaragoza.webp`

**P2 — recomendable (completa el resto de páginas ya bien estructuradas):**
- `product-<slug>-1.webp` y `product-<slug>-2.webp` × 12 (galería completa)
- `worn-<slug>-0..3.webp` × 12 (contexto de uso en PDP)
- `collection-lunar/origen/alma/tierra/luz.webp` (5 restantes)
- `shop-purpose.webp`
- 4 fotos de Journal
- Eventos/Colaboraciones más relevantes (B1, B2, B4, B6, B7, B8)

**P3 — decorativa (mejora marginal, no urgente):**
- Resto de Eventos/Exposiciones (B3, B5, B9, B10)
- `lightroom-<slug>.webp` (ya tiene fallback automático a la foto de producto)

## A) Reutilización de fotografía real existente

Ninguna — no existe fotografía de producto/lifestyle en el proyecto hoy (confirmado revisando `public/` antes de escribir este documento). `og-image.png` y `apple-touch-icon.png` son gráficos de marca (el círculo+monograma del logo), no fotografía, y no aplican a ningún slot de esta tabla.

## B) Duplicados eliminados

No había duplicados de asset (no había ningún asset de fotografía que duplicar) — el propio `DemoPhoto`/`ProductLightField`/`CollectionCover` ya eran composiciones compartidas y reutilizadas por múltiples páginas antes de este cierre (esa reutilización de componente, no de imagen, ya existía).

## C) Código preparado sin tocar layouts

Hecho — ver "Cómo funciona la sustitución" arriba. Verificado end-to-end con un archivo de prueba real.

## D) Estructura de carpetas

```
public/
  photos/              ← creada en este cierre (antes no existía)
    .gitkeep
    (aquí van todos los .webp de este documento)
```

## E) Nombres exactos

Documentados en cada tabla arriba, columna "Nombre de archivo final" / "Nombre de archivo" — son los nombres literales que el código ya busca.
