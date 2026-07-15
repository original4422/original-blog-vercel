import { pageContent } from '@original/content';
import type { Metadata } from 'next';
import '@/components/listing.css';
import { PageHeader } from '@/components/page-header';
import { SITE_URL } from '@/data/site';

export const metadata: Metadata = {
  title: pageContent.about.eyebrow,
  description: pageContent.about.metadataDescription,
  alternates: { canonical: `${SITE_URL}/about/` },
};

export default function AboutPage() {
  return (
    <main id="main-content" className="page-shell">
      <PageHeader
        eyebrow={pageContent.about.eyebrow}
        title={pageContent.about.title}
        description={pageContent.about.lede}
      />
      <div className="about-grid">
        <div className="about-intro">
          {pageContent.about.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <aside className="about-aside">
          <section>
            <h2>Now</h2>
            <ul>
              {pageContent.about.now.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Profile</h2>
            <ul>
              {pageContent.about.profile.map((item) => (
                <li key={item.label}>
                  {item.label}：{item.value}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Blog History</h2>
            {pageContent.about.history.map((item) => (
              <p key={item.year}>
                <strong>{item.year}：</strong>
                {item.body}
              </p>
            ))}
          </section>
        </aside>
      </div>
    </main>
  );
}
