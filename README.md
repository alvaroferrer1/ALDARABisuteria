<p align="center">
  <img src="public/apple-touch-icon.png" width="88" alt="ALDARA" />
</p>

<h1 align="center">ALDARA</h1>
<p align="center"><strong>Bisutería artesanal que une culturas — Puerto Almenara</strong></p>

---

ALDARA es una marca de bisutería inventada para este proyecto: piezas hechas a mano, inspiradas en la unión entre Venezuela y Colombia, con un taller ficticio en Puerto Almenara, España. Todo el catálogo, los precios, la historia de marca y los datos de contacto son de ejemplo — pensados para sostenerse como una tienda real de principio a fin, no como una maqueta estática.

Este repositorio es privado. Este README explica qué es el proyecto y cómo está construido, no cómo desplegarlo.

## La tienda

Un e-commerce de bisutería completo, no un prototipo de una pantalla: catálogo navegable con filtros y buscador reales, carrito y favoritos persistentes, checkout de demostración, cuentas con sesión real, colecciones curadas, lookbook shoppable, journal editorial, buscador de regalos, personalización en vivo, Charm Studio, Style Lab, Club de fidelidad, Joyero Digital, Pasaporte de pieza, tarjetas regalo, historias de regalo privadas, y todo el soporte que espera una clienta real: materiales, cuidados, reparaciones, devoluciones, FAQ, legal.

**~95 experiencias reales navegables**, todas verificadas contra un build de producción — no una demo que solo funciona en una captura de pantalla.

## Qué es real y qué es demo

| Área | Estado |
|---|---|
| Catálogo, filtros, buscador, orden | ✅ Real |
| Carrito y favoritos (persistentes) | ✅ Real, guardado en el navegador |
| Cuentas de usuario (registro/login) | ✅ Real y local: hash `scrypt`, sesión firmada HMAC-SHA256 |
| Pedidos / checkout | ✅ El pedido se registra de verdad. ❌ Sin pasarela de pago real todavía |
| Formularios (contacto, reparaciones, citas...) | ✅ Reales: validan y persisten. ❌ Sin envío de email todavía |
| Recuperar contraseña | ✅ Flujo real de un solo uso, con token de expiración |
| Concierge (chat) | ✅ Real, motor de reglas propio sobre el catálogo real |
| Fotografía de producto | 🟡 Se activa automáticamente en cuanto existe el archivo — buena parte del catálogo ya tiene foto real |
| SEO | ✅ Metadata por página, sitemap/robots dinámicos, JSON-LD, Open Graph |

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

`src/components/PhotoSlot.tsx` sustituye cualquier composición generativa por una foto real en cuanto existe `public/photos/<nombre>.webp` con el nombre exacto — sin tocar código ni layout. Fotografía incremental, página a página, sin coordinar despliegues.

## Próximos pasos

- Pasarela de pago real (Stripe) y envío de emails transaccionales — arquitectura ya preparada para conectarlos.
- Conexión de WhatsApp Business real.
- Fotografía y vídeo de producto real para el resto del catálogo.
- Base de datos real (`data/*.json` es solo la capa de desarrollo).

---

<sub>Contributors: [alvaroferrer1](https://github.com/alvaroferrer1)</sub>
