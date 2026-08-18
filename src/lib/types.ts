export type ProductCategory = "pendientes" | "pulseras" | "colgantes" | "charms";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  description: string;
  story: string;
  materials: string;
  care: string;
  badges?: Array<"new" | "bestseller" | "limited" | "personalizable">;
  tint: 0 | 1 | 2;
  icon: "earring" | "bracelet" | "pendant" | "charm";
  stock: number;
}

export interface CartLine {
  productId: string;
  quantity: number;
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  province: string;
  country: string;
  phone: string;
}

export interface GiftCard {
  code: string;
  amount: number;
  balance: number;
  recipientName?: string;
  recipientEmail?: string;
  message?: string;
  buyerEmail: string;
  createdAt: string;
}

export interface DemoOrder {
  id: string;
  createdAt: string;
  items: Array<{ productId: string; name: string; quantity: number; price: number }>;
  total: number;
  address: Address;
  email: string;
  status: "recibido";
  giftCardCode?: string;
  giftCardApplied?: number;
  giftWrap?: boolean;
  giftMessage?: string;
  personalizationNote?: string;
  pointsRedeemed?: number;
  pointsDiscount?: number;
}
