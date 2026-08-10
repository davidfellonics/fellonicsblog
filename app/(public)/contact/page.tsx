import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ffell.com";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Ffellonics — questions, corrections, or ideas for a future essay welcome. Email ffellonicforms@gmail.com or find us on X at @ffellonicforms.",
  alternates: { canonical: "/contact" },
  twitter: { card: "summary_large_image" },
};

export default function ContactPage() {
  return (
    <>
      <article className="max-w-[680px] mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-serif text-4xl sm:text-5xl text-[#0f2240] leading-tight tracking-tight mb-5">
          Contact
        </h1>
        <div className="w-10 h-[1px] bg-[#b8862a] mb-8" />

        <div className="prose prose-lg max-w-none font-serif text-[#1a1614] leading-relaxed space-y-5">
          <p>
            Questions, corrections, or ideas for a future essay — all welcome. The best way to
            reach the journal is by email:
          </p>
          <p>
            <a
              href="mailto:ffellonicforms@gmail.com"
              className="text-[#0f2240] underline underline-offset-2 font-sans not-italic"
            >
              ffellonicforms@gmail.com
            </a>
          </p>
          <p>
            You can also follow and message on X:{" "}
            <a
              href="https://x.com/ffellonicforms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0f2240] underline underline-offset-2 font-sans not-italic"
            >
              @ffellonicforms
            </a>
          </p>
        </div>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            url: `${siteUrl}/contact`,
            name: "Contact — Ffellonics",
            mainEntity: {
              "@type": "Organization",
              name: "Ffellonics",
              email: "ffellonicforms@gmail.com",
              url: siteUrl,
              sameAs: ["https://x.com/ffellonicforms"],
              contactPoint: {
                "@type": "ContactPoint",
                email: "ffellonicforms@gmail.com",
                contactType: "editorial",
              },
            },
          }),
        }}
      />
    </>
  );
}
