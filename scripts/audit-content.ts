import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const violations: string[] = [];

function readJson(filePath: string) {
	return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;
}

function findMdxFiles(directory: string) {
	if (!fs.existsSync(directory)) return [];
	return fs
		.readdirSync(directory, { recursive: true })
		.filter((entry) => String(entry).endsWith('.mdx'));
}

const forbiddenPostDirectories = [
	'apps/vercel/app/blog/posts',
	'apps/pages/content/posts',
];

for (const relativeDirectory of forbiddenPostDirectories) {
	const posts = findMdxFiles(path.join(root, relativeDirectory));
	if (posts.length > 0) {
		violations.push(
			`${relativeDirectory} contains ${posts.length} MDX files; posts must live in packages/content/posts`,
		);
	}
}

const contentIndex = path.join(root, 'packages/content/src/index.ts');
const contentServer = path.join(root, 'packages/content/src/server.ts');

if (!fs.existsSync(contentIndex) || !fs.existsSync(contentServer)) {
	violations.push('packages/content is missing its public and server entrypoints');
} else {
	const content = await import(pathToFileURL(contentIndex).href);
	const server = await import(pathToFileURL(contentServer).href);
	const site = content.siteContent as {
		email?: string;
		navigation?: Array<{ href?: string }>;
	};
	const projects = content.projects as Array<{
		slug?: string;
		image?: string;
		gallery?: Array<{ src?: string }>;
		overviewSections?: Array<{ image?: string }>;
		links?: Array<{ href?: string }>;
	}>;
	const posts = server.getAllPosts({ includeDrafts: true }) as Array<{
		slug: string;
		metadata: {
			publishedAt?: string;
			tags?: string[];
			image?: string;
		};
	}>;

	if (site.email !== 'pzg24@mails.tsinghua.edu.cn') {
		violations.push('canonical contact email is missing or incorrect');
	}

	const navigationPaths = site.navigation?.map((item) => item.href) ?? [];
	if (new Set(navigationPaths).size !== navigationPaths.length) {
		violations.push('navigation paths must be unique');
	}

	const postSlugs = posts.map((post) => post.slug);
	if (new Set(postSlugs).size !== postSlugs.length) {
		violations.push('post slugs must be unique');
	}

	for (const post of posts) {
		if (!post.metadata.publishedAt || Number.isNaN(Date.parse(post.metadata.publishedAt))) {
			violations.push(`post ${post.slug} has an invalid publishedAt value`);
		}
		if (!post.metadata.tags?.length || post.metadata.tags.some((tag) => !tag.trim())) {
			violations.push(`post ${post.slug} must have non-empty tags`);
		}
	}

	const projectSlugs = projects.map((project) => project.slug);
	if (new Set(projectSlugs).size !== projectSlugs.length) {
		violations.push('project slugs must be unique');
	}

	const mediaPaths = [
		...posts.map((post) => post.metadata.image),
		...projects.map((project) => project.image),
		...projects.flatMap((project) =>
			(project.gallery ?? []).map((entry) => entry.src),
		),
		...projects.flatMap((project) =>
			(project.overviewSections ?? []).map((entry) => entry.image),
		),
	].filter((value): value is string => Boolean(value));

	for (const mediaPath of mediaPaths) {
		if (!mediaPath.startsWith('/content/')) {
			violations.push(`canonical media path must start with /content/: ${mediaPath}`);
			continue;
		}
		const sourcePath = path.join(
			root,
			'packages/content/media',
			mediaPath.replace('/content/', ''),
		);
		if (!fs.existsSync(sourcePath)) {
			violations.push(`canonical media file is missing: ${mediaPath}`);
		}
	}
}

for (const appName of ['vercel', 'pages']) {
	const packageJson = readJson(path.join(root, `apps/${appName}/package.json`));
	const dependencies = packageJson.dependencies as Record<string, string> | undefined;
	if (dependencies?.['@original/content'] !== 'workspace:*') {
		violations.push(`apps/${appName} must depend on @original/content via workspace:*`);
	}
}

if (violations.length > 0) {
	for (const violation of violations) {
		console.error(`CONTENT_AUDIT: ${violation}`);
	}
	process.exitCode = 1;
} else {
	console.log('Content audit passed: one canonical source feeds both applications.');
}
