"use client";

import { useSyncExternalStore } from "react";
import { themeStore, setTheme } from "@/lib/themeStore";

export function ThemeToggle({ className = "text-ink hover:bg-surface-2" }: { className?: string }) {
  const theme = useSyncExternalStore(themeStore.subscribe, themeStore.getSnapshot, themeStore.getServerSnapshot);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-pressed={isDark}
      className={`flex h-9 w-9 items-center justify-center rounded-full ${className}`}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" width="18" aria-hidden="true">
          <path fill="currentColor" d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 4V2m0 20v-2M4 12H2m20 0h-2M5.6 5.6 4.2 4.2m15.6 15.6-1.4-1.4M5.6 18.4l-1.4 1.4M18.4 5.6l1.4-1.4M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" />
        </svg>
      )}
    </button>
  );
}
