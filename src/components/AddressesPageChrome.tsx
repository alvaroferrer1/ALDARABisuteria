"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/localeStore";

export function AddressesPageHeader() {
  const { t } = useTranslations();
  return (
    <>
      <Link href="/account" className="mb-6 inline-block text-sm text-ink-soft hover:text-terracotta">
        {t.accountAddresses.backToAccount}
      </Link>
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-terracotta">{t.accountAddresses.eyebrow}</p>
      <h1 className="mb-8 font-display text-3xl font-semibold">{t.accountAddresses.title}</h1>
    </>
  );
}
