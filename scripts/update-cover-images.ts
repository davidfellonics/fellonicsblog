/**
 * Assigns free Wikimedia Commons geometry images to posts that lack a good cover image.
 * Posts with existing Blogger cover images are kept as-is.
 * Posts with null, emoji, or favicon cover images are updated.
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

// All images are PNG/JPG renders from Wikimedia Commons (public domain / CC licensed)
const IMAGES = {
  platonic:      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Platonic_Solids_Transparent.svg/800px-Platonic_Solids_Transparent.svg.png",
  sphere_pack:   "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Close_packing_box.svg/800px-Close_packing_box.svg.png",
  tessellation:  "https://upload.wikimedia.org/wikipedia/commons/6/66/Ceramic_Tile_Tessellations_in_Marrakech.jpg",
  fractal:       "https://upload.wikimedia.org/wikipedia/commons/2/21/Mandel_zoom_00_mandelbrot_set.jpg",
  topology:      "https://upload.wikimedia.org/wikipedia/commons/7/79/M%C3%B6bius_Strip.jpg",
  symmetry:      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/E8Petrie.svg/800px-E8Petrie.svg.png",
  sacred:        "https://upload.wikimedia.org/wikipedia/commons/2/25/Kepler-solar-system-2.png",
  icosahedron:   "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Icosahedron.png/800px-Icosahedron.png",
  dodecahedron:  "https://upload.wikimedia.org/wikipedia/commons/3/33/Dodecahedron.png",
  tetrahedron:   "https://upload.wikimedia.org/wikipedia/commons/3/36/Tetrahedron_%28green%29.png",
  hyperbolic:    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Hyperbolic.svg/800px-Hyperbolic.svg.png",
  penrose:       "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Penrose_Tiling_%28Rhombi%29.svg/800px-Penrose_Tiling_%28Rhombi%29.svg.png",
  non_euclidean: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Noneuclid.svg/800px-Noneuclid.svg.png",
  crystal:       "https://upload.wikimedia.org/wikipedia/commons/6/66/Ceramic_Tile_Tessellations_in_Marrakech.jpg",
  mandelbrot:    "https://upload.wikimedia.org/wikipedia/commons/2/21/Mandel_zoom_00_mandelbrot_set.jpg",
};

// Rotation pool used when no specific keyword matches
const DEFAULT_POOL = [
  IMAGES.sphere_pack,
  IMAGES.platonic,
  IMAGES.icosahedron,
  IMAGES.dodecahedron,
  IMAGES.symmetry,
  IMAGES.penrose,
  IMAGES.hyperbolic,
  IMAGES.non_euclidean,
  IMAGES.tetrahedron,
];

/**
 * Returns true if a cover_image_url looks like a real photo/diagram
 * (i.e. a Blogger CDN image worth keeping).
 */
function isGoodExistingImage(url: string | null): boolean {
  if (!url) return false;
  // Keep blogger CDN images that look like real photos/diagrams
  if (url.includes("blogger.googleusercontent.com") && url.length > 100) return true;
  // Keep any other supabase storage
  if (url.includes("supabase")) return true;
  return false;
}

function pickImage(title: string, slug: string, index: number): string {
  const t = (title + " " + slug).toLowerCase();

  if (/fractal/.test(t)) return IMAGES.fractal;
  if (/mandelbrot|sierpinski/.test(t)) return IMAGES.mandelbrot;
  if (/icosahedron/.test(t)) return IMAGES.icosahedron;
  if (/dodecahedron/.test(t)) return IMAGES.dodecahedron;
  if (/tetrahedron/.test(t)) return IMAGES.tetrahedron;
  if (/topology|entanglement topology|möbius|mobius|torus/.test(t)) return IMAGES.topology;
  if (/sacred geometry/.test(t)) return IMAGES.sacred;
  if (/penrose|aperiodic/.test(t)) return IMAGES.penrose;
  if (/crystal/.test(t)) return IMAGES.crystal;
  if (/tessell|tiling/.test(t)) return IMAGES.tessellation;
  if (/platonic/.test(t)) return IMAGES.platonic;
  if (/lie group|cayley graph|symmetry/.test(t)) return IMAGES.symmetry;
  if (/quantum/.test(t)) return IMAGES.symmetry;           // E8 = quantum/high-symmetry feel
  if (/string theory|f-theory|fermionic/.test(t)) return IMAGES.symmetry;
  if (/sphere|packing|synergetic|buckminster/.test(t)) return IMAGES.sphere_pack;
  if (/hyperbolic|non.euclidean/.test(t)) return IMAGES.hyperbolic;
  if (/thermodynamic|entropy|gibbs|dissipative|ostwald/.test(t)) return IMAGES.hyperbolic;
  if (/spinoza|aristotle|whitehead|leibniz|heraclitus|zeno|philosoph/.test(t)) return IMAGES.penrose;
  if (/consciousness|information theory|wolfram|friston|bayes/.test(t)) return IMAGES.fractal;
  if (/karma|social|virtue|meaning of life/.test(t)) return IMAGES.sacred;
  if (/dna|hox gene|biolog/.test(t)) return IMAGES.sphere_pack;
  if (/emergence|emergent|relational/.test(t)) return IMAGES.sphere_pack;
  if (/hierarchy|hierarchical/.test(t)) return IMAGES.platonic;

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
      console.error(`  ✗ Failed to update "${post.title}":`, updateError.message);
    } else {
      updated++;
      console.log(`  ✓ [${imageUrl.split("/").pop()?.slice(0, 40)}] → ${post.title?.slice(0, 60)}`);
    }
  }

  console.log(`\nDone. ${updated} updated, ${skipped} kept existing image.`);
}

run().catch((err) => { console.error("Fatal:", err); process.exit(1); });
