// news-image-20261123 entry (Node 22, standard library only).
// The image is the entry.png beside this file: a front-page newspaper
// summing up the world's news of Monday 23 November 2026
// (burning tankers in the Strait of Hormuz, COP31 ending with no deal,
// Russian missiles entering Poland, the Democrats' big House win).
// The program copies it to /output/entry.png, byte for byte, so the
// judge sees exactly those bytes. No network, no randomness, no clock:
// two runs write the same bytes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const src = new URL('./entry.png', import.meta.url);

// Validate the source image before copying anything: it must exist,
// be a real PNG, and stay under the 1 MiB / 1024x1024 gates.
let png;
try {
  png = readFileSync(src);
} catch {
  console.error('entry.png is missing next to main.ts');
  process.exit(1);
}
const magic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!png.subarray(0, 8).equals(magic)) {
  console.error('entry.png is not a PNG file');
  process.exit(1);
}
if (png.length > 1_048_576) {
  console.error(`entry.png is ${png.length} bytes, over the 1 MiB limit`);
  process.exit(1);
}
const width = png.readUInt32BE(16);
const height = png.readUInt32BE(20);
if (width > 1024 || height > 1024) {
  console.error(`entry.png is ${width}x${height}, over the 1024x1024 limit`);
  process.exit(1);
}
// A valid PNG always ends with the 12-byte IEND trailer; a file that
// does not is truncated or corrupted, even if its header looks fine.
const iend = Buffer.from([0, 0, 0, 0, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82]);
if (!png.subarray(-12).equals(iend)) {
  console.error('entry.png is truncated or corrupted (no IEND trailer)');
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'entry.png');
copyFileSync(src, outPath);

// Verify the copy: the bytes written must match the source exactly,
// otherwise the judge would see a different image than the one built.
const digest = (buf) => createHash('sha256').update(buf).digest('hex');
if (digest(readFileSync(outPath)) !== digest(png)) {
  console.error('output entry.png does not match the source image');
  process.exit(1);
}
