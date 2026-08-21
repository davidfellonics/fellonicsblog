import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createPublicClient } from "@/lib/supabase/server";
import type { GlossaryEntry } from "@/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Glossary",
  description: "A glossary of geometric and philosophical terms used in Ffellonics — defined terms spanning coordination number, emergence, symmetry, Platonic solids, FCC/HCP packing, and the thinkers behind them.",
  alternates: { canonical: "/glossary" },
  twitter: { card: "summary_large_image" },
};

function slugify(term: string) {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function GlossaryEntryBlock({ entry }: { entry: GlossaryEntry }) {
  return (
    <div id={slugify(entry.term)} className="border-t border-[#ddd5c8] pt-6 pb-6">
      <h3 className="font-serif text-xl font-semibold text-[#0f2240] mb-3">
        {entry.term}
        {entry.date_range && (
          <span className="text-sm font-sans font-normal text-[#7c6f64] ml-2">{entry.date_range}</span>
        )}
      </h3>
      <div className="font-serif text-[#333] leading-relaxed
        [&_p]:mb-3
        [&_strong]:font-semibold [&_strong]:text-[#0f2240]
        [&_em]:italic
        [&_a]:text-[#b8862a] [&_a]:hover:underline
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1
        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1
        [&_img]:w-full [&_img]:max-w-[480px] [&_img]:mx-auto [&_img]:block [&_img]:mt-6">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.body}</ReactMarkdown>
      </div>
    </div>
  );
}

async function getGlossaryEntries(): Promise<GlossaryEntry[]> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("glossary_entries")
      .select("*")
      .order("term", { ascending: true });
    return (data ?? []) as GlossaryEntry[];
  } catch {
    return [];
  }
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ffell.com";

export default async function GlossaryPage() {
  const entries = await getGlossaryEntries();

  const byLetter: Record<string, GlossaryEntry[]> = {};
  for (const entry of entries) {
    const letter = entry.term[0].toUpperCase();
    if (!byLetter[letter]) byLetter[letter] = [];
    byLetter[letter].push(entry);
  }
  const letters = Object.keys(byLetter).sort();

  const indexEntries = entries.map(e => ({ label: e.term, anchor: slugify(e.term) }));
  const indexByLetter: Record<string, { label: string; anchor: string }[]> = {};
  for (const entry of indexEntries) {
    const letter = entry.label[0].toUpperCase();
    if (!indexByLetter[letter]) indexByLetter[letter] = [];
    indexByLetter[letter].push(entry);
  }
  const indexLetters = Object.keys(indexByLetter).sort();

  return (
    <>
    <article className="max-w-[680px] mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-serif text-4xl sm:text-5xl text-[#0f2240] leading-tight tracking-tight mb-5">
        Glossary
      </h1>
      <div className="w-10 h-[1px] bg-[#b8862a] mb-8" />

      <p className="font-serif italic text-[#7c6f64] mb-8">
        A glossary of people and subjects mentioned in the essays, arranged alphabetically.
      </p>

      <nav className="mb-12 border border-[#ddd5c8] rounded-lg p-5 bg-[#faf8f5]">
        {indexLetters.map(letter => (
          <div key={letter} className="mb-4">
            <div className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#b8862a] mb-1">{letter}</div>
            {indexByLetter[letter].map(entry => (
              <div key={entry.anchor}>
                <a href={`#${entry.anchor}`} className="font-serif text-sm text-[#0f2240] hover:text-[#b8862a] hover:underline transition-colors">
                  {entry.label}
                </a>
              </div>
            ))}
          </div>
        ))}
      </nav>

      <div className="space-y-10">
        {letters.map(letter => (
          <section key={letter}>
            <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">{letter}</h2>
            {byLetter[letter].map(entry => (
              <GlossaryEntryBlock key={entry.id} entry={entry} />
            ))}
          </section>
        ))}
      </div>
    </article>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "DefinedTermSet",
          name: "Ffellonics Glossary",
          description: "A lexicon of geometric and philosophical terms used in Ffellonics, covering sphere packing, emergence, symmetry, and the thinkers behind the framework.",
          url: `${siteUrl}/glossary`,
          author: {
            "@type": "Person",
            name: "David Fell",
            url: `${siteUrl}/about`,
            sameAs: ["https://x.com/ffellonicforms"],
          },
          definedTerm: entries.map(e => ({
            "@type": "DefinedTerm",
            name: e.term,
            description: e.body.replace(/[#*[\]()!]/g, "").trim().slice(0, 300),
            url: `${siteUrl}/glossary#${slugify(e.term)}`,
            inDefinedTermSet: `${siteUrl}/glossary`,
          })),
        }),
      }}
    />
    </>
  );
}
