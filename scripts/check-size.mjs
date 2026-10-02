/**
 * Build guard: fails the build if any deployed file is over budget.
 *
 * In July 2026 the old portfolio served a 75 MB texture (grain.png) on every
 * home-page visit and burned 402 GB of Vercel bandwidth in four days. This
 * makes sure an oversized file can never be deployed again: shrink it, or
 * raise its budget here on purpose.
 */
import { readdirSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const build = fileURLToPath(new URL("../build", import.meta.url));
const MB = 1024 * 1024;
const BUDGET = {
  ".mp4": 2.5 * MB,
  ".webm": 2.5 * MB,
  ".js": 2.5 * MB,
  ".pdf": 2 * MB,
  ".hdr": 2 * MB,
  default: 1.5 * MB,
};
const TOTAL = 40 * MB;

const files = [];
const walk = (d) =>
  readdirSync(d).forEach((n) => {
    const p = join(d, n);
    statSync(p).isDirectory() ? walk(p) : files.push([p, statSync(p).size]);
  });
walk(build);

const over = files.filter(([p, s]) => s > (BUDGET[extname(p)] ?? BUDGET.default));
const total = files.reduce((t, [, s]) => t + s, 0);
const mb = (s) => `${(s / MB).toFixed(1)} MB`;

if (over.length || total > TOTAL) {
  over.forEach(([p, s]) => console.error(`  ✗ ${relative(build, p)}: ${mb(s)} (budget ${mb(BUDGET[extname(p)] ?? BUDGET.default)})`));
  if (total > TOTAL) console.error(`  ✗ build total ${mb(total)} (budget ${mb(TOTAL)})`);
  console.error("check-size: build is over budget. Compress the files above before deploying.");
  process.exit(1);
}
console.log(`check-size: ${files.length} files, ${mb(total)} total, all within budget`);
