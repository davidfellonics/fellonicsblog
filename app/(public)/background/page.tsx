import type { Metadata } from "next";
import { createPublicClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Background",
  description: "Background and credentials behind Ffellonics.",
};

async function getAuthor(): Promise<Profile | null> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase.from("profiles").select("*").limit(1).single();
    return data as Profile | null;
  } catch {
    return null;
  }
}

export default async function BackgroundPage() {
  const author = await getAuthor();

  return (
    <article className="max-w-[680px] mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-serif text-4xl sm:text-5xl text-[#0f2240] leading-tight tracking-tight mb-5">
        Background
      </h1>
      <div className="w-10 h-[1px] bg-[#b8862a] mb-8" />

      <div className="prose prose-lg max-w-none font-serif text-[#1a1614] leading-relaxed space-y-5">
        <p>
          {author?.full_name ?? "Ffellonics"} writes at the intersection of mathematics,
          history, and design — drawn to the moments where abstract geometry becomes
          something you can see, build, or stand inside.
        </p>
        <p>
          The questions explored here span pure mathematics (topology, non-Euclidean
          geometry) and its applied and cultural echoes (tessellation in art and
          architecture, sacred geometry across traditions, the polyhedra that recur in
          nature and design).
        </p>
        <p>
          This site began as a way to think in public — to work through one idea at a time,
          carefully, without the pressure of a textbook&apos;s completeness or a paper&apos;s formality.
        </p>
        {author?.website_url && (
          <p>
            <a
              href={author.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0f2240] underline underline-offset-2"
            >
              {author.website_url}
            </a>
          </p>
        )}
      </div>
    </article>
  );
}
