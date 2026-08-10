import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";

export const revalidate = 3600; // 1 hour — posts don't change every minute

const siteUrlForMeta = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    absolute: "Ffellonics: The Geometry of Relational Self-Assembly",
  },
  description:
    "Ffellonics is a geometric framework showing how identical spheres in contact produce a precise 12-level hierarchy — from a simple dyad to full FCC/HCP close-packing — that mirrors the structure of nature itself.",
  alternates: {
    canonical: siteUrlForMeta,
  },
  openGraph: {
    title: "Ffellonics: The Geometry of Relational Self-Assembly",
    description:
      "A geometric framework showing how identical spheres in contact produce a precise 12-level hierarchy that mirrors the structure of nature itself.",
    url: siteUrlForMeta,
    type: "website",
    images: [
      {
        url: `${siteUrlForMeta}/api/og?title=Ffellonics%3A%20The%20Geometry%20of%20Relational%20Self-Assembly`,
        width: 1200,
        height: 630,
        alt: "Ffellonics: The Geometry of Relational Self-Assembly",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ffellonics: The Geometry of Relational Self-Assembly",
    description: "A geometric framework showing how identical spheres in contact produce a precise 12-level hierarchy that mirrors the structure of nature itself.",
    images: [`${siteUrlForMeta}/api/og?title=Ffellonics%3A%20The%20Geometry%20of%20Relational%20Self-Assembly`],
  },
};

async function getAuthor(): Promise<Profile | null> {
  try {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .limit(1)
    .single();
  return (data as Profile | null);
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const author = await getAuthor();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <>
      {/* Hero */}
      <section
        className="relative border-b border-[#ddd5c8]"
        style={{
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          backgroundImage: "url('/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0 bg-[#0f2240]/60" aria-hidden="true" />

        {/* Content */}
        <div className="relative mx-4 sm:mx-[100px] py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-white mx-auto mb-6 overflow-hidden ring-2 ring-[#b8862a] ring-offset-4 ring-offset-transparent flex items-center justify-center">
            <Image
              src="/logo-circle.png"
              alt="Ffellonics"
              width={80}
              height={80}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-white leading-tight tracking-tight mb-5">
            Ffellonics
          </h1>
          <div className="w-10 h-[1px] bg-[#b8862a] mx-auto mb-5" />
          <p className="font-serif italic text-white/80 text-lg sm:text-xl max-w-[540px] mx-auto leading-relaxed">
            {author?.bio ?? "A journal of geometric thought — topology, polyhedra, tessellation, and the mathematics of form."}
          </p>
        </div>
      </section>

      {/* Section Cards */}
      <section className="mx-4 sm:mx-[100px] py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              href: "/about",
              title: "About",
              body: "The philosophy and motivation behind Ffellonics — a personal inquiry into geometry as a language of form and thought.",
            },
            {
              href: "/essays",
              title: "Essays",
              body: "Academic essays and personal reflections on topology, polyhedra, tessellation, and the mathematics of form.",
            },
            {
              href: "/glossary",
              title: "Glossary",
              body: "A growing lexicon of geometric and philosophical terms — from emergence and symmetry to Platonic solids and beyond.",
            },
            {
              href: "/gallery",
              title: "Gallery",
              body: "Visual explorations of geometric form: drawings, models, and works that bridge mathematics and art.",
            },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group block border border-[#ddd5c8] bg-white hover:border-[#b8862a] transition-colors duration-200 p-7"
            >
              <h2 className="font-serif text-xl text-[#0f2240] mb-3 group-hover:text-[#b8862a] transition-colors duration-200">
                {card.title}
              </h2>
              <div className="w-6 h-[1px] bg-[#b8862a] mb-4" />
              <p className="font-serif italic text-[#7c6f64] text-sm leading-relaxed">
                {card.body}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* JSON-LD: WebSite + Person */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Ffellonics",
              url: siteUrl,
              description: "A geometric framework showing how identical spheres in contact produce a precise 12-level hierarchy that mirrors the structure of nature itself.",
              author: { "@type": "Person", name: "David Fell" },
            },
            {
              "@context": "https://schema.org",
              "@type": "Person",
              name: "David Fell",
              jobTitle: "Independent Researcher",
              description: "Creator of Ffellonics, a 12-level geometric hierarchy derived from sphere-packing mathematics, developed over more than 15 years.",
              url: `${siteUrl}/about`,
              sameAs: ["https://x.com/ffellonicforms"],
              knowsAbout: [
                "Sphere packing", "FCC/HCP close-packing", "Geometric hierarchy",
                "Emergence", "Relational self-assembly", "Polyhedra", "Topology",
              ],
            },
          ]),
        }}
      />
    </>
  );
}
