import { randomBytes } from "node:crypto";

export const GIFT_CARD_AMOUNTS = [25, 50, 100] as const;
export const GIFT_WRAP_PRICE = 3;

export function generateGiftCardCode(): string {
  const part = () => randomBytes(2).toString("hex").toUpperCase();
  return `ALDR-${part()}-${part()}`;
}
