import { pageContent } from '@original/content';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '../../site.config';

export default function AboutTitle() {
	const { about } = pageContent;

	return (
		<article className='mx-auto max-w-2xl'>
			<div className='mb-8 flex justify-center'>
				<div className='overflow-hidden rounded-full ring-2 ring-neutral-200 dark:ring-neutral-700'>
					<Image
						src={about.avatar.src}
						alt={about.avatar.alt}
						width={128}
						height={128}
						priority
					/>
				</div>
			</div>

			<section className='mb-10 text-center'>
				<p className='mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-primary-500'>
					{about.eyebrow}
				</p>
				<h1 className='mb-4 text-3xl font-bold'>{about.title}</h1>
				<p className='leading-relaxed text-neutral-700 dark:text-neutral-300'>
					{about.intro[0]}
				</p>
				<div className='mt-6 flex justify-center gap-3'>
					<Link
						href={siteConfig.github}
						target='_blank'
						rel='noreferrer'
						className='rounded-full border border-neutral-300 px-4 py-2 text-sm transition hover:border-primary-500 hover:text-primary-500 dark:border-neutral-700'
					>
						GitHub
					</Link>
					<Link
						href={`mailto:${siteConfig.email}`}
						className='rounded-full bg-primary-500 px-4 py-2 text-sm text-white transition hover:bg-primary-600'
					>
						Email
					</Link>
				</div>
			</section>

			<section className='mb-10'>
				<h2 className='mb-4 text-lg font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400'>
					Profile
				</h2>
				<ul className='space-y-3 text-neutral-700 dark:text-neutral-300'>
					<li>
						• GitHub：
						<Link href={siteConfig.github} className='underline-magical'>
							{siteConfig.githubHandle}
						</Link>
					</li>
					{about.profile.map((item) => (
						<li key={item.label}>
							• {item.label}：{item.value}
						</li>
					))}
				</ul>
			</section>

			<section className='mb-10'>
				<h2 className='mb-4 text-lg font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400'>
					Now
				</h2>
				<ul className='space-y-3 text-neutral-700 dark:text-neutral-300'>
					{about.now.map((item) => (
						<li key={item}>• {item}</li>
					))}
				</ul>
			</section>

			<section>
				<h2 className='mb-4 text-lg font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400'>
					Blog History
				</h2>
				{about.history.map((item) => (
					<p key={item.year} className='text-neutral-700 dark:text-neutral-300'>
						<strong>{item.year}：</strong>
						{item.body}
					</p>
				))}
			</section>
		</article>
	);
}
