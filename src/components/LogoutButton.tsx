"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "@/lib/i18n/localeStore";

export function LogoutButton() {
  const router = useRouter();
  const { t } = useTranslations();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.refresh();
      }}
      className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold hover:border-ink"
    >
      {t.common.logout}
    </button>
  );
}
