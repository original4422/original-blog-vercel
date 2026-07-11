import classNames from 'classnames';
import { merryWeather } from '../../fonts';
import Footer from '../layouts/footer/footer';
import SplashCursor from '../splash-cursor';
import ArrowDown from './arrow-down';

export default function Hero() {
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
								我是 original
							</h1>
							<p className='text-lg md:text-xl text-neutral-600 dark:text-neutral-400'>
								一名持续学习与创造的开发者，在这里记录技术、思考与成长。
							</p>
						</header>
						<section className='relative z-10 space-y-6'>
							<div>
								<h2 className='text-sm font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-500 mb-3'>
									关于这里
								</h2>
								<p className='text-base leading-relaxed text-justify text-neutral-700 dark:text-neutral-300'>
									这里是一座正在生长的个人数字花园。文章、项目与随笔都是示例内容，等待被新的经历逐步替换。
								</p>
							</div>
							<div>
								<h2 className='text-sm font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-500 mb-3'>
									写给你
								</h2>
								<p className='text-base leading-relaxed text-justify text-neutral-700 dark:text-neutral-300'>
									如果你恰好路过，欢迎从一篇文章或一个项目开始。愿这些尚在形成的记录，最终成为一次有价值的相遇。
								</p>
							</div>
							<p className='text-base italic text-neutral-600 dark:text-neutral-400 pt-2'>
								欢迎来到我的
								<span className='border-b border-neutral-400 dark:border-neutral-500'>
									小小世界
								</span>
								。
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
