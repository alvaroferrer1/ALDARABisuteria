"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AuthForms() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const payload =
      mode === "login"
        ? { email: form.get("email"), password: form.get("password"), remember }
        : { email: form.get("email"), name: form.get("name"), password: form.get("password") };
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ha ocurrido un error.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ha ocurrido un error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-terracotta">{mode === "login" ? "Inicia sesión" : "Crea tu cuenta"}</p>
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">
        {mode === "login" ? (
          <>
            Bienvenida de nuevo <br />a <em className="not-italic text-terracotta">ALDARA</em>
          </>
        ) : (
          <>
            Únete a <em className="not-italic text-terracotta">ALDARA</em>
          </>
        )}
      </h1>
      <p className="mt-3 text-sm text-ink-soft">
        {mode === "login"
          ? "Inicia sesión para seguir tus pedidos, guardar tus favoritos y acceder a tu Joyero Digital."
          : "Crea tu cuenta para guardar tus piezas favoritas y seguir tus pedidos."}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {mode === "register" && (
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink-soft">Nombre</span>
            <input name="name" required maxLength={80} className="rounded-lg border border-line bg-surface px-3.5 py-2.5" />
          </label>
        )}
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink-soft">Correo electrónico</span>
          <input name="email" type="email" required maxLength={120} placeholder="tu@email.com" className="rounded-lg border border-line bg-surface px-3.5 py-2.5" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink-soft">Contraseña</span>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            maxLength={100}
            className="rounded-lg border border-line bg-surface px-3.5 py-2.5"
          />
        </label>

        {mode === "login" && (
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 accent-terracotta" />
              Recuérdame
            </label>
            <Link href="/account/recuperar" className="font-semibold text-terracotta">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        )}

        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="rounded-full bg-ink px-6 py-3 font-semibold text-ivory disabled:opacity-50">
          {loading ? "Un momento..." : mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-soft">
        {mode === "login" ? (
          <>
            ¿Aún no tienes cuenta?{" "}
            <button type="button" onClick={() => setMode("register")} className="font-semibold text-terracotta">
              Crea tu cuenta
            </button>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{" "}
            <button type="button" onClick={() => setMode("login")} className="font-semibold text-terracotta">
              Inicia sesión
            </button>
          </>
        )}
      </p>
      <p className="mt-4 text-center text-xs text-ink-soft">Cuenta de demostración local: tus datos se guardan solo en este servidor de desarrollo.</p>
    </div>
  );
}
