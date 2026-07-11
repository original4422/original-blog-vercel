import type { Project } from './types';

export interface ProjectDetail {
	slug: string;
	title: string;
	subtitle: string;
	description: string;
	overviewSections?: {
		title: string;
		body: string;
		image?: string;
		imageAlt?: string;
	}[];
	features: { title: string; description: string }[];
	techStack: { category: string; items: string[] }[];
	links: { label: string; url: string }[];
	usage: string[];
	targetUsers: string[];
	license: string;
	deployedProjects?: {
		title: string;
		role: string;
		summary: string;
		url: string;
		githubUrl: string;
		image?: string;
		imageAlt?: string;
	}[];
}

export const projects: Project[] = [
	{
		title: 'Atlas Notes',
		src: 'atlas.svg',
		color: '#fce7f3',
		slug: 'atlas-notes',
		role: 'Knowledge Workspace',
		summary: '把散落的笔记组织成可以探索的知识地图。示例项目，等待替换。',
	},
	{
		title: 'Signal Lab',
		src: 'signal.svg',
		color: '#e0f2fe',
		slug: 'signal-lab',
		role: 'Data Experiment',
		summary: '用于观察时序信号、记录实验并比较结果的交互式工作台。',
	},
	{
		title: 'Field Notes',
		src: 'field-notes.svg',
		color: '#fef3c7',
		slug: 'field-notes',
		role: 'Writing System',
		summary: '从灵感采集到长期写作的一套轻量内容工作流。',
	},
	{
		title: 'original Blog',
		src: 'original-blog.svg',
		color: '#ede9fe',
		slug: 'original-blog',
		role: 'Personal Digital Garden',
		summary: '这个正在生长的博客：文章、项目、搜索与沉浸式动效。',
	},
];

