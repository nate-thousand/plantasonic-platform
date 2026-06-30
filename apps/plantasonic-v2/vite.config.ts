import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dsRoot = path.resolve(__dirname, 'node_modules/plantasonic-design-system');
const demoRoot = path.resolve(__dirname, '../demo/src');

export default defineConfig({
  root: '.',
  resolve: {
    alias: {
      '@plantasonic/platform': path.resolve(__dirname, '../../packages/sdk/src/index.ts'),
      '@plantasonic/platform-types': path.resolve(
        __dirname,
        '../../packages/shared-types/src/index.ts',
      ),
      '@plantasonic/platform-demo/instrument-app': path.resolve(demoRoot, 'instrumentApp.ts'),
      'plantasonic-design-system/shell': path.resolve(dsRoot, 'src/shell/index.ts'),
      'plantasonic-design-system/instrument': path.resolve(dsRoot, 'src/instrument/index.ts'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
      },
    },
  },
  optimizeDeps: {
    include: ['tone', 'plantasia-sound-engine', 'ascii-visual-engine'],
  },
  server: {
    port: 5177,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
