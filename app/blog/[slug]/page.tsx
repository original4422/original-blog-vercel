import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { siteConfig } from '../../../site.config';
import BackNavigation from '../../components/layouts/back-navigation';
import { formatDate, getPostFromSlug, getPosts } from '../utils';
import { extractHeadings } from './extract-headings';
import PageTitle from './page-title';
import TableOfContents from './table-of-contents';

export function generateStaticParams() {
	return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const params = await props.params;
	const post = getPosts().find((item) => item.slug === params.slug);
	if (!post) return { title: 'Article Not Found' };
	const { metadata } = await getPostFromSlug(params.slug);

	const url = `${siteConfig.url}/blog/${params.slug}`;
	const ogImage = metadata.image || '/opengraph-image';

	return {
		title: metadata.title,
		description: metadata.summary,
		openGraph: {
			title: metadata.title,
			description: metadata.summary,
			type: 'article',
			url: url,
			publishedTime: metadata.publishedAt,
			authors: [siteConfig.name],
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: metadata.title,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: metadata.title,
			description: metadata.summary,
			images: [ogImage],
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function Blog(props: {
	params: Promise<{ slug: string }>;
}) {
	const params = await props.params;
	const post = getPosts().find((item) => item.slug === params.slug);
	if (!post) notFound();

	const { metadata, content } = await getPostFromSlug(params.slug);
	const headings = extractHeadings(post.content);

	return (
		<>
			<section>
				<BackNavigation />
				<PageTitle>{metadata.title}</PageTitle>
				<div className='flex justify-between items-center mt-2 text-sm'>
					<p className='text-sm text-neutral-600 dark:text-neutral-400'>
						{formatDate(metadata.publishedAt)}
					</p>
				</div>
				{metadata.image ? (
					<Image
						src={metadata.image}
						alt={metadata.title}
						width={1200}
						height={630}
						className='mt-6 w-full rounded-2xl border border-neutral-200 dark:border-neutral-800'
					/>
				) : null}
			</section>
			<div className='grid gap-12 lg:grid-cols-[minmax(0,1fr)_14.5rem]'>
				<article className='min-w-0'>{content}</article>
				<TableOfContents headings={headings} />
			</div>
		</>
	);
}
