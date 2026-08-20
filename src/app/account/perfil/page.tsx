import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { readSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";
import { ProfileForm } from "@/components/ProfileForm";

export const metadata: Metadata = { title: "Mi perfil", robots: { index: false, follow: true } };

/**
 * Bug real corregido: no existía ninguna página para editar el nombre de la
 * cuenta después de registrarse — "Mi cuenta" solo dejaba VER datos, nunca
 * cambiar el nombre. Sigue el mismo patrón de seguridad que el resto de
 * páginas de cuenta: identidad siempre resuelta desde la sesión firmada.
 */
export default async function ProfilePage() {
  const cookieStore = await cookies();
  const user = readSessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!user) redirect("/account");

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <Link href="/account" className="mb-6 inline-block text-sm text-ink-soft hover:text-terracotta">
        ← Mi cuenta
      </Link>
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-terracotta">Mi cuenta</p>
      <h1 className="mb-8 font-display text-3xl font-semibold">Mi perfil</h1>

      <ProfileForm initialName={user.name} email={user.email} />

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link href="/account/seguridad" className="rounded-xl border border-line p-4 text-sm hover:border-ink">
          <span className="font-semibold">Seguridad →</span>
          <span className="block text-ink-soft">Cambia tu contraseña.</span>
        </Link>
        <Link href="/account/privacidad" className="rounded-xl border border-line p-4 text-sm hover:border-ink">
          <span className="font-semibold">Privacidad →</span>
          <span className="block text-ink-soft">Descarga tus datos o solicita eliminar tu cuenta.</span>
        </Link>
      </div>
    </section>
  );
}
