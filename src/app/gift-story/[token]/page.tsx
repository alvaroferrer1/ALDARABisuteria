import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { readJson } from "@/lib/localDb";
import type { GiftStory } from "@/lib/giftStory";
import { DeleteGiftStoryButton } from "@/components/DeleteGiftStoryButton";

export const metadata: Metadata = {
  title: "Una historia para ti",
  robots: { index: false, follow: false },
};

export default async function GiftStoryPage({ params }: PageProps<"/gift-story/[token]">) {
  const { token } = await params;
  const stories = await readJson<GiftStory[]>("gift-stories.json", []);
  const story = stories.find((s) => s.token === token);
  if (!story) notFound();

  return (
    <>
      {/* Cabecera calcada de la p.29 del PDF de propuesta: nombre del destinatario a gran escala */}
      <section className="border-b border-line bg-surface-2 px-4 py-16 text-center sm:px-6">
        <p className="mb-2 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-widest text-terracotta">
          <svg viewBox="0 0 24 24" width="14" aria-hidden="true">
            <path
              d="M12 2 3 7v6c0 5 4 8 9 9 5-1 9-4 9-9V7l-9-5Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          Esta es una historia privada — solo para ti
        </p>
        {story.recipientName && (
          <h1 className="font-display text-6xl font-semibold text-terracotta sm:text-7xl">{story.recipientName}</h1>
        )}
        <p className="mx-auto mt-4 max-w-md text-ink-soft">Hay momentos que se convierten en joyas. Este es uno de ellos.</p>
        {(story.place || story.date) && (
          <p className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-ink-soft">
            {story.date && <span>📅 {story.date}</span>}
            {story.place && <span>📍 {story.place}</span>}
          </p>
        )}
      </section>

      <section className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        {story.productName && (
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-terracotta">Tu regalo: {story.productName}</p>
        )}
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink-soft">{story.occasion}</p>
        <p className="whitespace-pre-wrap text-lg leading-relaxed">{story.message}</p>
        <div className="mt-10 border-t border-line pt-4">
          <DeleteGiftStoryButton token={story.token} />
        </div>
      </section>
    </>
  );
}
