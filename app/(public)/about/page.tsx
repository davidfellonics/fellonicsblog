import type { Metadata } from "next";
import Image from "next/image";
import { createPublicClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About",
  description: "About Ffellonics — a journal of geometric thought.",
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

export default async function AboutPage() {
  const author = await getAuthor();

  return (
    <article className="max-w-[680px] mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-serif text-4xl sm:text-5xl text-[#0f2240] leading-tight tracking-tight mb-5">
        About
      </h1>
      <div className="w-10 h-[1px] bg-[#b8862a] mb-8" />

      {author?.avatar_url && (
        <Image
          src={author.avatar_url}
          alt={author.full_name}
          width={88}
          height={88}
          className="rounded-full object-cover w-22 h-22 mb-8 ring-2 ring-[#b8862a] ring-offset-4 ring-offset-[#f9f6f2]"
        />
      )}

      <div className="prose prose-lg max-w-none font-serif text-[#1a1614] leading-relaxed space-y-5">
        <p>
          Ffellonics is a journal dedicated to geometry in its many forms — topology,
          tessellation, polyhedra, non-Euclidean geometry, sacred geometry, and mathematical
          art. It exists for readers who find as much wonder in a proof as in a cathedral.
        </p>
        <p>
          {author?.bio ??
            "Each essay aims to take a single geometric idea seriously: tracing its history, its mathematics, and its quiet presence in the structures we build and the patterns we notice."}
        </p>
        <p>
          Alongside the longer academic essays, the journal also publishes shorter personal
          reflections — informal notes on the same questions, written with less rigor and more
          curiosity.
        </p>
      </div>
    </article>
  );
}
