export type WorkTileImage = {
	src: string;
	width: number;
	height: number;
	alt?: string;
};

export type WorkTilePreviewLayout = 'stacked' | 'feature-bottom';

export type WorkTile = {
	title: string;
	description: string;
	image: WorkTileImage;
	previewImages?: WorkTileImage[];
	previewLayout?: WorkTilePreviewLayout;
};

const image = (name: string, alt: string): WorkTileImage => ({
	src: `/static/images/project/${name}.svg`,
	width: 1600,
	height: 900,
	alt,
});

export const workTiles: WorkTile[] = [
	{
		description: 'I designed',
		title: 'Atlas Notes',
		image: image('atlas', 'Atlas Notes 示例工作台'),
		previewImages: [
			image('atlas', 'Atlas Notes 知识地图'),
			image('atlas-focus', 'Atlas Notes 专注阅读视图'),
			image('atlas-map', 'Atlas Notes 节点关系视图'),
		],
	},
	{
		description: 'I experimented with',
		title: 'Signal Lab',
		image: image('signal', 'Signal Lab 示例仪表盘'),
		previewImages: [
			image('signal', 'Signal Lab 信号概览'),
			image('signal-detail', 'Signal Lab 细节分析'),
		],
	},
	{
		description: 'I documented',
		title: 'Field Notes',
		image: image('field-notes', 'Field Notes 示例写作界面'),
		previewImages: [
			image('field-notes', 'Field Notes 文章索引'),
			image('field-notes-editor', 'Field Notes 编辑器'),
			image('field-notes-mobile', 'Field Notes 移动阅读视图'),
		],
		previewLayout: 'feature-bottom',
	},
	{
		description: 'Personal Digital Garden',
		title: 'original Blog',
		image: image('original-blog', 'original Blog 首页概念图'),
	},
];
