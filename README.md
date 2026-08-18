<p align="center">
  <img src="public/apple-touch-icon.png" width="72" alt="ALDARA" />
</p>

<h1 align="center">ALDARA</h1>
<p align="center"><em>Bisutería artesanal que une culturas — Puerto Almenara</em></p>

---

ALDARA es una marca de bisutería inventada para este proyecto: piezas hechas a mano, inspiradas en la unión entre Venezuela y Colombia, con un taller ficticio en Puerto Almenara, España. Catálogo, precios, historia de marca y datos de contacto son de ejemplo — pensados para sostenerse como una tienda real de principio a fin, no como una maqueta estática de una sola pantalla.

Este repositorio es privado. Este README explica **qué es** el proyecto y **cómo está construido**, no cómo desplegarlo.

## Qué es esto realmente

Una tienda de bisutería completa en Next.js: catálogo con filtros reales, carrito, favoritos, checkout de demostración, cuentas de usuario con sesión real, colecciones, lookbook shoppable, journal editorial, buscador de regalos, personalización en vivo, Charm Studio, Style Lab, Club de fidelidad, Joyero Digital, Pasaporte de pieza, tarjetas regalo, historias de regalo privadas, y decenas de páginas de soporte (materiales, cuidados, reparaciones, devoluciones, FAQ, legal...).

**~95 experiencias reales navegables**, todas verificadas contra un build de producción real — no solo en modo desarrollo, y no solo "se ve bien en una captura".

## Qué es real y qué es demo

| Área | Estado |
|---|---|
| Catálogo, filtros, buscador, orden | ✅ Real |
| Carrito y favoritos (persistentes) | ✅ Real, guardado en el navegador |
| Cuentas de usuario (registro/login) | ✅ Real y local: hash `scrypt`, sesión firmada HMAC-SHA256. No es un sistema de autenticación de producción (sin verificación de email, sin límite de intentos). |
| Pedidos / checkout | ✅ El pedido se registra de verdad. ❌ No hay pasarela de pago real — no se cobra nada. |
| Formularios (contacto, reparaciones, citas, RSVP...) | ✅ Reales: validan y persisten. ❌ No envían email todavía. |
| Recuperar contraseña | ✅ Flujo real de un solo uso, token con expiración, sin revelar si un email existe. |
| Concierge (chat) | ✅ Real, pero local: motor de reglas propio, sin LLM externo. |
| Try-On / Visor 360° | ✅ Nivel real alcanzable sin AR de verdad (overlay 2D), documentado como tal. |
| Fotografía de producto | 🟡 Parcial: `PhotoSlot` sustituye automáticamente cualquier composición generativa por una foto real en cuanto existe el archivo, sin tocar código. Buena parte del sitio ya tiene foto real; el resto sigue en composición vectorial mientras no haya más material. |
| Pagos, envío de emails | ❌ No conectados — arquitectura lista para enchufarlos. |
| SEO | ✅ Metadata por página, sitemap/robots dinámicos, JSON-LD (`Organization`, `Product`, `FAQPage`, `Article`), Open Graph/Twitter cards. |

## Stack

- **Next.js** (App Router) + **React** + **TypeScript** (`strict`)
- **Tailwind CSS v4** — tokens de marca centralizados, paleta y tipografía propias por tema (claro/oscuro)
- Cero librerías de UI externas: componentes propios, iconografía SVG inline, composiciones generativas propias donde todavía no hay fotografía real
- Persistencia local en JSON como base de datos de desarrollo
- **Playwright** para los flujos críticos end-to-end contra el build de producción real

## Estructura

```text
src/
  app/          # rutas (App Router) — ~95 páginas reales
    api/        # route handlers: auth, orders, contact, gift-cards, gift-story...
  components/   # Header, Footer, formularios, componentes de cada bloque
  context/      # CartContext, WishlistContext (useSyncExternalStore)
  lib/          # catálogo, colecciones, auth, i18n, tipos
public/photos/  # fotografía real activa (se detecta automáticamente si existe)
data/           # JSON generado en tiempo de ejecución
e2e/            # tests Playwright de los flujos críticos
```

## Cómo funciona la fotografía real

`src/components/PhotoSlot.tsx` es el único mecanismo del sitio para sustituir una composición generativa por una foto real sin tocar código: si existe `public/photos/<nombre>.webp` con el nombre exacto que cada componente espera, se muestra automáticamente; si no existe, se ve exactamente igual que antes (nunca una imagen rota). Fotografía incremental, página a página, sin coordinar despliegues.

## Decisiones técnicas relevantes

- **`useSyncExternalStore`, no `useEffect` + `setState`**, para sincronizar carrito/favoritos/tema con `localStorage`.
- **Sin pasarela de pago real de entrada**: el checkout nunca pide número de tarjeta.
- **Honestidad como principio de diseño**: ninguna función se presenta como más real de lo que es. Donde no hay dato real, la página lo dice en vez de inventarlo.
- **i18n real** (ES/EN/FR) en todo el chrome de interfaz con mockup propio.

## Qué queda pendiente, con intención

- Pasarela de pago y envío de emails transaccionales reales.
- Fotografía y vídeo de producto real para el resto del catálogo.
- Base de datos real (`data/*.json` es solo la capa de desarrollo).
