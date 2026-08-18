import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export const metadata: Metadata = { title: "Restablecer contraseña", robots: { index: false, follow: true } };

export default async function RestablecerPage({ searchParams }: { searchParams: Promise<{ token?: string; email?: string }> }) {
  const { token = "", email = "" } = await searchParams;
  return (
    <section className="mx-auto max-w-md px-4 py-24 sm:px-6">
      <h1 className="font-display text-3xl font-semibold">Elige una nueva contraseña</h1>
      <div className="mt-8">
        <ResetPasswordForm token={token} email={email} />
      </div>
    </section>
  );
}
