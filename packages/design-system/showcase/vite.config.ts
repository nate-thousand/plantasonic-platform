import path from 'node:path';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import pkg from '../package.json';

const bootstrapPkg = JSON.parse(
  readFileSync(path.resolve(__dirname, 'node_modules/bootstrap/package.json'), 'utf8'),
) as { version: string };

function gitCommit(): string {
  try {
    return execSync('git rev-parse --short HEAD', {
      cwd: path.resolve(__dirname, '..'),
      encoding: 'utf8',
    }).trim();
  } catch {
    return 'unknown';
  }
}

export default defineConfig({
  define: {
    __DS_VERSION__: JSON.stringify(pkg.version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __GIT_COMMIT__: JSON.stringify(gitCommit()),
    __BOOTSTRAP_VERSION__: JSON.stringify(bootstrapPkg.version),
  },
  resolve: {
    alias: [
      { find: '@ds/shell', replacement: path.resolve(__dirname, '../src/shell/index.ts') },
      { find: '@ds/components', replacement: path.resolve(__dirname, '../src/components/index.ts') },
      { find: '@ds/primitives', replacement: path.resolve(__dirname, '../src/primitives/index.ts') },
      { find: '@ds/motion', replacement: path.resolve(__dirname, '../src/motion/index.ts') },
      { find: '@ds/instrument', replacement: path.resolve(__dirname, '../src/instrument/index.ts') },
      { find: '@ds/creative-workspace', replacement: path.resolve(__dirname, '../src/creative-workspace/index.ts') },
      { find: '@ds/app', replacement: path.resolve(__dirname, '../src/app/index.ts') },
      { find: '@ds', replacement: path.resolve(__dirname, '..') },
    ],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
