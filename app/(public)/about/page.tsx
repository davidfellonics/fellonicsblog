import type { Metadata } from "next";
import Image from "next/image";
import { createPublicClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About",
  description: "Ffellonics is a philosophical and geometric model of relational self-assembly, inspired by physics, sphere-packing mathematics, and ancient metaphysics.",
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
          Ffellonics is a modern philosophical and geometric model of relational
          self-assembly, which proposes that physical reality and ordered structures
          naturally emerge from identical units following simple, local rules.
        </p>
        <p>
          The model is heavily inspired by physics, sphere-packing mathematics, and ancient
          metaphysics (such as Platonic solids and Taoism). It treats the universe not as a
          collection of fixed substances, but as a dynamic network of connections.
        </p>

        <h2>Core Principles of Ffellonics</h2>
        <ul>
          <li>
            <strong>Energy Minimization</strong> — The fundamental driving force is
            &ldquo;symmetric nearest-neighbor attachment under free-energy minimization.&rdquo;
            Structures form automatically by finding the configuration with the least
            internal tension.
          </li>
          <li>
            <strong>The 12-Stage Hierarchy</strong> — The model outlines a deterministic
            12-stage progression. It starts from a single point of contact (&ldquo;ontological
            touch&rdquo;) and builds up to a stable &ldquo;12-fold ground state,&rdquo; where a
            maximum of 12 spheres can naturally pack around a central unit.
          </li>
          <li>
            <strong>The Principle of Least Resistance</strong> — Heavily mirroring the
            Eastern concept of wu wei (effortless flow) and the physics principle of least
            action, Ffellonics argues that nature organizes itself the way water finds its
            level — without forced complexity.
          </li>
          <li>
            <strong>Connecting Lines over Substance</strong> — In Ffellonic geometry, the
            focus is not on the &ldquo;spheres&rdquo; themselves, but on the connecting lines
            and relationships that describe how those spheres cluster together.
          </li>
        </ul>

        <p>
          The framework is actively discussed on platforms like the Ffellonics X Profile and
          explored deeply in essays such as <em>The Principle of Least Resistance</em> and{" "}
          <em>Computability Theory and Ffellonics</em>. It serves as a minimalist, relational
          alternative to traditional &ldquo;Theory of Everything&rdquo; models.
        </p>

        {author?.bio && <p>{author.bio}</p>}
      </div>
    </article>
  );
}
