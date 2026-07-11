import 'katex/dist/katex.min.css';
import 'lenis/dist/lenis.css';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { siteConfig } from '../site.config';
import Analytics from './components/analytics/analytics';
import TopNav from './components/layouts/top-nav/top-nav';
import LenisProvider from './components/providers/LenisProvider';
import ThemeProvider from './components/providers/ThemeProvider';
import { mukta } from './fonts';
import './tailwind.css';

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		template: `%s | ${siteConfig.name}`,
		default: siteConfig.title,
	},
	description: siteConfig.description,
	authors: [{ name: siteConfig.name, url: siteConfig.github }],
	creator: siteConfig.name,
	alternates: {
		canonical: '/',
		types: {
			'application/rss+xml': '/feed.xml',
		},
	},
	openGraph: {
		type: 'website',
		locale: siteConfig.locale,
		url: siteConfig.url,
		title: siteConfig.title,
		description: siteConfig.description,
		siteName: siteConfig.name,
		images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
	},
	twitter: {
		card: 'summary_large_image',
		title: siteConfig.title,
		description: siteConfig.description,
		images: ['/opengraph-image'],
	},
	icons: {
		icon: '/static/favicons/favicon.svg',
		apple: '/static/favicons/favicon.svg',
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#ffffff' },
		{ media: '(prefers-color-scheme: dark)', color: '#000000' },
	],
	colorScheme: 'dark light',
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html
			lang={siteConfig.language}
			suppressHydrationWarning
			className={mukta.className}
		>
			<body className='bg-white text-black antialiased selection:bg-primary-500 selection:text-white dark:bg-black dark:text-white'>
				<ThemeProvider
					attribute='class'
					defaultTheme='dark'
					themes={['dark', 'light']}
					disableTransitionOnChange={false}
				>
					<LenisProvider>
						<TopNav />
						{children}
					</LenisProvider>
					{process.env.NODE_ENV === 'production' ? <Analytics /> : null}
				</ThemeProvider>
			</body>
		</html>
	);
}
