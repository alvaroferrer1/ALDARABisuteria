import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllLooks, getLookBySlug } from "@/lib/looks";
import { LookScene } from "@/components/LookScene";

export function generateStaticParams() {
  return getAllLooks().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/lookbook/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const look = getLookBySlug(slug);
  if (!look) return {};
  return { title: look.title, description: look.description };
}

export default async function LookPage({ params }: PageProps<"/lookbook/[slug]">) {
  const { slug } = await params;
  const look = getLookBySlug(slug);
  if (!look) notFound();

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="mb-8 text-sm text-ink-soft">
        <Link href="/lookbook" className="hover:text-terracotta">
          Lookbook
        </Link>{" "}
        / {look.title}
      </p>
      <LookScene look={look} />
    </section>
  );
}
