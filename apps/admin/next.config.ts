import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@chaufher/ui'],
  experimental: {
    optimizePackageImports: ['@chaufher/ui', 'lucide-react', 'recharts'],
  },
};

export default nextConfig;
