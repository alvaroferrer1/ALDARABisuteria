import type { Metadata } from "next";

// El page.tsx de /wishlist es "use client"; el metadata real vive aquí.
export const metadata: Metadata = { title: "Tu wishlist", robots: { index: false, follow: true } };

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
