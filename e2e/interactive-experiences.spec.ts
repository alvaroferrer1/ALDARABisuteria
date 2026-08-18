import { test, expect } from "playwright/test";
import path from "node:path";

/**
 * Cierre de 9.4 (Visor 360°) y #28 (Try-On) — MediaDevices no se mockea con
 * cámara real disponible: en CI/local sin hardware, `getUserMedia` no existe
 * o falla, y eso es justo lo que se prueba (fallback automático a "Subir
 * foto", nunca un mensaje de "no disponible").
 */

test.describe("Visor 360° (9.4)", () => {
  test("abrir, cambiar de vista, zoom y restablecer", async ({ page }) => {
    await page.goto("/producto/aro-caribe");
    await page.getByRole("button", { name: "Abrir visor con zoom" }).click();
    await expect(page.getByRole("dialog", { name: /^Visor de/ })).toBeVisible();

    await page.getByRole("button", { name: "360°" }).click();
    const viewer = page.getByRole("application", { name: /Visor 360°/ });
    await expect(viewer).toBeVisible();
    // Espera a que termine la carga simulada
    await expect(page.getByText(/360° DEMO · frame/)).toBeVisible({ timeout: 3000 });

    const before = await page.getByText(/360° DEMO · frame \d+\/24/).textContent();
    await page.getByRole("button", { name: "Girar a la derecha" }).click();
    await page.getByRole("button", { name: "Girar a la derecha" }).click();
    const after = await page.getByText(/360° DEMO · frame \d+\/24/).textContent();
    expect(after).not.toBe(before);

    await page.getByRole("button", { name: "Acercar" }).click();
    await expect(viewer.getByText("125%")).toBeVisible();

    await page.getByRole("button", { name: "Restablecer" }).click();
    await expect(viewer.getByText("100%")).toBeVisible();
  });
});

test.describe("Try-On (#28)", () => {
  test("fallback a subir foto, seleccionar pieza, mover con teclado, reset, ir al PDP", async ({ page }) => {
    // Fuerza el camino de fallback: sin API de cámara en el navegador de prueba.
    await page.addInitScript(() => {
      // @ts-expect-error -- simular navegador sin soporte de cámara
      delete navigator.mediaDevices;
    });

    await page.goto("/try-on");
    await expect(page.getByRole("heading", { name: "Pruébatelo" })).toBeVisible();

    // Nunca debe decir "no disponible": debe ofrecer subir foto directamente.
    await expect(page.getByRole("button", { name: "Usar cámara" })).toBeVisible();
    const fileInput = page.getByTestId("tryon-upload-input");
    await fileInput.setInputFiles(path.join(__dirname, "fixtures", "tryon-sample.png"));

    const overlay = page.getByRole("button", { name: /Mover, escalar o girar la previsualización de/ }).first();
    await expect(overlay).toBeVisible();

    await overlay.focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("+");
    await page.keyboard.press("0"); // reset

    // Cambiar de pieza real desde el selector de productos del Try-On
    const secondProductButton = page.getByTestId("tryon-product-grid").locator("button").nth(1);
    await secondProductButton.click();

    // CTA real al PDP
    await page.getByRole("link", { name: "Ver producto" }).click();
    await expect(page).toHaveURL(/\/producto\//);
  });

  test("alternativa accesible sin cámara ni foto", async ({ page }) => {
    await page.goto("/try-on");
    await expect(page.getByText("¿Prefieres no usar cámara/foto?")).toBeVisible();
    await expect(page.getByRole("link", { name: "su ficha de producto" })).toBeVisible();
  });
});
