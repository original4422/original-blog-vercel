import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import type { ContentPost, PostMetadata } from './schema';

const postsDirectory = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	'../posts',
);

export function stripByteOrderMark(content: string) {
	return content.replace(/^\uFEFF/, '');
}

export function slugifyHeading(value: string) {
	return value
		.trim()
		.toLowerCase()
		.replace(/[^\p{L}\p{N}\s-]/gu, '')
		.replace(/\s+/g, '-');
}

function estimateReadingTime(content: string) {
	const words = content
		.replace(/```[\s\S]*?```/g, '')
		.replace(/[#>*_`[\]()!-]/g, ' ')
		.trim()
		.split(/\s+|(?<=[\u4e00-\u9fff])(?=[\u4e00-\u9fff])/)
		.filter(Boolean).length;
	return `${Math.max(1, Math.ceil(words / 260))} min read`;
}

function normalizeMetadata(data: Record<string, unknown>): PostMetadata {
	return {
		title: String(data.title ?? ''),
		publishedAt: String(data.publishedAt ?? ''),
		summary: String(data.summary ?? ''),
		draft: Boolean(data.draft),
		image: data.image ? String(data.image) : undefined,
		tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
		featured: data.featured === undefined ? undefined : Boolean(data.featured),
	};
}

export function getPostSlugs(options: { includeDrafts?: boolean } = {}) {
	return getAllPosts(options).map((post) => post.slug);
}

export function getPost(slug: string): ContentPost | undefined {
	if (!/^[a-z0-9-]+$/.test(slug)) return undefined;
	const filePath = path.join(postsDirectory, `${slug}.mdx`);
	if (!fs.existsSync(filePath)) return undefined;

	const source = stripByteOrderMark(fs.readFileSync(filePath, 'utf8'));
	const { data, content } = matter(source);
	const headings = Array.from(content.matchAll(/^(#{2,3})\s+(.+)$/gm)).map(
		([, hashes, text]) => ({
			id: slugifyHeading(text),
			text: text.trim(),
			level: hashes.length,
		}),
	);

	return {
		slug,
		metadata: normalizeMetadata(data),
		content,
		source,
		headings,
		readingTime: estimateReadingTime(content),
	};
}

export function getAllPosts(options: { includeDrafts?: boolean } = {}) {
	const includeDrafts = options.includeDrafts ?? false;
	return fs
		.readdirSync(postsDirectory)
		.filter((file) => file.endsWith('.mdx'))
		.map((file) => getPost(file.replace(/\.mdx$/, '')))
		.filter((post): post is ContentPost => Boolean(post))
		.filter((post) => includeDrafts || !post.metadata.draft)
		.sort(
			(a, b) =>
				Date.parse(b.metadata.publishedAt) - Date.parse(a.metadata.publishedAt),
		);
}

export function getAllTags() {
	const counts = new Map<string, number>();
	for (const post of getAllPosts()) {
		for (const tag of post.metadata.tags) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1);
		}
	}
	return [...counts.entries()]
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getPostsByTag(tag: string) {
	return getAllPosts().filter((post) =>
		post.metadata.tags.some(
			(postTag) => postTag.toLowerCase() === tag.toLowerCase(),
		),
	);
}

export function postBodyForSearch(content: string) {
	return content
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/[#>*_`[\]()!-]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.slice(0, 1500);
}
