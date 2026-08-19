@AGENTS.md

## Disciplina de tokens (instrucción explícita del usuario, siempre activa)

El usuario tiene un límite de tokens de Claude que se agota rápido. En este proyecto:

- Agrupa cambios relacionados en una sola pasada: todos los edits de código primero, luego UN solo `npm run build` + reinicio de servidor + verificación (captura o E2E), no un ciclo completo por cada archivo tocado.
- No repitas capturas de pantalla de la misma página/estado si ya se verificó en esta sesión y no ha cambiado.
- Antes de investigar un bug reportado a ciegas por texto ambiguo, pide una captura o confirma con una pregunta corta en vez de recorrer muchas páginas probando.
- No re-audites páginas ya verificadas como correctas salvo que haya un cambio real en ellas.
- Sé directo en las respuestas: resume en pocas líneas, sin repetir contexto ya conocido.
- **No hacer `git push` sin permiso explícito del usuario en ese mismo turno.** Comitear en local sí, cuando el trabajo esté verificado — pero el `push` a GitHub solo cuando el usuario lo pida literalmente ("sube", "haz push"...).

## Hoja de ruta activa (si el usuario dice "sigue" sin más contexto, continúa por aquí, en este orden)

1. **Fotos**: terminar de meter TODAS las imágenes de `spec/VENNICA_ENTREGA_MAESTRA/ASSETS_IMAGENES` (o `C:\Users\ferris\Downloads\VENNICA_ENTREGA_MAESTRA\ASSETS_IMAGENES`) según `VENNICA_Guia_Maestra_Integracion_Claude.pdf`. No descartar archivos por parecer "mockup" sin comprobar antes si tienen una zona fotográfica recortable. Si un hueco se queda sin foto propia y no hay más material en el ZIP, reutilizar una foto ya usada en otra página antes que dejar el hueco genérico/vacío (nunca se pueden generar fotos nuevas, no hay esa herramienta).
2. **Más contenido en todas las páginas**: revisar cada página en busca de huecos/secciones cortas y rellenarlas con contenido real (no relleno). Incluye comprobar accesos básicos de navegación — ej. enlace a "Mi cuenta"/login visible en el header (ya corregido) y que el registro sea alcanzable desde login.
3. **Rediseño UX/UI página a página**: cada página con jerarquía visual clara, buen contraste texto/imagen, composición cuidada — no solo "sin huecos", sino bien resuelta visualmente.
4. **Analíticas y Backend real** (orden a criterio de Claude si el usuario no precisa): Analíticas = instrumentar visitas/embudo/abandono, local y propio, sin servicio de terceros salvo que el usuario dé cuenta/claves. Backend = pagos (Stripe) y WhatsApp Business, requiere que el usuario aporte claves/cuentas — si no las tiene, priorizar Analíticas primero por no estar bloqueado.
5. **Ciberseguridad**: revisión de superficie expuesta (IDOR, inputs, headers) — al final, antes o después del backend según lo que ya esté tocado.

No preguntar "¿por dónde sigo?" si ya se dijo "sigue" — continuar por el primer punto no cerrado de esta lista.
