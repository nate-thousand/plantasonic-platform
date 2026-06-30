import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dsRoot = path.resolve(__dirname, 'node_modules/plantasonic-design-system');

export default defineConfig({
  root: '.',
  resolve: {
    alias: {
      '@plantasonic/platform': path.resolve(
        __dirname,
        '../../packages/sdk/src/index.ts',
      ),
      '@plantasonic/platform-types': path.resolve(
        __dirname,
        '../../packages/shared-types/src/index.ts',
      ),
      'plantasonic-design-system/shell': path.resolve(dsRoot, 'src/shell/index.ts'),
      'plantasonic-design-system/instrument': path.resolve(
        dsRoot,
        'src/instrument/index.ts',
      ),
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
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
