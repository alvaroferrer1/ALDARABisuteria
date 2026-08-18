import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export const metadata: Metadata = { title: "Recuperar contraseña", robots: { index: false, follow: true } };

/**
 * Flujo de recuperación de contraseña self-service (Master #41). Antes
 * "¿Olvidaste tu contraseña?" enlazaba a /contacto y no había forma real
 * de recuperarla sin escribir a soporte — gap real, cerrado aquí con un
 * DemoEmailProvider (ver lib/auth.ts: el "email" se guarda en
 * data/demo-emails.json en vez de enviarse de verdad).
 */
export default function RecuperarPage() {
  return (
    <section className="mx-auto max-w-md px-4 py-24 sm:px-6">
      <h1 className="font-display text-3xl font-semibold">Recupera tu contraseña</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Escribe tu email y te enviaremos un enlace para restablecerla. Es una demostración local: en vez de un envío de email
        real, el enlace queda guardado en <code>data/demo-emails.json</code> para que puedas probar el flujo completo.
      </p>
      <div className="mt-8">
        <ForgotPasswordForm />
      </div>
    </section>
  );
}
