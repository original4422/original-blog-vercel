import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	pageExtensions: ['ts', 'tsx'],
	transpilePackages: ['next-mdx-remote', '@original/content'],
	reactCompiler: true,
	images: {
		formats: ['image/avif', 'image/webp'],
	},
	experimental: {
		turbopackFileSystemCacheForDev: true,
	},
};

export default nextConfig;
