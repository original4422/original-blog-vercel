import { siteConfig } from '../../site.config';
import Header from '../components/header';
import PageContainer from '../components/layouts/page-container';
import { Thoughts } from '../components/thoughts';
import { getPosts } from './utils';

export const metadata = {
	title: 'Blog',
	description: 'original 的文章与思考',
	alternates: { canonical: `${siteConfig.url}/blog` },
};

export default function ThoughtsPage() {
	const posts = getPosts();

	return (
		<PageContainer>
			<Header title='Blog' />
			<Thoughts posts={posts} />
		</PageContainer>
	);
}
