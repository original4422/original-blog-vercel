export const pageContent = {
	home: {
		hero: {
			eyebrow: 'Hello — welcome to my corner of the internet',
			headingPrefix: '我是',
			role: '一名持续学习与创造的开发者，在这里记录技术、思考与成长。',
			sections: [
				{
					title: '关于这里',
					body: '这里是一座正在生长的个人数字花园。文章、项目与随笔都是示例内容，等待被新的经历逐步替换。',
				},
				{
					title: '写给你',
					body: '如果你恰好路过，欢迎从一篇文章或一个项目开始。愿这些尚在形成的记录，最终成为一次有价值的相遇。',
				},
			],
			welcomePrefix: '欢迎来到我的',
			welcomeEmphasis: '小小世界',
			welcomeSuffix: '。',
			location: 'Shanghai · UTC+8',
			scrollLabel: '向下浏览',
		},
		intro: [
			'I think in systems.',
			'I build useful software and write to understand.',
			'I collect the details that make ideas clear, useful, and worth remembering.',
		],
		contact: {
			eyebrow: 'Have an idea worth exploring?',
			lineOne: "Let's make something",
			lineTwo: 'great together',
		},
	},
	about: {
		metadataDescription: '关于 original 与这个数字花园',
		eyebrow: 'About',
		title: 'Hi, there 👋',
		lede: '这是一段可替换的个人简介，也是未来加入真实经历、研究方向和兴趣的统一入口。',
		avatar: {
			src: '/content/avatar.svg',
			alt: 'original 的示例头像',
		},
		intro: [
			'我是 original。这是一段可替换的个人简介：可以写你的研究方向、工作、兴趣，或创建这个网站的原因。',
		],
		profile: [
			{ label: 'Tech Stack', value: '在这里填写你常用的语言、框架与工具' },
			{ label: 'Location', value: '在这里填写城市或 Remote' },
			{ label: 'Interests', value: '技术、开源、写作，以及你真正关心的事' },
		],
		now: [
			'正在构建这个个人博客，并整理第一批内容',
			'持续学习一个值得长期投入的主题',
			'把想法转化为可被使用的小项目',
		],
		history: [
			{
				year: '2026',
				body: '博客首版上线，使用 Next.js、MDX、GSAP、Motion 与 Vercel 构建。',
			},
		],
	},
	blog: {
		title: 'Blog',
		metadataDescription: 'original 的文章与思考',
		listingDescription:
			'记录技术、思考与创造的长期文章。当前内容为示例，后续可从同一内容目录直接替换。',
	},
	tags: {
		title: 'Tags',
		metadataDescription: '按主题浏览 original 的文章',
		listingDescription: '沿着主题进入内容，包括空格、中文和特殊字符标签。',
		groups: [
			{
				title: 'Engineering',
				description: '系统设计、编程语言与工程实践。',
				tags: ['System Design', 'C++', '工程', 'Frontend'],
			},
			{
				title: 'Research & AI',
				description: '论文阅读、模型直觉与数学笔记。',
				tags: ['AI', 'Paper Reading', '数学'],
			},
			{
				title: 'Writing & Design',
				description: '写作系统、个人知识与界面设计。',
				tags: ['Writing', '数字花园', 'Design', '交互'],
			},
		],
		otherTitle: 'Other notes',
		otherDescription: '尚未归入主要主题组的标签。',
	},
	projects: {
		title: 'Projects',
		metadataDescription: 'original 的项目作品集',
		listingDescription:
			'这里暂时展示四个示例项目，用于预览作品集的最终呈现方式。',
	},
	notFound: {
		title: '404',
		message: "Looks like you're lost.",
		backHome: 'Go back home',
	},
	footer: {
		tagline: 'Small notes, built to last.',
		copyrightSuffix: 'Blog',
		builtWith: 'Built with Next.js & Tailwind CSS',
	},
	search: {
		label: '搜索',
		placeholder: '搜索文章、标签或项目…',
		loading: '正在载入索引…',
		unavailable: '搜索暂时不可用',
		noResults: '没有找到匹配内容。',
	},
} as const;
