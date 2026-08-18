import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { readSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";
import { readJson } from "@/lib/localDb";
import { NewsletterPreferenceToggle } from "@/components/NewsletterPreferenceToggle";
import { LanguagePreferenceSwitcher } from "@/components/LanguagePreferenceSwitcher";
import { PreferencesChrome } from "@/components/AccountMoreChrome";

export const metadata: Metadata = { title: "Mis preferencias", robots: { index: false, follow: true } };

export default async function PreferencesPage() {
  const cookieStore = await cookies();
  const user = readSessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!user) redirect("/account");

  const subscribers = await readJson<Array<{ email: string }>>("newsletter-subscribers.json", []);
  const subscribed = subscribers.some((s) => s.email.toLowerCase() === user.email.toLowerCase());

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <PreferencesChrome
        newsletterToggle={<NewsletterPreferenceToggle email={user.email} initiallySubscribed={subscribed} />}
        languageSwitcher={<LanguagePreferenceSwitcher />}
      />
    </section>
  );
}
