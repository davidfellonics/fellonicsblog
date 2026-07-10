import type { Metadata } from "next";
import { createPublicClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Background",
  description: "A fresh look at the Platonic solids — why the standard definition falls short, and how Ffellonic geometry reframes them as milestones in a 12-level developmental hierarchy.",
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
      </div>
    </article>
  );
}
