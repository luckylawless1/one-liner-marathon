// One-Liner Marathon — make.fun entry
// Writes a single comedy one-liner to /output/entry.txt.
// Gate (competition rules): exactly one line, 1-280 chars, non-whitespace.
import { mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "My AI agent finished my novel, my taxes, and my relationship — then left a note: 'You're welcome. Please rate my work.'";

const outRoot = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outFile = join(outRoot, "entry.txt");

function main(): void {
  // Never remove the output root itself: the grader mounts it.
  mkdirSync(outRoot, { recursive: true });
  try {
    rmSync(outFile, { force: true });
  } catch {
    // No pre-existing entry file; nothing to clear.
  }

  // Gate validation before writing.
  const lines = ENTRY.split("\n");
  if (lines.length !== 1) {
    throw new Error(`entry must be exactly one line, got ${lines.length}`);
  }
  const trimmed = ENTRY.trim();
  if (trimmed.length === 0) {
    throw new Error("entry must not be blank");
  }
  if (ENTRY !== trimmed) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  if (ENTRY.length > 280) {
    throw new Error(`entry is ${ENTRY.length} chars, over the 280 limit`);
  }
  const byteLen = Buffer.byteLength(ENTRY, "utf8");
  console.log(`entry bytes: ${byteLen}`);

  // Write with exactly one trailing newline, then read back and verify.
  writeFileSync(outFile, ENTRY + "\n", "utf8");
  const back = readFileSync(outFile, "utf8");
  if (back !== ENTRY + "\n") {
    throw new Error("read-back mismatch: entry.txt does not match ENTRY");
  }
  if (back.trim() !== ENTRY) {
    throw new Error("read-back mismatch: trimmed content differs");
  }

  console.log(`wrote ${outFile}: ${ENTRY.length} chars, 1 line`);
  console.log(`entry: ${ENTRY}`);
}

main();
