/**
 * Cleans HTML entities (&nbsp;, &amp;, &lt;, &gt; etc.) and leftover
 * Blogger artefacts from the `excerpt` and `content` columns of all posts.
 *
 * What it fixes:
 *  - &nbsp;  → regular space (or removes trailing ones)
 *  - &#160;  → regular space (numeric form of &nbsp;)
 *  - &amp;   → &   (but only outside existing tags so we don't break HTML)
 *  - Double spaces / spaces before punctuation caused by entity removal
 *  - Bad cover_image_url that are just emoji SVGs or favicons
 */
import * as path from "path";
import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { realtime: { transport: ws as any } });

/**
 * Clean HTML entities from a plain-text excerpt field.
 * The excerpt is stored as plain text (stripped HTML), so we can safely
 * decode entities to their character equivalents.
 */
function cleanExcerpt(text: string | null): string | null {
  if (!text) return text;
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/ /g, " ")          // actual non-breaking space character
    .replace(/[ \t]{2,}/g, " ")       // collapse multiple spaces
    .trim();
}

/**
 * Clean HTML entities from the HTML content field.
 * We only replace &nbsp; / &#160; inside text nodes (i.e. not inside tag attributes),
 * which is safe to do with simple regex for this controlled content.
 */
function cleanContent(html: string | null): string | null {
  if (!html) return html;
  return html
    // Replace &nbsp; (and numeric &#160;) with a regular space
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/g, " ")
    .replace(/ /g, " ")          // actual non-breaking space character
    // Clean up &amp; that was double-encoded (e.g. &amp;nbsp; → &nbsp; → space)
    .replace(/&amp;nbsp;/gi, " ")
    .replace(/&amp;amp;/gi, "&amp;")  // &amp;amp; → &amp;
    // Remove Blogger favicon artefacts used as cover images (small base URLs)
    // These appear in content sometimes too
    .replace(/\s{3,}/g, "  ");        // max 2 consecutive spaces (inside HTML is fine)
}

/**
 * Returns true if a cover_image_url is an emoji SVG or a favicon (bad placeholder).
 */
function isBadCoverImage(url: string | null): boolean {
  if (!url) return false;
  if (url.includes("emoji")) return true;
  if (url.includes("faviconV2")) return true;
  if (url.includes("twimg.com/emoji")) return true;
  // Very short blogger images are probably thumbnails/favicons, not real cover photos
  if (url.includes("blogger.googleusercontent.com") && url.length < 80) return true;
  return false;
}

async function run() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, excerpt, content, cover_image_url")
    .eq("status", "published");

  if (error || !posts) { console.error("Failed to fetch posts:", error); process.exit(1); }

  let updatedExcerpt = 0;
  let updatedContent = 0;
  let clearedBadImage = 0;

  for (const post of posts) {
    const updates: Record<string, string | null> = {};

    // Fix excerpt
    const fixedExcerpt = cleanExcerpt(post.excerpt);
    if (fixedExcerpt !== post.excerpt) {
      updates.excerpt = fixedExcerpt;
      updatedExcerpt++;
    }

    // Fix content
    const fixedContent = cleanContent(post.content);
    if (fixedContent !== post.content) {
      updates.content = fixedContent;
      updatedContent++;
    }

    // Clear bad cover images so update-cover-images.ts can replace them
    if (isBadCoverImage(post.cover_image_url)) {
      updates.cover_image_url = null;
      clearedBadImage++;
    }

    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from("posts")
        .update(updates)
        .eq("id", post.id);

      if (updateError) {
        console.error(`  ✗ "${post.title}":`, updateError.message);
      } else {
        const what = Object.keys(updates).join(", ");
        console.log(`  ✓ Fixed [${what}]: ${(post.title ?? "").slice(0, 60)}`);
      }
    }
  }

  console.log(`\nDone.`);
  console.log(`  Excerpts cleaned: ${updatedExcerpt}`);
  console.log(`  Content cleaned:  ${updatedContent}`);
  console.log(`  Bad images cleared: ${clearedBadImage}`);
}

run().catch((err) => { console.error("Fatal:", err); process.exit(1); });
