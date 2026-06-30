import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const CLI_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const REPO_ROOT = join(CLI_ROOT, '..');
export const TEMPLATES_ROOT = join(REPO_ROOT, 'templates');

export const TEMPLATE_IDS = ['react-vite', 'react-bootstrap', 'nextjs', 'electron'];

const TEXT_EXTENSIONS = new Set([
  '.html', '.css', '.scss', '.json', '.md', '.ts', '.tsx', '.js', '.mjs', '.jsx', '.env', '.gitignore',
]);

export function toKebab(name) {
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

export function toPascal(name) {
  return name
    .split(/[-_\s]+/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join('');
}

export function isTextFile(filePath) {
  const ext = filePath.slice(filePath.lastIndexOf('.'));
  return TEXT_EXTENSIONS.has(ext) || basename(filePath).startsWith('.');
}

export function walkFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
}

export function copyTemplate(templateId, targetDir, vars) {
  const src = join(TEMPLATES_ROOT, templateId);
  if (!existsSync(src)) throw new Error(`Unknown template: ${templateId}`);
  if (existsSync(targetDir)) throw new Error(`Target already exists: ${targetDir}`);

  mkdirSync(targetDir, { recursive: true });
  cpSync(src, targetDir, { recursive: true });

  for (const file of walkFiles(targetDir)) {
    if (!isTextFile(file)) continue;
    let content = readFileSync(file, 'utf8');
    for (const [key, value] of Object.entries(vars)) {
      content = content.split(key).join(value);
    }
    writeFileSync(file, content, 'utf8');
  }

  return relative(process.cwd(), targetDir);
}

export function readPackageVersion() {
  const pkg = JSON.parse(readFileSync(join(REPO_ROOT, 'package.json'), 'utf8'));
  return pkg.version;
}
