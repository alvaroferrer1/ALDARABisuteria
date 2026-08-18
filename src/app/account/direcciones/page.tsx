import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { readSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";
import { readJson } from "@/lib/localDb";
import { AddressesClient } from "@/components/AddressesClient";
import { AddressesPageHeader } from "@/components/AddressesPageChrome";
import type { Address } from "@/lib/types";

export const metadata: Metadata = { title: "Mis direcciones", robots: { index: false, follow: true } };

interface StoredAddress extends Address {
  id: string;
  email: string;
}

export default async function AddressesPage() {
  const cookieStore = await cookies();
  const user = readSessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!user) redirect("/account");

  const all = await readJson<StoredAddress[]>("addresses.json", []);
  const mine = all.filter((a) => a.email.toLowerCase() === user.email.toLowerCase());

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <AddressesPageHeader />
      <AddressesClient initialAddresses={mine} />
    </section>
  );
}
