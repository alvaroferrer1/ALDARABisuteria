import { money } from "@/lib/storage";

export function Price({ price, compareAtPrice }: { price: number; compareAtPrice?: number }) {
  return (
    <span className="inline-flex items-baseline gap-2">
      <span className="font-semibold text-ink">{money(price)}</span>
      {compareAtPrice ? (
        <span className="text-sm text-ink-soft line-through">{money(compareAtPrice)}</span>
      ) : null}
    </span>
  );
}
