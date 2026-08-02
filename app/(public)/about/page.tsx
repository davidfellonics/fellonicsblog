import type { Metadata } from "next";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createPublicClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About",
  description: "Ffellonics is a philosophical and geometric model of relational self-assembly, inspired by physics, sphere-packing mathematics, and ancient metaphysics.",
};

async function getAboutContent(): Promise<string> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase.from("pages").select("content").eq("key", "about").single();
    return (data as { content: string } | null)?.content ?? "";
  } catch {
    return "";
  }
}

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
  const [content, author] = await Promise.all([getAboutContent(), getAuthor()]);

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

      <div className="font-serif text-[#1a1614] leading-relaxed space-y-5
        [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[#0f2240] [&_h2]:mt-8 [&_h2]:mb-3
        [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#0f2240] [&_h3]:mt-6 [&_h3]:mb-2
        [&_p]:leading-relaxed
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2
        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2
        [&_li]:leading-relaxed
        [&_strong]:font-semibold [&_strong]:text-[#0f2240]
        [&_em]:italic
        [&_a]:text-[#b8862a] [&_a]:hover:underline
        [&_blockquote]:border-l-2 [&_blockquote]:border-[#b8862a] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#7c6f64]">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
        {author?.bio && <p className="mt-6">{author.bio}</p>}
      </div>
    </article>
  );
}
