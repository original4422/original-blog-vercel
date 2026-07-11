import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '../../site.config';

export default function AboutTitle() {
	return (
		<article className='mx-auto max-w-2xl'>
			<div className='mb-8 flex justify-center'>
				<div className='overflow-hidden rounded-full ring-2 ring-neutral-200 dark:ring-neutral-700'>
					<Image
						src='/static/images/avatar.svg'
						alt='original 的示例头像'
						width={128}
						height={128}
						priority
					/>
				</div>
			</div>

			<section className='mb-10 text-center'>
				<p className='mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-primary-500'>
					About
				</p>
				<h1 className='mb-4 text-3xl font-bold'>Hi, there 👋</h1>
				<p className='leading-relaxed text-neutral-700 dark:text-neutral-300'>
					我是 <span className='font-semibold'>original</span>
					。这是一段可替换的个人简介：可以写你的研究方向、工作、兴趣，或创建这个网站的原因。
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
					<li>• Tech Stack：在这里填写你常用的语言、框架与工具</li>
					<li>• Location：在这里填写城市或 Remote</li>
					<li>• Interests：技术、开源、写作，以及你真正关心的事</li>
				</ul>
			</section>

			<section className='mb-10'>
				<h2 className='mb-4 text-lg font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400'>
					Now
				</h2>
				<ul className='space-y-3 text-neutral-700 dark:text-neutral-300'>
					<li>• 正在构建这个个人博客，并整理第一批内容</li>
					<li>• 持续学习一个值得长期投入的主题</li>
					<li>• 把想法转化为可被使用的小项目</li>
				</ul>
			</section>

			<section>
				<h2 className='mb-4 text-lg font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400'>
					Blog History
				</h2>
				<p className='text-neutral-700 dark:text-neutral-300'>
					<strong>2026：</strong>博客首版上线，使用 Next.js、MDX、GSAP、Motion
					与 Vercel 构建。
				</p>
			</section>
		</article>
	);
}
