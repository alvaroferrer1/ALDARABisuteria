import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { readSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";
import { PrivacyActions } from "@/components/PrivacyActions";

export const metadata: Metadata = { title: "Privacidad", robots: { index: false, follow: true } };

export default async function PrivacyPage() {
  const cookieStore = await cookies();
  const user = readSessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!user) redirect("/account");

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <Link href="/account" className="mb-6 inline-block text-sm text-ink-soft hover:text-terracotta">
        ← Volver a mi cuenta
      </Link>
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-terracotta">Mi cuenta</p>
      <h1 className="mb-2 font-display text-3xl font-semibold">Privacidad</h1>
      <p className="mb-8 text-sm text-ink-soft">Descarga tus datos o solicita el borrado de tu cuenta.</p>
      <PrivacyActions email={user.email} />
    </section>
  );
}
