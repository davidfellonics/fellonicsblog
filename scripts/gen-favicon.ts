/**
 * Generates app/favicon.ico from public/icon.svg using sharp.
 * An ICO file is just an ICO header wrapping one or more PNG blobs.
 * Run: npx tsx --tsconfig scripts/tsconfig.json scripts/gen-favicon.ts
 */
import * as fs from "fs";
import * as path from "path";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const sharp = require("sharp");

const SVG_PATH = path.resolve(__dirname, "../public/icon.svg");
const ICO_PATH = path.resolve(__dirname, "../app/favicon.ico");

async function run() {
  const svgBuffer = fs.readFileSync(SVG_PATH);

  // Render SVG at 32×32 and 16×16 as PNG buffers
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer() as Buffer;
  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer() as Buffer;

  // Build ICO file (ICONDIR + 2 x ICONDIRENTRY + PNG blobs)
  const numImages = 2;
  const headerSize = 6;            // ICONDIR
  const entrySize = 16;            // ICONDIRENTRY per image
  const dataOffset = headerSize + numImages * entrySize;

  const ico = Buffer.alloc(dataOffset + png32.length + png16.length);
  let offset = 0;

  // ICONDIR
  ico.writeUInt16LE(0, offset);          // reserved
  ico.writeUInt16LE(1, offset + 2);      // type: 1 = ICO
  ico.writeUInt16LE(numImages, offset + 4);
  offset += headerSize;

  // ICONDIRENTRY for 32×32
  const off32 = dataOffset;
  ico.writeUInt8(32, offset);            // width
  ico.writeUInt8(32, offset + 1);        // height
  ico.writeUInt8(0, offset + 2);         // color count (0 = no palette)
  ico.writeUInt8(0, offset + 3);         // reserved
  ico.writeUInt16LE(1, offset + 4);      // planes
  ico.writeUInt16LE(32, offset + 6);     // bit count
  ico.writeUInt32LE(png32.length, offset + 8);
  ico.writeUInt32LE(off32, offset + 12);
  offset += entrySize;

  // ICONDIRENTRY for 16×16
  const off16 = dataOffset + png32.length;
  ico.writeUInt8(16, offset);
  ico.writeUInt8(16, offset + 1);
  ico.writeUInt8(0, offset + 2);
  ico.writeUInt8(0, offset + 3);
  ico.writeUInt16LE(1, offset + 4);
  ico.writeUInt16LE(32, offset + 6);
  ico.writeUInt32LE(png16.length, offset + 8);
  ico.writeUInt32LE(off16, offset + 12);
  offset += entrySize;

  // PNG data
  png32.copy(ico, off32);
  png16.copy(ico, off16);

  fs.writeFileSync(ICO_PATH, ico);
  console.log(`✓ Written ${ico.length} bytes → ${ICO_PATH}`);
  console.log(`  32×32 PNG: ${png32.length} bytes`);
  console.log(`  16×16 PNG: ${png16.length} bytes`);
}

run().catch((err: Error) => { console.error("Error:", err.message); process.exit(1); });
