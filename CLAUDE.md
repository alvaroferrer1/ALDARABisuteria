@AGENTS.md

## Disciplina de tokens (instrucción explícita del usuario, siempre activa)

El usuario tiene un límite de tokens de Claude que se agota rápido. En este proyecto:

- Agrupa cambios relacionados en una sola pasada: todos los edits de código primero, luego UN solo `npm run build` + reinicio de servidor + verificación (captura o E2E), no un ciclo completo por cada archivo tocado.
- No repitas capturas de pantalla de la misma página/estado si ya se verificó en esta sesión y no ha cambiado.
- Antes de investigar un bug reportado a ciegas por texto ambiguo, pide una captura o confirma con una pregunta corta en vez de recorrer muchas páginas probando.
- No re-audites páginas ya verificadas como correctas salvo que haya un cambio real en ellas.
- Sé directo en las respuestas: resume en pocas líneas, sin repetir contexto ya conocido.

## Hoja de ruta activa (si el usuario dice "sigue" sin más contexto, continúa por aquí, en este orden)

1. **Fotos**: terminar de meter TODAS las imágenes de `spec/VENNICA_ENTREGA_MAESTRA/ASSETS_IMAGENES` (o `C:\Users\ferris\Downloads\VENNICA_ENTREGA_MAESTRA\ASSETS_IMAGENES`) según `VENNICA_Guia_Maestra_Integracion_Claude.pdf`. Instrucción explícita del usuario: no descartar archivos por parecer "mockup" sin comprobar antes si tienen una zona fotográfica recortable — recortar agresivamente antes de descartar.
2. **Rediseño UX/UI página a página**: una vez las fotos estén, repasar cada página añadiendo contenido/secciones que falten y mejorando el diseño de lo que ya existe (jerarquía visual, contraste texto/imagen, composición) — no solo huecos vacíos rellenados, sino la página bien resuelta.
3. **Analíticas**: instrumentar visitas, embudo de compra, puntos de abandono (local/propio, sin servicio de terceros salvo que el usuario dé cuenta/claves).
4. **Ciberseguridad**: revisión de superficie expuesta (IDOR, inputs, headers) antes de tocar el backend real.
5. **Backend real**: pagos (Stripe) y WhatsApp Business — requiere que el usuario aporte claves/cuentas.

No preguntar "¿por dónde sigo?" si ya se dijo "sigue" — continuar por el primer punto no cerrado de esta lista.
