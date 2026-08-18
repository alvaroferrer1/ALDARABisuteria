@AGENTS.md

## Disciplina de tokens (instrucción explícita del usuario, siempre activa)

El usuario tiene un límite de tokens de Claude que se agota rápido. En este proyecto:

- Agrupa cambios relacionados en una sola pasada: todos los edits de código primero, luego UN solo `npm run build` + reinicio de servidor + verificación (captura o E2E), no un ciclo completo por cada archivo tocado.
- No repitas capturas de pantalla de la misma página/estado si ya se verificó en esta sesión y no ha cambiado.
- Antes de investigar un bug reportado a ciegas por texto ambiguo, pide una captura o confirma con una pregunta corta en vez de recorrer muchas páginas probando.
- No re-audites páginas ya verificadas como correctas salvo que haya un cambio real en ellas.
- Sé directo en las respuestas: resume en pocas líneas, sin repetir contexto ya conocido.
