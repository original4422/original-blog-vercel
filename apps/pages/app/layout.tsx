import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Footer } from '@/components/footer';
import '@/components/chrome.css';
import { TopNav } from '@/components/top-nav';
import {
  absoluteSiteUrl,
  SITE_URL,
  siteConfig,
  withBasePath,
} from '@/data/site';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  alternates: {
    canonical: SITE_URL,
    types: { 'application/rss+xml': absoluteSiteUrl('/feed.xml') },
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: SITE_URL,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      { url: absoluteSiteUrl('/social-card.svg'), width: 1200, height: 630 },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [absoluteSiteUrl('/social-card.svg')],
  },
  icons: { icon: withBasePath('/favicon.svg') },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f6f2' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0a0b' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    url: SITE_URL,
    sameAs: [siteConfig.github],
  };

  return (
    <html lang={siteConfig.language} suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main-content">
          跳到主要内容
        </a>
        <Providers>
          <TopNav />
          {children}
          <Footer />
        </Providers>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: serialized static schema data
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
