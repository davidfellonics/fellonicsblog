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
        <p className="italic text-[#7c6f64]">Time to take a fresh look at the Platonic solids.</p>

        <p>
          For over two millennia, the Platonic solids have been celebrated as landmarks of
          geometric perfection. Yet the way we define and teach them may be precisely what
          prevents us from understanding what they actually are. Bound by polyhedral rules and
          treated as a closed set of five static forms, they appear complete and exhausted.
          Ffellonic geometry proposes that they are neither — that what we have been admiring
          as endpoints are in fact milestones in a deeper, ongoing geometric process.
        </p>

        <h2>1. Boxed In by Definition</h2>
        <p>
          The standard definition is precise and, in its own terms, correct: a Platonic solid
          is a convex polyhedron with identical regular polygonal faces and the same number of
          faces meeting at every vertex. Count the faces, verify the symmetry, move on.
          Everything considered essential fits on a single page.
        </p>
        <p>
          But that tidiness comes at a cost. The definition says nothing about why the
          icosahedron governs the architecture of virus capsids, or why tetrahedral geometry
          appears in molecular bonding. By reducing these forms to their polyhedral properties,
          we strip away the relational context that gives them their significance in the
          natural world. The definition captures the appearance, not the principle.
        </p>

        <h2>2. Static Objects in a Dynamic Universe</h2>
        <p>
          Traditional geometry presents the Platonic solids as isolated, inert objects —
          defined by shape alone, with no account of growth, transition, or connection to one
          another. Kepler attempted to embed them within a model of planetary orbits; Plato
          linked them to the classical elements. Both were reaching for a dynamic account, but
          neither had the framework to make it precise. The result is that the solids have been
          taught for centuries as separate objects rather than as participants in a living
          system — puzzle pieces that are never assembled.
        </p>

        <h2>3. Counting Five Instead of Understanding Them</h2>
        <p>
          The fixation on there being exactly five Platonic solids draws attention away from
          what is actually interesting about them. Five is a consequence of three-dimensional
          geometry&apos;s constraints — a boundary condition, not a revelation. More instructive
          is their internal structure: the tetrahedron is self-dual; the cube and octahedron
          are duals of each other; the icosahedron and dodecahedron form a third dual pair.
          These relationships point toward a deeper organisational logic — one that the simple
          count of five obscures rather than illuminates.
        </p>
        <p>
          Ffellonic geometry exploits this structure directly, treating the solids as
          coordination milestones within a 12-level developmental hierarchy rather than as five
          separate objects to be enumerated.
        </p>

        <h2>4. A Curriculum That Stops at the Surface</h2>
        <p>
          In most educational settings, the Platonic solids appear briefly — usually as a
          paper-folding exercise — and then disappear. Students construct a tetrahedron or a
          cube without learning that the octahedron is the structural unit of salt crystals, or
          that icosahedral symmetry is ubiquitous in virology. The treatment matches the
          definition: it covers the minimum and calls it complete.
        </p>
        <p>
          Ffellonic geometry offers a more generative pedagogical approach — using
          sphere-packing to show how these forms arise naturally from simple contact rules,
          building geometric intuition from physical principles rather than presenting
          finished shapes to be memorised.
        </p>

        <h2>5. The Unresolved Connection to Nature</h2>
        <p>
          Despite two thousand years of use, we still lack a fully satisfying account of why
          the Platonic solids appear so consistently in the natural world. Kepler&apos;s model
          failed. Plato&apos;s elemental correspondences were poetic rather than mechanistic. Yet
          the forms keep appearing — in crystals, molecular structures, virus capsids, and the
          geometry of foams — without a clear explanation of the underlying cause.
        </p>
        <p>
          Ffellonic geometry provides that explanation not by cataloguing appearances but by
          identifying the mechanism: these forms emerge as stable coordination states within a
          sphere-based hierarchy governed by free-energy minimisation. They appear in nature
          because they are the inevitable geometric outcomes of a single local rule operating
          across scales — not because nature has a preference for particular shapes.
        </p>

        <h2>A Larger Framework</h2>
        <p>
          Ffellonic geometry recasts the Platonic solids as Levels 3, 4, and 5 in a continuous
          12-level progression — from a single contact at Level 1 to the
          tetrahedral-octahedral honeycomb of the FCC/HCP lattice at Level 12. Each level
          represents a stable coordination milestone, arrived at through symmetric
          nearest-neighbour attachment under free-energy minimisation. The solids are not the
          conclusion of this process. They are its most visible early stages.
        </p>

        <h2>Conclusion</h2>
        <p>
          The Platonic solids have earned their reputation. What they have not yet received is
          an adequate framework — one that explains not just what they are geometrically, but
          why they exist, where they come from, and what role they play in the
          self-organisation of matter. Ffellonic geometry provides that framework, moving the
          solids from static definition into dynamic process.
        </p>
        <p>
          After two thousand years, the sheet of paper on which their properties are listed
          remains accurate. What has changed is our understanding of what that sheet of paper
          is actually describing.
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
