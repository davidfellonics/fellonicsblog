import { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let posts: { slug: string; updated_at: string }[] = [];

  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("posts")
      .select("slug, updated_at")
      .eq("status", "published");
    posts = (data ?? []) as { slug: string; updated_at: string }[];
  } catch {
    // No database connection during build
  }

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    { url: siteUrl,                   lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${siteUrl}/about`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/essays`,       lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${siteUrl}/levels`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/glossary`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/gallery`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`,      lastModified: new Date(), changeFrequency: "yearly",  priority: 0.4 },
  ];

  return [...staticUrls, ...postUrls];
}
