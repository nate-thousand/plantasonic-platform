import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: [{ find: '@ds', replacement: path.resolve(__dirname, '..') }],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
