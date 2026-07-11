'use client';

import Link from 'next/link';
import type { ProjectModal } from './types';

interface ProjectProps {
	index: number;
	title: string;
	url?: string;
	slug?: string;
	role: string;
	summary?: string;
	setModal: (modal: ProjectModal) => void;
}

export default function ProjectItem({
	index,
	title,
	url,
	slug,
	role,
	summary,
	setModal,
}: ProjectProps) {
	const content = (
		<div className='w-full'>
			<div className='flex w-full items-center justify-between gap-8'>
				<h2 className='text-2xl transition-all group-hover:-translate-x-3 group-hover:scale-110 sm:text-6xl'>
					{title}
				</h2>
				<p className='shrink-0 text-right text-base font-light leading-tight transition-all group-hover:translate-x-3 group-hover:scale-110 sm:text-2xl'>
					{role}
				</p>
			</div>
			{summary ? (
				<p className='mt-4 text-left text-[11px] leading-relaxed text-zinc-400 sm:text-xs'>
					{summary}
				</p>
			) : null}
		</div>
	);
	const className =
		'group flex w-full items-center justify-between border-b px-4 py-10 sm:px-10 sm:py-16';
	const interaction = {
		onMouseEnter: () => setModal({ active: true, index }),
		onMouseLeave: () => setModal({ active: false, index }),
		onFocus: () => setModal({ active: true, index }),
		onBlur: () => setModal({ active: false, index }),
	};

	if (slug) {
		return (
			<Link href={`/projects/${slug}`} className={className} {...interaction}>
				{content}
			</Link>
		);
	}

	return (
		<a
			href={url}
			target='_blank'
			rel='noreferrer'
			className={className}
			{...interaction}
		>
			{content}
		</a>
	);
}
