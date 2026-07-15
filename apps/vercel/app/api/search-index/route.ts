import { projects } from '@original/content';
import { NextResponse } from 'next/server';
import { getPosts } from '../../blog/utils';

export const revalidate = 3600;

type SearchItem = {
	type: 'post' | 'project';
	title: string;
	summary: string;
	tags: string[];
	publishedAt: string;
	url: string;
};

export async function GET() {
	const items: SearchItem[] = getPosts().map((post) => ({
		type: 'post' as const,
		title: post.metadata.title,
		summary: post.metadata.summary,
		tags: post.metadata.tags ?? [],
		publishedAt: post.metadata.publishedAt,
		url: `/blog/${post.slug}`,
	}));
	items.push(
		...projects.map((project) => ({
			type: 'project' as const,
			title: project.title,
			summary: project.summary,
			tags: project.techStack.flatMap((group) => group.items),
			publishedAt: '',
			url: `/projects/${project.slug}`,
		})),
	);

	return NextResponse.json(
		{ items },
		{
			headers: {
				'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
			},
		},
	);
}
