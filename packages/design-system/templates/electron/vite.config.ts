import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: [
      {
        find: 'plantasonic-design-system/shell',
        replacement: path.resolve(__dirname, 'node_modules/plantasonic-design-system/src/shell/index.ts'),
      },
      { find: '@ds', replacement: path.resolve(__dirname, 'node_modules/plantasonic-design-system') },
    ],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
