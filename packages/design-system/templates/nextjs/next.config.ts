import path from 'node:path';
import type { NextConfig } from 'next';

const dsRoot = path.join(process.cwd(), 'node_modules/plantasonic-design-system');

const nextConfig: NextConfig = {
  transpilePackages: ['plantasonic-design-system'],
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'node_modules')],
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@ds': dsRoot,
      'plantasonic-design-system/shell': path.join(dsRoot, 'src/shell/index.ts'),
    };
    return config;
  },
};

export default nextConfig;
