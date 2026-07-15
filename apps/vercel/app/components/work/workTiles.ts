import { projects } from '@original/content';

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

const previewLayoutBySlug: Partial<Record<string, WorkTilePreviewLayout>> = {
	'field-notes': 'feature-bottom',
};

const toImage = (src: string, alt: string): WorkTileImage => ({
	src,
	width: 1600,
	height: 900,
	alt,
});

export const workTiles: WorkTile[] = projects.map((project) => ({
	description: project.role,
	title: project.title,
	image: toImage(project.image, project.imageAlt),
	previewImages: project.gallery.map((entry) => toImage(entry.src, entry.alt)),
	previewLayout: previewLayoutBySlug[project.slug],
}));