export const projectDetails: Record<string, ProjectDetail> = {
	'atlas-notes': {
		slug: 'atlas-notes',
		title: 'Atlas Notes',
		subtitle: '一座可以被搜索、连接和重新发现的个人知识地图',
		description:
			'Atlas Notes 是一个演示用项目条目，用来展示真实项目在这里会怎样被讲述。它将快速记录、双向链接、主题地图与全文搜索组织在同一个工作区中。',
		overviewSections: [
			{
				title: '从一条笔记，到一张逐渐清晰的地图',
				body: '界面把写作区与关系视图并列呈现，让内容之间的联系不再藏在目录层级里。这里可替换为真实项目的动机、设计过程与结果。',
				image: '/static/images/project/atlas-map.svg',
				imageAlt: 'Atlas Notes 节点关系示例图',
			},
		],
		features: [
			{ title: '快速记录', description: '用最少的字段保存灵感，再逐步整理。' },
			{ title: '关系探索', description: '通过链接与标签观察内容之间的联系。' },
			{ title: '全文搜索', description: '按标题、正文和主题定位已有记录。' },
			{ title: '本地优先', description: '示例设定为可导出的开放文件格式。' },
		],
		techStack: [
			{ category: 'Interface', items: ['Next.js', 'React'] },
			{ category: 'Content', items: ['Markdown', 'Search index'] },
			{ category: 'Design', items: ['Graph view', 'Keyboard first'] },
		],
		links: [],
		usage: ['示例项目，不提供可执行安装步骤。'],
		targetUsers: [
			'需要整理长期知识的个人创作者',
			'重视开放格式的研究者与开发者',
		],
		license: 'Placeholder — 请在替换为真实项目时填写实际许可证。',
	},
	'signal-lab': {
		slug: 'signal-lab',
		title: 'Signal Lab',
		subtitle: '把时序数据、实验假设和结果比较放在一个屏幕里',
		description:
			'Signal Lab 是一个高质量占位案例。它展示项目详情页如何容纳问题定义、产品截图、功能亮点和技术选择，而不暗示该项目已经真实发布。',
		overviewSections: [
			{
				title: '用视觉层级区分信号、事件与判断',
				body: '主视图保留足够留白，让趋势、异常与注释能够被快速辨认。真实项目可以在此说明数据来源、算法与评估方式。',
				image: '/static/images/project/signal-detail.svg',
				imageAlt: 'Signal Lab 数据分析示例界面',
			},
		],
		features: [
			{ title: '多轨比较', description: '在统一时间轴上对齐多个实验结果。' },
			{ title: '事件标注', description: '为异常点和关键变化补充上下文。' },
			{ title: '参数快照', description: '记录每次实验使用的输入与设置。' },
			{ title: '结果导出', description: '将图表和摘要整理为可分享报告。' },
		],
		techStack: [
			{ category: 'Visualization', items: ['Canvas', 'SVG'] },
			{ category: 'Data', items: ['Time series', 'Local fixtures'] },
			{ category: 'Testing', items: ['Visual regression', 'Unit tests'] },
		],
		links: [],
		usage: ['示例项目，不提供可执行安装步骤。'],
		targetUsers: ['分析实验数据的工程师', '需要快速比较趋势的研究者'],
		license: 'Placeholder — 请在替换为真实项目时填写实际许可证。',
	},
	'field-notes': {
		slug: 'field-notes',
		title: 'Field Notes',
		subtitle: '一条从捕捉想法、形成草稿到稳定发布的写作路径',
		description:
			'Field Notes 用示例内容演示一个项目故事如何从目标、流程和界面三个层面展开。它不是已发布产品，后续可以整体替换为你的真实作品。',
		overviewSections: [
			{
				title: '让写作状态清晰，但不让流程压过内容',
				body: '草稿、校对与发布被压缩成安静的状态提示，主要空间仍留给文本。真实案例可在此放置项目截图和关键迭代说明。',
				image: '/static/images/project/field-notes-editor.svg',
				imageAlt: 'Field Notes 编辑器示例界面',
			},
		],
		features: [
			{ title: '收件箱', description: '快速捕捉尚未分类的标题和片段。' },
			{ title: '写作状态', description: '用克制的状态提示组织内容进度。' },
			{ title: '跨端阅读', description: '从桌面编辑自然过渡到移动阅读。' },
			{
				title: '开放导出',
				description: '以 Markdown 作为长期可迁移的内容格式。',
			},
		],
		techStack: [
			{ category: 'Content', items: ['MDX', 'Frontmatter'] },
			{ category: 'Experience', items: ['Responsive design', 'Typography'] },
			{ category: 'Delivery', items: ['Git', 'Vercel'] },
		],
		links: [],
		usage: ['示例项目，不提供可执行安装步骤。'],
		targetUsers: ['维护个人博客的作者', '希望保留内容所有权的创作者'],
		license: 'Placeholder — 请在替换为真实项目时填写实际许可证。',
	},
	'original-blog': {
		slug: 'original-blog',
		title: 'original Blog',
		subtitle: '个人首页、项目作品集与技术博客组成的数字花园',
		description:
			'本站以参考开源项目为体验基线，保留流体首屏、滚动叙事与内容系统，并将身份、文章、项目、媒体和站点元数据重建为 original 的可维护模板。',
		overviewSections: [
			{
				title: '内容与体验使用同一套视觉节奏',
				body: '首页负责建立印象，Blog 和 Projects 承载长期内容。黑白反差、洋红强调和大字号排版贯穿不同页面，使动效与阅读体验保持一致。',
				image: '/static/images/project/original-blog.svg',
				imageAlt: 'original Blog 首页概念图',
			},
		],
		features: [
			{
				title: '沉浸首页',
				description: 'WebGL 流体、滚动文字与 sticky 项目舞台。',
			},
			{ title: 'MDX 内容', description: '文章支持数学公式、表格与代码高亮。' },
			{ title: '快速搜索', description: '通过快捷键检索标题、摘要和标签。' },
			{
				title: '完整发现性',
				description: '提供 RSS、Sitemap、Robots 和分享元数据。',
			},
		],
		techStack: [
			{ category: 'Framework', items: ['Next.js 16', 'React 19'] },
			{ category: 'Motion', items: ['GSAP', 'Motion', 'Lenis'] },
			{ category: 'Content', items: ['MDX', 'KaTeX', 'Shiki'] },
		],
		links: [
			{
				label: 'GitHub',
				url: 'https://github.com/original4422/original-blog-vercel',
			},
		],
		usage: ['pnpm install', 'pnpm dev', '在 app/blog/posts 中维护文章'],
		targetUsers: ['希望了解 original 的访客', '关注技术文章与项目实践的读者'],
		license: 'MIT License — 上游版权与许可文本见仓库 LICENSE。',
	},
};
