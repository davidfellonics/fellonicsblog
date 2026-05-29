/**
 * Resizes large source images in public/geometry/ down to a sensible max
 * (900px wide) so Next.js image optimisation has less work to do.
 * Run: npx tsx --tsconfig scripts/tsconfig.json scripts/resize-images.ts
 */
import * as path from "path";
import * as fs from "fs";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const sharp = require("sharp");

const GEO_DIR = path.resolve(__dirname, "../public/geometry");
const MAX_WIDTH = 900;
const MAX_HEIGHT = 900;

async function run() {
  const files = fs.readdirSync(GEO_DIR).filter(f => /\.(jpg|jpeg|png)$/i.test(f));

  for (const file of files) {
    const filePath = path.join(GEO_DIR, file);
    const img = sharp(filePath);
    const meta = await img.metadata();
    const w = meta.width ?? 0;
    const h = meta.height ?? 0;
    const sizeBefore = fs.statSync(filePath).size;

    if (w <= MAX_WIDTH && h <= MAX_HEIGHT) {
      console.log(`  — ${file}: ${w}×${h} (${(sizeBefore/1024).toFixed(0)}KB) — already small, skipping`);
      continue;
    }

    const outBuf = await img
      .resize(MAX_WIDTH, MAX_HEIGHT, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();

    // Only replace if we actually saved space
    if (outBuf.length < sizeBefore) {
      fs.writeFileSync(filePath.replace(/\.(png|jpeg)$/i, ".jpg"), outBuf);
      if (!filePath.endsWith(".jpg")) fs.unlinkSync(filePath);
      const saved = ((sizeBefore - outBuf.length) / 1024).toFixed(0);
      console.log(`  ✓ ${file}: ${w}×${h} → ≤${MAX_WIDTH}×${MAX_HEIGHT} (saved ${saved}KB)`);
    } else {
      console.log(`  — ${file}: already optimal`);
    }
  }
}

run().catch(console.error);
