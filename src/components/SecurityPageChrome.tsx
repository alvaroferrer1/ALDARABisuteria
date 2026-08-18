"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/localeStore";

export function SecurityPageHeader({ email }: { email: string }) {
  const { t } = useTranslations();
  return (
    <>
      <Link href="/account" className="mb-6 inline-block text-sm text-ink-soft hover:text-terracotta">
        {t.accountAddresses.backToAccount}
      </Link>
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-terracotta">{t.accountAddresses.eyebrow}</p>
      <h1 className="mb-2 font-display text-3xl font-semibold">{t.accountSecurity.title}</h1>
      <p className="mb-8 text-sm text-ink-soft">
        {t.accountSecurity.accountLabel} {email}
      </p>
    </>
  );
}

export function PrivacyLinkCard() {
  return (
    <Link href="/account/privacidad" className="mt-6 block rounded-xl border border-line p-4 text-sm hover:border-ink">
      <span className="font-semibold">Privacidad →</span>
      <span className="block text-ink-soft">Descarga tus datos o solicita eliminar tu cuenta.</span>
    </Link>
  );
}
