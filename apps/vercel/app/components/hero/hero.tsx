import { pageContent, siteContent } from '@original/content';
import classNames from 'classnames';
import { merryWeather } from '../../fonts';
import Footer from '../layouts/footer/footer';
import SplashCursor from '../splash-cursor';
import ArrowDown from './arrow-down';

export default function Hero() {
	const { hero } = pageContent.home;

	return (
		<main className='relative min-h-svh w-screen overflow-hidden'>
			<SplashCursor
				containerClassName='min-h-svh w-screen'
				usePrimaryColors={true}
			>
				<div
					className={classNames(
						'relative min-h-svh md:block flex flex-col',
						merryWeather.className,
					)}
				>
					<div className='md:absolute md:top-[20%] max-w-4xl flex-col space-y-8 md:space-y-10 justify-center px-8 md:px-24 lg:ml-14 flex-1 flex md:flex-none pt-28 md:pt-0 pb-8 md:pb-0'>
						<header className='space-y-3'>
							<h1 className='text-3xl font-bold md:text-5xl tracking-tight'>
								{hero.headingPrefix} {siteContent.name}
							</h1>
							<p className='text-lg md:text-xl text-neutral-600 dark:text-neutral-400'>
								{hero.role}
							</p>
						</header>
						<section className='relative z-10 space-y-6'>
							{hero.sections.map((section) => (
								<div key={section.title}>
									<h2 className='text-sm font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-500 mb-3'>
										{section.title}
									</h2>
									<p className='text-base leading-relaxed text-justify text-neutral-700 dark:text-neutral-300'>
										{section.body}
									</p>
								</div>
							))}
							<p className='text-base italic text-neutral-600 dark:text-neutral-400 pt-2'>
								{hero.welcomePrefix}
								<span className='border-b border-neutral-400 dark:border-neutral-500'>
									{hero.welcomeEmphasis}
								</span>
								{hero.welcomeSuffix}
							</p>
						</section>
					</div>
					<div className='md:absolute md:bottom-20 left-0 right-0 z-10 pb-10 md:pb-0'>
						<Footer variant='hero' />
					</div>
					<ArrowDown />
				</div>
			</SplashCursor>
		</main>
	);
}
