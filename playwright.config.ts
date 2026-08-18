import { defineConfig } from "playwright/test";

/**
 * E2E real contra el servidor de producción ya construido (npm run build +
 * npm run start), no un dev server. No arrancamos el servidor desde aquí:
 * el protocolo del proyecto es levantarlo manualmente (ver PROJECT_STATE.md,
 * "protocolo de reinicio de servidor") para evitar servidores zombie.
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
});
