import { pageContent } from '@original/content';
import Projects from 'app/projects/projects';
import { Fragment } from 'react';
import { siteConfig } from '../../site.config';
import Header from '../components/header';

export const metadata = {
	title: pageContent.projects.title,
	description: pageContent.projects.metadataDescription,
	alternates: { canonical: `${siteConfig.url}/projects` },
};

export default function Page() {
	return (
		<Fragment>
			<Header title={pageContent.projects.title} />
			<div className='space-y-2 md:space-y-5 '>
				<p className='text-lg leading-7 text-gray-500 dark:text-gray-400'>
					{pageContent.projects.listingDescription}
				</p>
			</div>
			<Projects />
		</Fragment>
	);
}
