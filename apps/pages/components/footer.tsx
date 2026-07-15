import { pageContent } from '@original/content';
import Link from 'next/link';
import { siteConfig, withBasePath } from '@/data/site';

export function Footer() {
  return (
    <footer className="site-footer">
      <Link href="/" className="footer-signature display">
        original<span>.</span>
      </Link>
      <p>{pageContent.footer.tagline}</p>
      <div className="footer-links">
        {siteConfig.socials.map((item) => (
          <a key={item.label} href={item.href} rel="noreferrer">
            {item.label}
          </a>
        ))}
        <a href={withBasePath('/feed.xml')}>RSS</a>
      </div>
      <small>
        © {new Date().getFullYear()} {siteConfig.name} ·{' '}
        {pageContent.footer.copyrightSuffix}
      </small>
    </footer>
  );
}
