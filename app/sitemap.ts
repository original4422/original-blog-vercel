import type { MetadataRoute } from 'next';
import { siteConfig } from '../site.config';
import { getAllTags, getPosts } from './blog/utils';
import { projects } from './projects/constants';

export default function sitemap(): MetadataRoute.Sitemap {
	const today = new Date();
	const staticRoutes: MetadataRoute.Sitemap = [
		'',
		'/blog',
		'/projects',
		'/about',
		'/tags',
	].map((route) => ({
		url: `${siteConfig.url}${route}`,
		lastModified: today,
		changeFrequency: route === '' ? 'weekly' : 'monthly',
		priority: route === '' ? 1 : 0.8,
	}));
	const posts: MetadataRoute.Sitemap = getPosts().map((post) => ({
		url: `${siteConfig.url}/blog/${post.slug}`,
		lastModified: new Date(post.metadata.publishedAt),
		changeFrequency: 'yearly',
		priority: 0.7,
	}));
	const tags: MetadataRoute.Sitemap = getAllTags().map(({ tag }) => ({
		url: `${siteConfig.url}/tags/${encodeURIComponent(tag)}`,
		lastModified: today,
		changeFrequency: 'monthly',
		priority: 0.5,
	}));
	const projectRoutes: MetadataRoute.Sitemap = projects
		.filter((project) => project.slug)
		.map((project) => ({
			url: `${siteConfig.url}/projects/${project.slug}`,
			lastModified: today,
			changeFrequency: 'monthly',
			priority: 0.7,
		}));

	return [...staticRoutes, ...posts, ...tags, ...projectRoutes];
}
