import { siteContent } from '@original/content';

export const BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH ?? '/original-blog-pages';

export const SITE_URL =
  process.env.SITE_URL ?? 'https://original4422.github.io/original-blog-pages';

export const siteConfig = {
  ...siteContent,
  nav: siteContent.navigation,
  socials: [
    { label: 'GitHub', href: siteContent.github },
    { label: 'Email', href: `mailto:${siteContent.email}` },
  ],
} as const;

export function withBasePath(path: string) {
  if (!path || path === '/') return `${BASE_PATH}/`;
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}

export function absoluteSiteUrl(path: string) {
  if (/^https?:/.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
