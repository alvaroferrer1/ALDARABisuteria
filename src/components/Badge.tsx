const LABELS: Record<string, string> = {
  new: "Novedad",
  bestseller: "Best seller",
  limited: "Edición limitada",
  personalizable: "Personalizable",
};

export function Badge({ type }: { type: string }) {
  const label = LABELS[type] ?? type;
  return (
    <span className="inline-block rounded-full bg-surface-2 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-ink-soft">
      {label}
    </span>
  );
}
