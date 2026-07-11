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
	name: 'original',
	title: 'original — Blog & Projects',
	description: '记录技术、思考与创造的个人数字花园。',
	locale: 'zh_CN',
	language: 'zh-CN',
	url: resolveSiteUrl(),
	email: 'hello@example.com',
	github: 'https://github.com/original4422',
	githubHandle: '@original4422',
} as const;
