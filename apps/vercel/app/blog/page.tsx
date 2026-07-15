import { pageContent } from '@original/content';
import { siteConfig } from '../../site.config';
import Header from '../components/header';
import PageContainer from '../components/layouts/page-container';
import { Thoughts } from '../components/thoughts';
import { getPosts } from './utils';

export const metadata = {
	title: pageContent.blog.title,
	description: pageContent.blog.metadataDescription,
	alternates: { canonical: `${siteConfig.url}/blog` },
};

export default function ThoughtsPage() {
	const posts = getPosts();

	return (
		<PageContainer>
			<Header title={pageContent.blog.title} />
			<Thoughts posts={posts} />
		</PageContainer>
	);
}
