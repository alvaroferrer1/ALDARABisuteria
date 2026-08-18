import { randomBytes } from "node:crypto";

export interface GiftStory {
  token: string;
  recipientName?: string;
  message: string;
  occasion: string;
  place?: string;
  date?: string;
  productName?: string;
  createdAt: string;
}

export function createToken(): string {
  return randomBytes(16).toString("base64url");
}
