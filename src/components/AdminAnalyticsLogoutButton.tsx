"use client";

import { useRouter } from "next/navigation";

export function AdminAnalyticsLogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/analytics/logout", { method: "POST" });
        router.refresh();
      }}
      className="text-sm font-semibold text-ink-soft hover:text-terracotta"
    >
      Salir
    </button>
  );
}
