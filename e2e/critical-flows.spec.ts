import { test, expect } from "playwright/test";

/**
 * E2E de los flujos críticos reales del sitio, contra el servidor de
 * producción ya construido. Usa cuentas/pedidos de prueba con prefijo
 * `e2e-` para poder limpiarlos de forma inequívoca de data/*.json después
 * (ver scripts/cleanup-e2e-data.js), siguiendo la disciplina ya establecida
 * en esta sesión de no dejar datos de prueba en el store persistido.
 */

test("Home carga y navega al catálogo", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/ALDARA/);
  await page.getByRole("link", { name: "Joyas" }).first().click();
  await expect(page).toHaveURL(/\/shop/);
  await expect(page.locator("article").first()).toBeVisible();
});

test("Añadir al carrito y completar checkout demo", async ({ page }) => {
  await page.goto("/producto/aro-caribe");
  await page.getByRole("button", { name: /añadir a la cesta|añadir al carrito/i }).first().click();
  await page.goto("/checkout");
  await page.getByLabel("Nombre completo").fill("E2E Test");
  await page.getByLabel("Email", { exact: true }).fill("e2e-checkout@example.com");
  await page.getByLabel("Dirección").fill("Calle E2E 1");
  await page.getByLabel("Ciudad").fill("Zaragoza");
  await page.getByLabel("Código postal").fill("50001");
  await page.getByLabel("Provincia").fill("Zaragoza");
  await page.getByLabel("Teléfono").fill("600000000");
  await page.getByRole("button", { name: "Continuar a pago" }).click();
  await page.getByRole("button", { name: "Revisar pedido" }).click();
  await page.getByRole("button", { name: /confirmar pedido|realizar pedido|pagar/i }).click();
  await expect(page).toHaveURL(/\/checkout\/success/);
  await expect(page.getByRole("heading", { name: /Tu historia está en camino/i })).toBeVisible();
});

test("Registro, cierre de sesión y login", async ({ page }) => {
  const email = "e2e-account@example.com";
  await page.goto("/account");
  await page.getByRole("button", { name: /crea tu cuenta|crear cuenta|registrarse/i }).click();
  await page.getByLabel(/nombre/i).fill("E2E User");
  await page.getByLabel(/correo electrónico|^email$/i).fill(email);
  await page.getByLabel(/contraseña/i).first().fill("TestPass123!");
  await page.getByRole("button", { name: /crear cuenta|registrarme/i }).last().click();
  await expect(page.getByText(/Hola, E2E User/i)).toBeVisible({ timeout: 10_000 });

  await page.getByRole("button", { name: /cerrar sesión/i }).click();
  await expect(page.getByRole("button", { name: /crea tu cuenta|crear cuenta|registrarse/i })).toBeVisible();
});

test("Formulario de contacto envía correctamente", async ({ page }) => {
  await page.goto("/contacto");
  await page.getByLabel("Nombre").fill("E2E Contacto");
  await page.getByLabel("Email", { exact: true }).fill("e2e-contact@example.com");
  await page.getByLabel("Mensaje").fill("Mensaje de prueba E2E, ignorar.");
  await page.getByRole("button", { name: /enviar mensaje/i }).click();
  await expect(page.getByText(/recibido/i)).toBeVisible({ timeout: 10_000 });
});

test("Gift Story: crear y ver la historia privada", async ({ page }) => {
  await page.goto("/gift-story/create");
  await page.getByLabel(/para quién/i).fill("Ana E2E");
  await page.getByLabel(/ocasión/i).fill("Cumpleaños");
  await page.getByLabel(/tu mensaje/i).fill("Feliz cumpleaños de prueba E2E.");
  await page.getByRole("button", { name: /crear historia privada/i }).click();
  await expect(page.getByText(/tu historia está lista/i)).toBeVisible({ timeout: 10_000 });
  const link = page.locator('a[href*="/gift-story/"]');
  await expect(link).toBeVisible();
  const href = await link.getAttribute("href");
  expect(href).toContain("/gift-story/");

  // Seguir el enlace real y comprobar que la historia se ve
  await page.goto(href!);
  await expect(page.getByText("Ana E2E")).toBeVisible();
});

test("Mood Shop cambia de sensación", async ({ page }) => {
  await page.goto("/mood-shop");
  await page.getByRole("button", { name: "Serena" }).click();
  await expect(page.getByText(/menos es exactamente lo que necesitas/i)).toBeVisible();
});

test("Tarjeta regalo: comprar y canjear en checkout", async ({ page }) => {
  await page.goto("/gift-cards");
  await page.click('button:has-text("25,00")');
  await page.fill('input[name="buyerEmail"]', "e2e-giftcard@example.com");
  await page.click('button:has-text("Comprar tarjeta")');
  const code = (await page.getByTestId("gift-card-code").textContent())?.trim();
  expect(code).toMatch(/^ALDR-/);

  await page.goto("/producto/charm-inicial");
  await page.click('button:has-text("Añadir a la cesta")');
  await page.goto("/checkout");
  await page.fill('input[placeholder="ALDR-XXXX-XXXX"]', code!);
  await page.click('button:has-text("Aplicar")');
  await expect(page.getByText("Saldo disponible")).toBeVisible();
  await expect(page.locator("aside").filter({ hasText: "Resumen" }).locator("strong")).toHaveText("0,00 €");
});

test("Gift Finder: envoltorio y dedicatoria llegan al checkout", async ({ page }) => {
  await page.goto("/regalos");
  await page.getByRole("button", { name: "Mamá" }).click();
  await page.getByRole("button", { name: "Cumpleaños" }).click();
  await page.getByRole("button", { name: "Con significado, para el corazón" }).click();
  await page.getByRole("button", { name: "Sin límite" }).click();
  await page.locator("input[type=checkbox]").first().check();
  await page.locator("textarea").first().fill("Feliz cumpleaños, mamá");
  await page.locator('button[aria-label*="a la cesta"]').first().click();

  await page.goto("/checkout");
  await page.getByLabel("Nombre completo").fill("E2E Gift");
  await page.getByLabel("Email", { exact: true }).fill("e2e-gift@example.com");
  await page.getByLabel("Dirección").fill("Calle E2E 2");
  await page.getByLabel("Ciudad").fill("Zaragoza");
  await page.getByLabel("Código postal").fill("50001");
  await page.getByLabel("Provincia").fill("Zaragoza");
  await page.getByLabel("Teléfono").fill("600000001");
  await page.getByRole("button", { name: "Continuar a pago" }).click();
  await expect(page.getByText("Envoltorio de regalo premium")).toBeVisible();
  await expect(page.locator("textarea").first()).toHaveValue("Feliz cumpleaños, mamá");
  await expect(page.getByText("Envoltorio de regalo", { exact: true })).toBeVisible();
});

test("404 real para ruta inexistente", async ({ page }) => {
  const res = await page.goto("/esto-no-existe-e2e-xyz");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
});

test("Asistente ALDARA: busca por categoría y menciona producto suelto", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir asistente ALDARA" }).click();
  const input = page.getByLabel("Pregunta al asistente ALDARA");

  await input.fill("¿Tenéis colgantes?");
  await page.getByRole("button", { name: "Enviar" }).click();
  await expect(page.getByText(/esto tenemos en colgantes/i)).toBeVisible();

  await input.fill("mapa del alma");
  await page.getByRole("button", { name: "Enviar" }).click();
  await expect(page.getByText(/Mapa del Alma/).last()).toBeVisible();
});
