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

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
copyFileSync(new URL('./entry.png', import.meta.url), join(outDir, 'entry.png'));
