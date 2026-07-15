import { pageContent } from '@original/content';
import type { Metadata } from 'next';
import '@/components/listing.css';
import { PageHeader } from '@/components/page-header';
import { SITE_URL, withBasePath } from '@/data/site';
import { getAllPosts, getAllTags } from '@/lib/posts';

export const metadata: Metadata = {
  title: pageContent.tags.title,
  description: pageContent.tags.metadataDescription,
  alternates: { canonical: `${SITE_URL}/tags/` },
};

export default function TagsPage() {
  const tags = getAllTags();
  const tagMap = new Map(tags.map((tag) => [tag.tag, tag]));
  const used = new Set<string>(
    pageContent.tags.groups.flatMap((group) => group.tags),
  );
  const visibleGroups = pageContent.tags.groups
    .map((group) => ({
      ...group,
      tags: group.tags.map((tag) => tagMap.get(tag)).filter(Boolean),
    }))
    .filter((group) => group.tags.length > 0);
  const other = tags.filter((tag) => !used.has(tag.tag));

  return (
    <main id="main-content" className="page-shell">
      <PageHeader
        eyebrow={`${tags.length} topics · ${getAllPosts().length} notes`}
        title={pageContent.tags.title}
        description={pageContent.tags.listingDescription}
      />
      <div className="tag-sections">
        {visibleGroups.map((group) => (
          <section className="tag-section" key={group.title}>
            <div>
              <h2>{group.title}</h2>
              <p>{group.description}</p>
            </div>
            <div className="tag-cloud">
              {group.tags.map(
                (tag) =>
                  tag && (
                    <a
                      className="tag"
                      key={tag.tag}
                      href={withBasePath(
                        `/tags/${encodeURIComponent(tag.tag)}/`,
                      )}
                    >
                      {tag.tag} <small>{tag.count}</small>
                    </a>
                  ),
              )}
            </div>
          </section>
        ))}
        {other.length > 0 && (
          <section className="tag-section">
            <div>
              <h2>{pageContent.tags.otherTitle}</h2>
              <p>{pageContent.tags.otherDescription}</p>
            </div>
            <div className="tag-cloud">
              {other.map((tag) => (
                <a
                  className="tag"
                  key={tag.tag}
                  href={withBasePath(`/tags/${encodeURIComponent(tag.tag)}/`)}
                >
                  {tag.tag} <small>{tag.count}</small>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
