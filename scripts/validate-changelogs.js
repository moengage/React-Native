#!/usr/bin/env node
/**
 * Validates the pending-release block of each sdk module CHANGELOG against
 * what the release automation actually parses
 * (sdk-automation-scripts: scripts/hybrid/npm-release.main.kts +
 * scripts/common/utils.main.kts).
 *
 * The rules this enforces — getting them wrong does NOT fail the release, it
 * silently skips or mangles it:
 *
 * 1. Pending entries are ONLY read from lines after a line containing the
 *    literal text "Release Version", stopping at the next `#` header. Tagged
 *    entries without the `# Release Date` / `## Release Version` header block
 *    are invisible → release type "NA" → the module is SILENTLY SKIPPED.
 * 2. Entry format is `- [minor] Text` (or nested `  - [patch] Text` under a
 *    platform bullet like `- iOS`). The release strips the literal " [minor]",
 *    so a colon after the tag (`- [minor] : Text`) survives as `- : Text`.
 * 3. Valid tags: major, minor, patch, NA (case-sensitive). Anything else in
 *    brackets contributes nothing toward the release type.
 *
 * Usage: node scripts/validate-changelogs.js [changelog files...]
 * Defaults to every sdk/<module>/CHANGELOG.md.
 */
const fs = require('fs');
const path = require('path');

const VALID_TAGS = ['major', 'minor', 'patch', 'NA'];
const TAG_RE = /\[([^\]]*)\]/;
// Mirrors utils.main.kts: specialChangelogLine ("bugfix") after lowercasing
// and stripping "-" / ":".
const SPECIAL_LINES = ['bugfix'];
// Platform grouping bullets, allowed untagged (ignored by the type parser).
const PLATFORM_LINE_RE = /^-\s+(iOS|Android|Web)\s*$/i;

const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['core', 'cards', 'geofence', 'inbox', 'personalize'].map(m =>
      path.join('sdk', m, 'CHANGELOG.md')
    );

let failed = false;
const fail = (file, msg) => {
  failed = true;
  console.error(`✗ ${file}: ${msg}`);
};

for (const file of files) {
  if (!fs.existsSync(file)) {
    fail(file, 'file not found');
    continue;
  }
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const nonBlank = lines.map(l => l.trimEnd()).filter(l => l.trim() !== '');

  const isHeader = l => l.trim().startsWith('#');
  const hasReleaseVersionHeader = nonBlank.some(
    l => isHeader(l) && l.includes('Release Version')
  );

  // --- Case A: no pending block. The file must start with a released
  // (dated) header; tagged entry lines before any header would be invisible
  // to the release scripts — the silent-skip trap.
  if (!hasReleaseVersionHeader) {
    const firstHeaderIdx = nonBlank.findIndex(isHeader);
    const preHeader = firstHeaderIdx === -1 ? nonBlank : nonBlank.slice(0, firstHeaderIdx);
    if (preHeader.length > 0) {
      fail(
        file,
        `${preHeader.length} line(s) appear before any header without a ` +
          '"# Release Date / ## Release Version" block — the release scripts ' +
          'cannot see them and will SKIP this module. See RELEASING.md.'
      );
    }
    continue; // nothing pending — released history is not validated
  }

  // --- Case B: pending block present. Validate its shape.
  if (!nonBlank[0].includes('Release Date') || !isHeader(nonBlank[0])) {
    fail(file, 'pending block must start with "# Release Date" as the first content line');
  }
  if (!(nonBlank[1] || '').includes('Release Version') || !isHeader(nonBlank[1] || '')) {
    fail(file, '"## Release Version" must immediately follow "# Release Date"');
  }

  // Collect the pending entry lines exactly like getReleasingChangelogContent:
  // after the "Release Version" line, until the next # header.
  const startIdx = nonBlank.findIndex(l => l.includes('Release Version')) + 1;
  const block = [];
  for (let i = startIdx; i < nonBlank.length; i++) {
    if (isHeader(nonBlank[i])) break;
    block.push(nonBlank[i]);
  }

  if (block.length === 0) {
    fail(file, 'pending block has no entries — remove the header block or add entries');
    continue;
  }

  let taggedCount = 0;
  for (const line of block) {
    const trimmed = line.trim();
    const special = trimmed.toLowerCase().replace(/[-:]/g, '').trim();
    if (PLATFORM_LINE_RE.test(trimmed) || SPECIAL_LINES.includes(special)) {
      continue; // grouping bullet / special line — fine untagged
    }
    const m = trimmed.match(TAG_RE);
    if (!m) {
      fail(
        file,
        `untagged entry line (contributes nothing to the release type): "${trimmed.slice(0, 60)}"`
      );
      continue;
    }
    if (!VALID_TAGS.includes(m[1].trim())) {
      fail(
        file,
        `invalid release tag "[${m[1]}]" (valid: ${VALID_TAGS.join(', ')}; case-sensitive): ` +
          `"${trimmed.slice(0, 60)}"`
      );
      continue;
    }
    if (new RegExp(`\\[${m[1]}\\]\\s*:`).test(trimmed)) {
      fail(
        file,
        `colon after the tag would be published as "- : ..." — use "- [${m[1].trim()}] Text": ` +
          `"${trimmed.slice(0, 60)}"`
      );
    }
    taggedCount++;
  }

  if (taggedCount === 0) {
    fail(
      file,
      'pending block contains no [major]/[minor]/[patch] entry — release type ' +
        'resolves to NA and the module is silently skipped'
    );
  }

  // Tags anywhere in released (post-block) sections mean an entry was added
  // in the wrong place — the release scripts will never process it.
  const afterBlock = nonBlank.slice(startIdx + block.length);
  afterBlock.forEach(l => {
    const m = l.trim().match(/\[(major|minor|patch)\]/);
    if (m && !isHeader(l)) {
      fail(file, `tagged entry found in released history (wrong place): "${l.trim().slice(0, 60)}"`);
    }
  });
}

if (failed) {
  console.error('\nChangelog validation failed. Expected pending-block format:\n');
  console.error('  # Release Date\n\n  ## Release Version\n\n  - iOS\n    - [minor] What changed\n  - Android\n    - [patch] What changed\n');
  process.exit(1);
}
console.log(`✓ ${files.length} changelog(s) valid`);
