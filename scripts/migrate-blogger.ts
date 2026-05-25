import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { XMLParser } from "fast-xml-parser";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const AUTHOR_ID = process.env.MIGRATION_AUTHOR_ID!;
const EXPORT_PATH = path.resolve(__dirname, "data/blogger-export.xml");
const BATCH_SIZE = 10;

if (!SUPABASE_URL || !SUPABASE_KEY || !AUTHOR_ID) {
  console.error("Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, MIGRATION_AUTHOR_ID");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractFirstImage(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ?? null;
}

function makeSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();
}

function makeTagSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function getExcerpt(html: string): string {
  const plain = stripHtml(html);
  if (plain.length <= 160) return plain;
  const trimmed = plain.slice(0, 160);
  const lastSpace = trimmed.lastIndexOf(" ");
  return lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed;
}

function getReadingTime(html: string): number {
  const plain = stripHtml(html);
  const wordCount = plain.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

function getOriginalSlug(alternateLink: string | { href: string } | undefined): string {
  if (!alternateLink) return "";
  const href = typeof alternateLink === "string" ? alternateLink : alternateLink.href;
  if (!href) return "";
  const match = href.match(/\/([^/]+?)(?:\.html)?$/);
  return match?.[1] ? makeSlug(match[1]) : "";
}

interface BloggerEntry {
  title?: string | { "#text": string };
  "content"?: string | { "#text": string };
  published?: string;
  updated?: string;
  link?: Array<{ rel?: string; href?: string }> | { rel?: string; href?: string };
  category?: Array<{ scheme?: string; term?: string }> | { scheme?: string; term?: string };
  "app:control"?: { "app:draft"?: string };
  id?: string;
}

function getTextContent(val: unknown): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object" && val !== null && "#text" in val) return String((val as Record<string, unknown>)["#text"]);
  return "";
}

function isPost(entry: BloggerEntry): boolean {
  const categories = Array.isArray(entry.category)
    ? entry.category
    : entry.category
    ? [entry.category]
    : [];
  return categories.some(
    (c) =>
      c.scheme === "http://schemas.google.com/g/2005#kind" &&
      c.term === "http://schemas.google.com/blogger/2008/kind#post"
  );
}

function isDraft(entry: BloggerEntry): boolean {
  return entry["app:control"]?.["app:draft"] === "yes";
}

function getLabels(entry: BloggerEntry): string[] {
  const categories = Array.isArray(entry.category)
    ? entry.category
    : entry.category
    ? [entry.category]
    : [];
  return categories
    .filter(
      (c) =>
        c.scheme !== "http://schemas.google.com/g/2005#kind" &&
        !c.term?.includes("blogger.com/atom/ns#") &&
        !c.term?.includes("schemas.google.com") &&
        c.term
    )
    .map((c) => c.term!);
}

function getAlternateLink(entry: BloggerEntry): string | undefined {
  const links = Array.isArray(entry.link) ? entry.link : entry.link ? [entry.link] : [];
  return links.find((l) => l.rel === "alternate")?.href;
}

async function upsertTag(name: string): Promise<string | null> {
  const slug = makeTagSlug(name);
  const { data, error } = await supabase
    .from("tags")
    .upsert({ name, slug }, { onConflict: "slug" })
    .select("id")
    .single();
  if (error) { console.error(`  Tag error: ${error.message}`); return null; }
  return data?.id ?? null;
}

async function migrate() {
  if (!fs.existsSync(EXPORT_PATH)) {
    console.error(`Export file not found at: ${EXPORT_PATH}`);
    console.error("Place your Blogger XML export at scripts/data/blogger-export.xml");
    process.exit(1);
  }

  const xml = fs.readFileSync(EXPORT_PATH, "utf-8");
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    isArray: (name) => ["entry", "link", "category"].includes(name),
    parseAttributeValue: false,
  });

  const parsed = parser.parse(xml);
  const feed = parsed.feed;
  const entries: BloggerEntry[] = feed?.entry ?? [];

  const posts = entries.filter((e) => isPost(e) && !isDraft(e));
  console.log(`Found ${posts.length} published posts to migrate.`);

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  // Process in batches
  for (let i = 0; i < posts.length; i += BATCH_SIZE) {
    const batch = posts.slice(i, i + BATCH_SIZE);

    for (const entry of batch) {
      const idx = posts.indexOf(entry) + 1;
      const title = getTextContent(entry.title) || "Untitled";
      const content = getTextContent(entry.content) || "";
      const published = entry.published ?? new Date().toISOString();
      const updated = entry.updated ?? published;
      const labels = getLabels(entry);
      const alternateLink = getAlternateLink(entry);

      let slug = getOriginalSlug(alternateLink) || makeSlug(title);
      if (!slug) slug = `post-${Date.now()}`;

      // Check for duplicate slug
      const { data: existing } = await supabase
        .from("posts")
        .select("id")
        .eq("slug", slug)
        .single();

      if (existing) {
        console.log(`[SKIP] "${title}" — slug already exists`);
        skipped++;
        continue;
      }

      const excerpt = getExcerpt(content);
      const coverImageUrl = extractFirstImage(content);
      const readingTime = getReadingTime(content);

      try {
        const { data: postData, error: postError } = await supabase
          .from("posts")
          .insert({
            title,
            slug,
            content,
            excerpt,
            cover_image_url: coverImageUrl,
            author_id: AUTHOR_ID,
            status: "published",
            published_at: published,
            updated_at: updated,
            reading_time_minutes: readingTime,
            meta_description: excerpt,
          })
          .select("id")
          .single();

        if (postError || !postData) {
          console.error(`[ERROR] "${title}": ${postError?.message}`);
          errors++;
          continue;
        }

        // Handle tags
        for (const label of labels) {
          const tagId = await upsertTag(label);
          if (tagId) {
            await supabase
              .from("post_tags")
              .insert({ post_id: postData.id, tag_id: tagId })
              .then(({ error }) => {
                if (error && !error.message.includes("duplicate")) {
                  console.error(`  Tag link error: ${error.message}`);
                }
              });
          }
        }

        console.log(`[${idx}/${posts.length}] Imported: "${title}"`);
        imported++;
      } catch (err) {
        console.error(`[ERROR] "${title}": ${err}`);
        errors++;
      }
    }
  }

  console.log(`\nMigration complete. ${imported} posts imported. ${skipped} skipped. ${errors} errors.`);
}

migrate().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
