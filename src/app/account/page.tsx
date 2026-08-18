import { cookies } from "next/headers";
import type { Metadata } from "next";
import { readSessionCookieValue, SESSION_COOKIE_NAME, getUsers } from "@/lib/auth";
import { readJson } from "@/lib/localDb";
import { AuthForms } from "@/components/AuthForms";
import { LogoutButton } from "@/components/LogoutButton";
import { AccountGreeting, AccountHub } from "@/components/AccountHub";
import { PhotoSlot } from "@/components/PhotoSlot";
import type { DemoOrder } from "@/lib/types";

export const metadata: Metadata = { title: "Mi cuenta", robots: { index: false, follow: true } };

export default async function AccountPage() {
  const cookieStore = await cookies();
  const user = readSessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  if (!user) {
    return (
      <section className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
        {/* Panel fotográfico — calcado del layout partido del mockup (p.33):
            antes era un formulario centrado solo, sin la composición de dos
            columnas. GENERATED_DEMO, misma técnica que el resto de heroes. */}
        <div className="relative hidden aspect-square overflow-hidden rounded-3xl lg:block">
          <PhotoSlot name="account-auth" alt="" fallback={<LoginPhotoPlaceholder />} />
        </div>
        <AuthForms />
      </section>
    );
  }

  const [orders, users] = await Promise.all([readJson<DemoOrder[]>("orders.json", []), getUsers()]);
  const myOrders = orders.filter((o) => o.email.toLowerCase() === user.email.toLowerCase()).reverse();
  const storedUser = users.find((u) => u.email.toLowerCase() === user.email.toLowerCase());
  const memberSinceISO = storedUser?.createdAt ?? null;

  return (
    <>
      {/* Espacio personal de marca, no dashboard SaaS: cabecera cálida con acento de color, no una barra de widgets */}
      <section className="border-b border-line bg-surface-2 px-4 py-14 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4">
          <AccountGreeting userName={user.name} memberSinceISO={memberSinceISO} />
          <LogoutButton />
        </div>
      </section>

      <AccountHub orders={myOrders} />
    </>
  );
}

function LoginPhotoPlaceholder() {
  return (
    <svg viewBox="0 0 800 800" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="login-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e9dcc5" />
          <stop offset="100%" stopColor="#c9a768" />
        </linearGradient>
        <filter id="login-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.045 0" />
        </filter>
      </defs>
      <rect width="800" height="800" fill="url(#login-bg)" />
      {/* caja de regalo ALDARA, sugiriendo el encuadre del mockup (caja+colgante) */}
      <g transform="translate(400 430)">
        <rect x="-140" y="-90" width="280" height="180" rx="8" fill="#f5ecd9" stroke="#8a6a34" strokeWidth="2" />
        <circle cx="0" cy="-20" r="52" fill="none" stroke="#8a6a34" strokeWidth="2" />
        <text x="0" y="-12" textAnchor="middle" fontFamily="serif" fontSize="18" fill="#8a6a34">ALDARA</text>
        <path d="M-30 40 Q0 90 30 40" fill="none" stroke="#c9a34a" strokeWidth="4" />
        <circle cx="0" cy="90" r="16" fill="#e3c665" />
      </g>
      <rect width="800" height="800" filter="url(#login-grain)" />
    </svg>
  );
}
