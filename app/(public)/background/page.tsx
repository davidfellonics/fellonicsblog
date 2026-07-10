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

      <p className="font-serif italic text-[#7c6f64] mb-10">
        A glossary of people and subjects mentioned in the essays, arranged alphabetically.
      </p>

      <div className="space-y-10">

        {/* P */}
        <section>
          <h2 className="font-sans text-xs uppercase tracking-widest text-[#b8862a] mb-4">P</h2>
          <div className="border-t border-[#ddd5c8] pt-6 space-y-2">
            <h3 className="font-serif text-xl text-[#0f2240]">Plato <span className="text-sm font-sans font-normal text-[#7c6f64]">(c. 428–347 BCE)</span></h3>
            <div className="prose prose-lg max-w-none font-serif text-[#1a1614] leading-relaxed space-y-3">
              <p>
                An ancient Greek philosopher widely regarded as one of the most important thinkers
                in Western history. Born into an aristocratic Athenian family, he became a devoted
                student of Socrates and later the teacher of Aristotle.
              </p>
              <p>
                After Socrates&apos; execution, Plato founded the Academy in Athens, the Western
                world&apos;s first known institution of higher learning. Through his famous dialogues,
                he explored justice, beauty, love, and knowledge. His Theory of Forms proposed
                that the visible world is merely a shadow of eternal, perfect ideals.
              </p>
              <p>
                In <em>The Republic</em>, he envisioned an ideal state ruled by philosopher-kings.
                Plato&apos;s profound ideas on reality, ethics, and governance continue to shape
                philosophy, politics, and education more than two millennia later.
              </p>
            </div>
          </div>
        </section>

      </div>
    </article>
  );
}
