import { siteConfig } from '../../site.config';
import { getAllTags, getPosts } from '../blog/utils';
import Header from '../components/header';
import PageContainer from '../components/layouts/page-container';
import { TagCloud } from '../components/tag-cloud';

export const metadata = {
	title: 'Tags',
	description: '按主题浏览 original 的文章',
	alternates: { canonical: `${siteConfig.url}/tags` },
};

const TOPIC_GROUPS = [
	{
		title: 'Engineering',
		description: '系统设计、编程语言与工程实践。',
		tags: ['System Design', 'C++', '工程', 'Frontend'],
	},
	{
		title: 'Research & AI',
		description: '论文阅读、模型直觉与数学笔记。',
		tags: ['AI', 'Paper Reading', '数学'],
	},
	{
		title: 'Writing & Design',
		description: '写作系统、个人知识与界面设计。',
		tags: ['Writing', '数字花园', 'Design', '交互'],
	},
] as const;

export default function TagsPage() {
	const posts = getPosts();
	const tags = getAllTags();
	const tagMap = new Map(tags.map((item) => [item.tag, item]));
	const groupedTags = TOPIC_GROUPS.map((group) => ({
		...group,
		tags: group.tags
			.map((tag) => tagMap.get(tag))
			.filter((tag): tag is { tag: string; count: number } => Boolean(tag)),
	})).filter((group) => group.tags.length > 0);
	const usedTags = new Set(
		groupedTags.flatMap((group) => group.tags.map(({ tag }) => tag)),
	);
	const remaining = tags.filter(({ tag }) => !usedTags.has(tag));

	return (
		<PageContainer>
			<Header title='Tags' />
			<div className='space-y-10'>
				<p className='text-sm text-gray-500 dark:text-gray-400'>
					{posts.length} blog posts · {tags.length} topics
				</p>
				{groupedTags.map((group) => (
					<section key={group.title} className='space-y-3'>
						<div className='space-y-1'>
							<h2 className='text-xl font-medium'>{group.title}</h2>
							<p className='text-sm text-gray-500 dark:text-gray-400'>
								{group.description}
							</p>
						</div>
						<TagCloud tags={group.tags} showCount />
					</section>
				))}
				{remaining.length > 0 ? <TagCloud tags={remaining} showCount /> : null}
			</div>
		</PageContainer>
	);
}
