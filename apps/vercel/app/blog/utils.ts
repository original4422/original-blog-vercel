import type { PostMetadata } from '@original/content';
import {
	getAllPosts,
	getPostsByTag as getCanonicalPostsByTag,
	getAllTags as getCanonicalTags,
	getPost,
} from '@original/content/server';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { components } from '../components/mdx';

export interface BlogPost {
	metadata: PostMetadata;
	slug: string;
	content: string;
}

export function getPosts(): BlogPost[] {
	return getAllPosts().map(({ metadata, slug, content }) => ({
		metadata,
		slug,
		content,
	}));
}

export const getAllTags = getCanonicalTags;

export function getPostsByTag(tag: string): BlogPost[] {
	return getCanonicalPostsByTag(tag).map(({ metadata, slug, content }) => ({
		metadata,
		slug,
		content,
	}));
}

export function formatDate(date: string, includeRelative = false) {
	const currentDate = new Date();
	if (!date.includes('T')) {
		date = `${date}T00:00:00`;
	}
	const targetDate = new Date(date);

	const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
	const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
	const daysAgo = currentDate.getDate() - targetDate.getDate();

	let formattedDate = '';

	if (yearsAgo > 0) {
		formattedDate = `${yearsAgo}y ago`;
	} else if (monthsAgo > 0) {
		formattedDate = `${yearsAgo}mo ago`;
	} else if (daysAgo > 0) {
		formattedDate = `${daysAgo}d ago`;
	} else {
		formattedDate = 'Today';
	}

	const fullDate = targetDate.toLocaleString('en-us', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	});

	if (!includeRelative) {
		return fullDate;
	}

	return `${fullDate} (${formattedDate})`;
}

export async function getPostFromSlug(slug: string) {
	const post = getPost(slug);
	if (!post) {
		throw new Error(`Invalid blog slug: ${slug}`);
	}

	const { content } = await compileMDX<PostMetadata>({
		source: post.source,
		options: {
			parseFrontmatter: true,
			blockJS: false,
			scope: {},
			mdxOptions: {
				remarkPlugins: [remarkGfm, remarkMath],
				rehypePlugins: [rehypeKatex, [rehypePrettyCode, { theme: 'dracula' }]],
				format: 'mdx',
			},
		},
		components,
	});

	return {
		metadata: post.metadata,
		content,
	};
}
