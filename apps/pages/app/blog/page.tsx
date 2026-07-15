import { pageContent } from '@original/content';
import type { Metadata } from 'next';
import '@/components/listing.css';
import { PageHeader } from '@/components/page-header';
import { PostList } from '@/components/post-list';
import { SITE_URL } from '@/data/site';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: pageContent.blog.title,
  description: pageContent.blog.metadataDescription,
  alternates: { canonical: `${SITE_URL}/blog/` },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main id="main-content" className="page-shell">
      <PageHeader
        eyebrow={`${posts.length} published notes`}
        title={pageContent.blog.title}
        description={pageContent.blog.listingDescription}
      />
      <PostList posts={posts} />
    </main>
  );
}
