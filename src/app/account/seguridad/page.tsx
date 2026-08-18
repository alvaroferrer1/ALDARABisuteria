import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { readSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import { SecurityPageHeader, PrivacyLinkCard } from "@/components/SecurityPageChrome";

export const metadata: Metadata = { title: "Seguridad", robots: { index: false, follow: true } };

export default async function SecurityPage() {
  const cookieStore = await cookies();
  const user = readSessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!user) redirect("/account");

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <SecurityPageHeader email={user.email} />
      <ChangePasswordForm />
      <PrivacyLinkCard />
    </section>
  );
}
