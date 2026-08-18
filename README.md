# ALDARA — bisutería artesanal (demo full-stack)

ALDARA es una marca de bisutería inventada para este proyecto: piezas hechas a mano, inspiradas en la unión entre Venezuela y Colombia, con un taller ficticio en Puerto Almenara, España. Todo el catálogo, los precios, la historia de marca y los datos de contacto son de ejemplo — pensados para sostenerse como una tienda real de principio a fin, no como una maqueta estática.

Este repositorio es privado. Este README explica qué es el proyecto y cómo está construido, no cómo desplegarlo.

## Qué es esto realmente

Una tienda de bisutería completa construida en Next.js: catálogo con filtros reales, carrito, favoritos, checkout de demostración, cuentas de usuario con sesión real, colecciones, lookbook shoppable, journal editorial, buscador de regalos, personalización, Charm Studio, Style Lab, Club de fidelidad, Joyero Digital, Pasaporte de pieza, tarjetas regalo, historias de regalo privadas y decenas de páginas de soporte (materiales, cuidados, reparaciones, devoluciones, FAQ, legal...). No es el prototipo de una sola pantalla — son ~95 experiencias reales navegables, todas verificadas contra un build de producción real, no solo en modo desarrollo.

## Qué es real y qué es demo

| Área | Estado |
|---|---|
| Catálogo, filtros, buscador, orden | ✅ Real |
| Carrito y favoritos (persistentes) | ✅ Real, guardado en el navegador |
| Cuentas de usuario (registro/login) | ✅ Real y local: contraseñas con hash `scrypt`, sesión firmada con HMAC-SHA256, usuarios en `data/users.json`. No es un sistema de autenticación de producción (sin verificación de email, sin límite de intentos). |
| Pedidos / checkout | ✅ El pedido se registra de verdad y aparece en "Mi cuenta". ❌ No hay pasarela de pago real — no se cobra nada. |
| Formularios (contacto, reparaciones, citas, RSVP...) | ✅ Reales: validan y persisten en `data/*.json`. ❌ No envían email todavía. |
| Recuperar contraseña | ✅ Flujo real de un solo uso con token HMAC caducado a 1h, sin revelar si un email existe o no. |
| Concierge (chat) | ✅ Real, pero local: motor de reglas propio sobre el catálogo real, sin LLM externo — nunca finge ser una IA que no es. |
| Try-On / Visor 360° | ✅ Nivel real alcanzable sin cámara/AR de verdad (overlay 2D con cámara o foto subida); documentado como tal, no vendido como AR real. |
| Fotografía de producto | 🟡 Parcial: código preparado (`PhotoSlot`) para sustituir automáticamente cualquier composición generativa por una foto real en cuanto exista el archivo — sin tocar layout ni CSS. Una parte del catálogo ya tiene foto real; el resto sigue en composición vectorial/procedural mientras no haya más material fotográfico. |
| Pagos, envío de emails | ❌ No conectados — arquitectura lista para enchufar un proveedor real. |

## Stack

- **Next.js** (App Router) + **React** + **TypeScript** (`strict`)
- **Tailwind CSS v4** — tokens de marca centralizados en `src/app/globals.css`, con paleta y tipografía propias por tema (claro/oscuro)
- Sin librerías de UI externas: componentes propios, iconografía SVG inline, composiciones generativas propias (gradientes, grano, siluetas) donde todavía no hay fotografía real
- Persistencia local en JSON (`src/lib/localDb.ts`) como base de datos de desarrollo — cero servicios externos necesarios para arrancar
- **Playwright** para los flujos críticos end-to-end contra el build de producción real (no contra el servidor de desarrollo)

## Estructura

```
src/
  app/                  # rutas (App Router) — ~95 páginas reales
    api/                # route handlers: auth, orders, contact, gift-cards, gift-story...
    producto/[slug]/    # ficha de producto (SSG)
    shop/                # catálogo con filtros vía searchParams
    account/             # cuenta, pedidos, joyero digital, pasaporte, club, direcciones...
    colecciones/, lookbook/, journal/, edit/, mood-shop/, shop-the-moment/
    personaliza/, charms-studio/, style-lab/
    legal/, nosotros/, faq/, contacto/, aftercare/
  components/           # Header, Footer, formularios, componentes de cada bloque
  context/              # CartContext, WishlistContext (useSyncExternalStore)
  lib/                  # catálogo, colecciones, auth, i18n, tipos
public/photos/           # fotografía real activa (se detecta automáticamente si existe)
data/                    # JSON generado en tiempo de ejecución (usuarios, pedidos, mensajes...)
e2e/                     # tests Playwright de los flujos críticos
spec/                    # material de referencia del proyecto (PDFs, entregas de assets)
```

## Cómo funciona la fotografía real

`src/components/PhotoSlot.tsx` es el único mecanismo del sitio para sustituir una composición generativa por una foto real sin tocar código: si existe `public/photos/<nombre>.webp` con el nombre exacto que cada componente espera, se muestra automáticamente; si no existe, se ve exactamente igual que antes (nunca una imagen rota). Así se puede ir añadiendo fotografía real de forma incremental, página a página, sin coordinar un despliegue de código cada vez.

## Decisiones técnicas relevantes

- **`useSyncExternalStore`, no `useEffect` + `setState`**, para sincronizar carrito/favoritos/tema con `localStorage` — evita una condición de carrera real (clics perdidos si el usuario interactúa antes de que cargue el `localStorage`).
- **Sin pasarela de pago real de entrada**: el checkout nunca pide número de tarjeta, evitando meter el proyecto en el alcance de PCI-DSS sin necesidad.
- **Honestidad como principio de diseño**: ninguna función se presenta como más real de lo que es. Donde no hay dato real (reseñas, certificados, IA), la página lo dice explícitamente en vez de inventarlo — incluida la fotografía: mientras no exista una foto real, se usa una composición vectorial reconocible como tal, nunca una imagen que pudiera confundirse con fotografía real de producto.
- **i18n real** (ES/EN/FR) en todo el chrome de interfaz con mockup propio, gestionado en `src/lib/i18n/`.

## Qué queda pendiente, con intención

- Pasarela de pago y envío de emails transaccionales reales — arquitectura ya preparada para conectarlos.
- Fotografía y vídeo de producto real para el resto del catálogo.
- Base de datos real (`data/*.json` es solo la capa de desarrollo).
