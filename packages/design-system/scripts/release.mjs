import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PKG = join(ROOT, 'package.json');
const CHANGELOG = join(ROOT, 'CHANGELOG.md');

function parseVersion(v) {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(v);
  if (!m) throw new Error(`Invalid semver: ${v}`);
  return { major: +m[1], minor: +m[2], patch: +m[3] };
}

function bump(version, level) {
  const v = parseVersion(version);
  if (level === 'major') return `${v.major + 1}.0.0`;
  if (level === 'minor') return `${v.major}.${v.minor + 1}.0`;
  return `${v.major}.${v.minor}.${v.patch + 1}`;
}

function extractReleaseNotes(changelog, version) {
  const header = `## [${version}]`;
  const start = changelog.indexOf(header);
  if (start === -1) return null;
  const rest = changelog.slice(start + header.length);
  const next = rest.search(/\n## \[/);
  return rest.slice(0, next === -1 ? undefined : next).trim();
}

const level = process.argv[2] ?? 'patch';
if (!['major', 'minor', 'patch'].includes(level)) {
  console.error('Usage: npm run release -- [major|minor|patch]');
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(PKG, 'utf8'));
const nextVersion = bump(pkg.version, level);
const changelog = readFileSync(CHANGELOG, 'utf8');
const unreleased = extractReleaseNotes(changelog, 'Unreleased');

const notesPath = join(ROOT, 'docs/generated/RELEASE_NOTES.md');
const notes = [
  `# Release ${nextVersion}`,
  '',
  unreleased ?? '_Move items from [Unreleased] in CHANGELOG.md before releasing._',
  '',
].join('\n');

writeFileSync(notesPath, notes, 'utf8');

pkg.version = nextVersion;
writeFileSync(PKG, JSON.stringify(pkg, null, 2) + '\n', 'utf8');

console.log(`✓ Version bumped to ${nextVersion}`);
console.log(`✓ Release notes: docs/generated/RELEASE_NOTES.md`);
console.log('\nNext: update CHANGELOG.md with dated section, commit, and tag.');
