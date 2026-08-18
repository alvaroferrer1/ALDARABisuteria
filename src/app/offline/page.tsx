import { PhotoSlot } from "@/components/PhotoSlot";

export const metadata = { title: "Sin conexión" };

export default function OfflinePage() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8 aspect-video w-full max-w-md overflow-hidden rounded-3xl">
        <PhotoSlot name="offline" alt="" fallback={<div className="absolute inset-0 bg-surface-2" />} />
      </div>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">Sin conexión</p>
      <h1 className="font-display text-5xl font-semibold sm:text-6xl">Parece que estás sin cobertura</h1>
      <p className="mt-4 max-w-sm text-ink-soft">
        Esta página se guarda para cuando pierdas la conexión. En cuanto vuelvas a tener internet, recarga y todo
        seguirá donde lo dejaste.
      </p>
    </section>
  );
}
