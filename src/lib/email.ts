import { readJson, writeJson } from "./localDb";

/**
 * Proveedor de email — punto único de salida de todos los correos reales
 * de la web (recuperación de contraseña, tarjeta regalo al destinatario,
 * aviso de "vuelta a stock"...).
 *
 * Antes de esto, cada llamador reimplementaba el mismo bloque
 * "leer demo-emails.json → push → escribir" por su cuenta (auth.ts,
 * /api/gift-cards, /api/admin/restock) — funcionaba, pero conectar un
 * proveedor real habría significado tocar 3+ sitios y arriesgarse a dejar
 * alguno en demo por descuido. Centralizado aquí: hoy `sendEmail` escribe en
 * `data/demo-emails.json` (visible para depurar sin credenciales externas);
 * el día que haya una API key real de un proveedor (Resend, Postmark, SES...),
 * la sustitución completa de la web es cambiar el cuerpo de esta única
 * función — ningún llamador cambia.
 */

export type OutgoingEmail = {
  to: string;
  subject: string;
  body: string;
};

type DemoEmailRecord = OutgoingEmail & { sentAt: string };

const DEMO_EMAILS_FILE = "demo-emails.json";

export async function sendEmail(email: OutgoingEmail): Promise<void> {
  // --- INTEGRACIÓN REAL PENDIENTE ---
  // Cuando exista una clave de un proveedor real, sustituir el cuerpo de
  // esta función por la llamada real, por ejemplo con Resend:
  //
  //   import { Resend } from "resend";
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   await resend.emails.send({
  //     from: "ALDARA <hola@aldara.store>",
  //     to: email.to,
  //     subject: email.subject,
  //     text: email.body,
  //   });
  //
  // y quitar el registro en demo-emails.json (o dejarlo también como log
  // interno, a decidir). Ningún llamador de sendEmail() necesita cambiar.
  if (process.env.RESEND_API_KEY) {
    // Marcador honesto: hoy no hay integración real implementada aunque
    // exista la env var, para no fingir un envío que no ocurre de verdad.
    console.warn("[email] RESEND_API_KEY detectada pero la integración real todavía no está implementada — usando DemoEmailProvider.");
  }

  const demoEmails = await readJson<DemoEmailRecord[]>(DEMO_EMAILS_FILE, []);
  demoEmails.push({ ...email, sentAt: new Date().toISOString() });
  await writeJson(DEMO_EMAILS_FILE, demoEmails);
}

export async function sendEmails(emails: OutgoingEmail[]): Promise<void> {
  if (emails.length === 0) return;
  const demoEmails = await readJson<DemoEmailRecord[]>(DEMO_EMAILS_FILE, []);
  const now = new Date().toISOString();
  for (const email of emails) demoEmails.push({ ...email, sentAt: now });
  await writeJson(DEMO_EMAILS_FILE, demoEmails);
}
