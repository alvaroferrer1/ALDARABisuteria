"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Address } from "@/lib/types";
import { useTranslations } from "@/lib/i18n/localeStore";

interface StoredAddress extends Address {
  id: string;
}

export function AddressesClient({ initialAddresses }: { initialAddresses: StoredAddress[] }) {
  const { t } = useTranslations();
  const FIELDS: Array<{ key: keyof Address; label: string }> = [
    { key: "fullName", label: t.accountAddresses.fullName },
    { key: "street", label: t.accountAddresses.street },
    { key: "city", label: t.accountAddresses.city },
    { key: "postalCode", label: t.accountAddresses.postalCode },
    { key: "province", label: t.accountAddresses.province },
    { key: "country", label: t.accountAddresses.country },
    { key: "phone", label: t.accountAddresses.phone },
  ];
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showForm, setShowForm] = useState(initialAddresses.length === 0);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Ver ContactForm.tsx: capturar el <form> antes del await evita el bug
    // real de "Cannot read properties of null" al llamar .reset() después.
    const formEl = e.currentTarget;
    setStatus("loading");
    setError("");
    const form = new FormData(formEl);
    const payload = Object.fromEntries(FIELDS.map((f) => [f.key, String(form.get(f.key) || "")]));
    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar la dirección.");
      setAddresses((prev) => [...prev, data.address]);
      setShowForm(false);
      formEl.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setStatus("idle");
    }
  }

  async function handleDelete(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/account/addresses?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        {addresses.map((a) => (
          <div key={a.id} className="flex items-start justify-between gap-4 rounded-2xl border border-line p-5">
            <div className="text-sm">
              <p className="font-semibold">{a.fullName}</p>
              <p className="text-ink-soft">{a.street}</p>
              <p className="text-ink-soft">
                {a.postalCode} {a.city}, {a.province}
              </p>
              <p className="text-ink-soft">{a.country}</p>
              <p className="mt-1 text-ink-soft">{a.phone}</p>
            </div>
            <button type="button" onClick={() => handleDelete(a.id)} className="shrink-0 text-sm font-medium text-terracotta hover:underline">
              {t.accountAddresses.delete}
            </button>
          </div>
        ))}
        {addresses.length === 0 && !showForm && <p className="text-ink-soft">{t.accountAddresses.empty}</p>}
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 rounded-2xl bg-surface-2 p-6 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <label key={f.key} className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-ink-soft">{f.label}</span>
              <input name={f.key} required maxLength={120} className="rounded-lg border border-line bg-surface px-3.5 py-2.5" />
            </label>
          ))}
          {error && <p className="sm:col-span-2 text-sm font-semibold text-red-600">{error}</p>}
          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" disabled={status === "loading"} className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory disabled:opacity-50">
              {status === "loading" ? t.accountAddresses.saving : t.accountAddresses.save}
            </button>
            {addresses.length > 0 && (
              <button type="button" onClick={() => setShowForm(false)} className="rounded-full border border-line px-6 py-3 text-sm font-semibold">
                {t.accountAddresses.cancel}
              </button>
            )}
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mt-6 rounded-full border border-line px-6 py-3 text-sm font-semibold hover:border-ink"
        >
          {t.accountAddresses.addAddress}
        </button>
      )}
    </div>
  );
}
