import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { money } from "@/lib/storage";

export function FreeShippingProgress({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const reached = remaining === 0;

  return (
    <div className="mb-5 rounded-xl bg-surface p-3.5">
      <p className="mb-2 text-xs font-medium text-ink-soft">
        {reached ? "Envío gratis conseguido ✓" : `Añade ${money(remaining)} más para envío gratis`}
      </p>
      <div className="h-1.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-terracotta transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
