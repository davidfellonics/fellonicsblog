/**
 * Assigns geometry cover images to posts that lack a good cover image.
 * Images are served locally from /public/geometry/ for reliability.
 * Posts with good existing Blogger cover images are kept as-is.
 * Run: npx tsx --tsconfig scripts/tsconfig.json scripts/update-cover-images.ts
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

// All images served from /public/geometry/ (local Next.js static files)
// SVGs go through next/image with dangerouslyAllowSVG: true
const IMAGES = {
  sphere_pack:   "/geometry/sphere_pack.svg",   // hexagonal close packing of circles
  tessellation:  "/geometry/tessellation.svg",  // hexagonal tile tessellation
  fractal:       "/geometry/mandelbrot.jpg",     // Mandelbrot set
  topology:      "/geometry/mobius.jpg",         // Möbius strip (Wikipedia CC)
  symmetry:      "/geometry/symmetry.svg",       // 6-fold snowflake symmetry
  sacred:        "/geometry/kepler.png",         // Kepler solar system model (Wikipedia CC)
  icosahedron:   "/geometry/icosahedron.png",    // Icosahedron (Wikipedia CC)
  dodecahedron:  "/geometry/dodecahedron.png",   // Dodecahedron (Wikipedia CC)
  tetrahedron:   "/geometry/tetrahedron.png",    // Tetrahedron (Wikipedia CC)
  hyperbolic:    "/geometry/hyperbolic.jpg",     // Crochet hyperbolic plane (Wikipedia CC)
  penrose:       "/geometry/penrose.jpg",        // Roger Penrose on Penrose tiling floor (Wikipedia CC)
};

// Rotation pool used when no specific keyword matches
const DEFAULT_POOL = [
  IMAGES.sphere_pack,
  IMAGES.icosahedron,
  IMAGES.tessellation,
  IMAGES.dodecahedron,
  IMAGES.symmetry,
  IMAGES.penrose,
  IMAGES.hyperbolic,
  IMAGES.tetrahedron,
  IMAGES.fractal,
];

/**
 * Returns true if a cover_image_url is a real Blogger photo worth keeping.
 */
function isGoodExistingImage(url: string | null): boolean {
  if (!url) return false;
  // Keep Blogger CDN images (real photos from original posts)
  if (url.includes("blogger.googleusercontent.com") && url.length > 100) return true;
  // Keep Supabase storage images
  if (url.includes("supabase")) return true;
  // Keep previously assigned local geometry images (idempotent)
  if (url.startsWith("/geometry/")) return true;
  return false;
}

function pickImage(title: string, slug: string, index: number): string {
  const t = (title + " " + slug).toLowerCase();

  if (/fractal|mandelbrot|sierpinski/.test(t)) return IMAGES.fractal;
  if (/icosahedron/.test(t)) return IMAGES.icosahedron;
  if (/dodecahedron/.test(t)) return IMAGES.dodecahedron;
  if (/tetrahedron/.test(t)) return IMAGES.tetrahedron;
  if (/topology|entanglement topology|möbius|mobius|torus/.test(t)) return IMAGES.topology;
  if (/sacred geometry/.test(t)) return IMAGES.sacred;
  if (/penrose|aperiodic/.test(t)) return IMAGES.penrose;
  if (/crystal|tessell|tiling/.test(t)) return IMAGES.tessellation;
  if (/platonic/.test(t)) return IMAGES.icosahedron;
  if (/lie group|cayley graph|symmetry/.test(t)) return IMAGES.symmetry;
  if (/quantum/.test(t)) return IMAGES.symmetry;
  if (/string theory|f-theory|fermionic/.test(t)) return IMAGES.symmetry;
  if (/sphere|packing|synergetic|buckminster/.test(t)) return IMAGES.sphere_pack;
  if (/hyperbolic|non.euclidean/.test(t)) return IMAGES.hyperbolic;
  if (/thermodynamic|entropy|gibbs|dissipative|ostwald/.test(t)) return IMAGES.hyperbolic;
  if (/spinoza|aristotle|whitehead|leibniz|heraclitus|zeno|philosoph/.test(t)) return IMAGES.penrose;
  if (/consciousness|information theory|wolfram|friston|bayes/.test(t)) return IMAGES.fractal;
  if (/karma|social virtue|meaning of life/.test(t)) return IMAGES.sacred;
  if (/dna|hox gene|biolog/.test(t)) return IMAGES.sphere_pack;
  if (/emergence|emergent|relational/.test(t)) return IMAGES.sphere_pack;
  if (/hierarchy|hierarchical/.test(t)) return IMAGES.icosahedron;

  // Default: cycle through pool for visual variety
  return DEFAULT_POOL[index % DEFAULT_POOL.length];
}

async function run() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, slug, cover_image_url")
    .eq("status", "published")
    .order("published_at", { ascending: true });

  if (error || !posts) { console.error("Failed to fetch posts:", error); process.exit(1); }

  let updated = 0;
  let skipped = 0;
  let poolIndex = 0;

  for (const post of posts) {
    if (isGoodExistingImage(post.cover_image_url)) {
      skipped++;
      continue;
    }

    const imageUrl = pickImage(post.title ?? "", post.slug ?? "", poolIndex++);
    const { error: updateError } = await supabase
      .from("posts")
      .update({ cover_image_url: imageUrl })
      .eq("id", post.id);

    if (updateError) {
      console.error(`  ✗ Failed: "${post.title}":`, updateError.message);
    } else {
      updated++;
      console.log(`  ✓ [${imageUrl.split("/").pop()}] → ${(post.title ?? "").slice(0, 60)}`);
    }
  }

  console.log(`\nDone. ${updated} updated, ${skipped} kept existing.`);
}

run().catch((err) => { console.error("Fatal:", err); process.exit(1); });
