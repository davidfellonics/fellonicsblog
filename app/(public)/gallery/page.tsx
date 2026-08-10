import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createPublicClient } from "@/lib/supabase/server";
import type { GalleryItem } from "@/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Gallery",
  description: "A visual gallery of Ffellonics geometric work — original diagrams, models, and mathematical art by David Fell exploring sphere-packing hierarchy and relational form.",
  alternates: { canonical: "/gallery" },
  twitter: { card: "summary_large_image" },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ffell.com";

async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("gallery_items")
      .select("*")
      .order("display_order", { ascending: true });
    return (data ?? []) as GalleryItem[];
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <>
    <article className="mx-4 sm:mx-[100px] py-16">
      <h1 className="font-serif text-4xl sm:text-5xl text-[#0f2240] leading-tight tracking-tight mb-3">
        Gallery
      </h1>
      <div className="w-10 h-[1px] bg-[#b8862a] mb-10" />

      <div className="space-y-20">
        {items.map(item => (
          <div key={item.id} className="border-t border-[#ddd5c8] pt-10">
            <img
              src={item.image_url}
              alt={item.alt_text || item.title}
              className="w-full max-w-[720px] mx-auto block mb-8"
            />
            <div className="max-w-[680px] mx-auto">
              <h2 className="font-serif text-2xl text-[#0f2240] mb-4">{item.title}</h2>
              {item.body && (
                <div className="font-serif text-[#333] leading-relaxed space-y-4
                  [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-1 [&_ul]:pl-2
                  [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-1 [&_ol]:pl-2
                  [&_strong]:font-semibold [&_strong]:text-[#0f2240]
                  [&_em]:italic
                  [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[#0f2240] [&_h2]:mt-6 [&_h2]:mb-2
                  [&_a]:text-[#b8862a] [&_a]:hover:underline">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.body}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </article>
    {items.length > 0 && (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            name: "Ffellonics Gallery",
            url: `${siteUrl}/gallery`,
            author: {
              "@type": "Person",
              name: "David Fell",
              url: `${siteUrl}/about`,
              sameAs: ["https://x.com/ffellonicforms"],
            },
            hasPart: items.map(item => ({
              "@type": "ImageObject",
              name: item.title,
              description: item.body ? item.body.replace(/[#*[\]()]/g, "").trim().slice(0, 200) : item.title,
              contentUrl: item.image_url.startsWith("/") ? `${siteUrl}${item.image_url}` : item.image_url,
              url: `${siteUrl}/gallery`,
              creator: { "@type": "Person", name: "David Fell" },
              copyrightHolder: { "@type": "Person", name: "David Fell" },
            })),
          }),
        }}
      />
    )}
    </>
  );
}
