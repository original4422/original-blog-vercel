import Projects from 'app/projects/projects';
import { Fragment } from 'react';
import { siteConfig } from '../../site.config';
import Header from '../components/header';

export const metadata = {
	title: 'Projects',
	description: 'original 的项目作品集',
	alternates: { canonical: `${siteConfig.url}/projects` },
};

export default function Page() {
	return (
		<Fragment>
			<Header title='Projects' />
			<div className='space-y-2 md:space-y-5 '>
				<p className='text-lg leading-7 text-gray-500 dark:text-gray-400'>
					这里暂时展示四个示例项目，用于预览作品集的最终呈现方式。
				</p>
			</div>
			<Projects />
		</Fragment>
	);
}
