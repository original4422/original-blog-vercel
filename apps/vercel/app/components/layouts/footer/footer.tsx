import { pageContent } from '@original/content';
import Link from 'next/link';
import { siteConfig } from '../../../../site.config';

function GithubMark() {
	return (
		<svg
			viewBox='0 0 24 24'
			aria-hidden='true'
			className='size-6'
			fill='currentColor'
		>
			<path d='M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49v-1.9c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .08 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.64-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.59.69.49A10.26 10.26 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z' />
		</svg>
	);
}

function MailMark() {
	return (
		<svg
			viewBox='0 0 24 24'
			aria-hidden='true'
			className='size-6'
			fill='none'
			stroke='currentColor'
			strokeWidth='1.8'
		>
			<rect x='3' y='5' width='18' height='14' rx='2' />
			<path d='m4 7 8 6 8-6' />
		</svg>
	);
}

export default function Footer({
	variant = 'default',
}: {
	variant?: 'default' | 'hero';
}) {
	const isHero = variant === 'hero';
	const year = new Date().getFullYear();

	return (
		<footer
			className={`w-full px-4 ${isHero ? 'py-4' : 'border-t border-gray-200/50 bg-white py-12 dark:border-gray-800/50 dark:bg-black'}`}
		>
			<div className='mx-auto flex max-w-7xl flex-col items-center gap-4'>
				<div className='flex gap-2'>
					<Link
						href={siteConfig.github}
						target='_blank'
						rel='noreferrer'
						aria-label='GitHub'
						className='rounded-full p-2 transition hover:scale-110 hover:text-primary-500'
					>
						<GithubMark />
					</Link>
					<Link
						href={`mailto:${siteConfig.email}`}
						aria-label='Email'
						className='rounded-full p-2 transition hover:scale-110 hover:text-primary-500'
					>
						<MailMark />
					</Link>
					<Link
						href='/feed.xml'
						aria-label='RSS feed'
						className='rounded-full px-3 py-2 text-sm font-bold transition hover:scale-110 hover:text-primary-500'
					>
						RSS
					</Link>
				</div>
				{!isHero ? (
					<>
						<p className='text-center text-sm text-gray-600 dark:text-gray-400'>
							© {year} • {siteConfig.name} •{' '}
							{pageContent.footer.copyrightSuffix}
						</p>
						<p className='text-center text-xs text-gray-500 opacity-70'>
							{pageContent.footer.builtWith}
						</p>
					</>
				) : null}
			</div>
		</footer>
	);
}
