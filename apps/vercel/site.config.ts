import { siteContent } from '@original/content';

function normalizeUrl(url: string) {
	return url.replace(/\/$/, '');
}

function resolveSiteUrl() {
	if (process.env.NEXT_PUBLIC_SITE_URL) {
		return normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL);
	}

	if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
		return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
	}

	return 'http://localhost:3000';
}

export const siteConfig = {
	...siteContent,
	url: resolveSiteUrl(),
} as const;
