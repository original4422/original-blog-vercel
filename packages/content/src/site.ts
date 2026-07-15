import type { SiteContent } from './schema';

export const siteContent: SiteContent = {
	name: 'original',
	title: 'original — Blog & Projects',
	description: '记录技术、思考与创造的个人数字花园。',
	locale: 'zh_CN',
	language: 'zh-CN',
	email: 'pzg24@mails.tsinghua.edu.cn',
	github: 'https://github.com/original4422',
	githubHandle: '@original4422',
	navigation: [
		{ label: 'Blog', href: '/blog' },
		{ label: 'Tags', href: '/tags' },
		{ label: 'Projects', href: '/projects' },
		{ label: 'About', href: '/about' },
	],
};
