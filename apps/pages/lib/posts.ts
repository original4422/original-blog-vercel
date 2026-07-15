import {
  getAllTags,
  getPost as getCanonicalPost,
  getAllPosts as getCanonicalPosts,
  getPostsByTag as getCanonicalPostsByTag,
  getPostSlugs,
  slugifyHeading,
} from '@original/content/server';

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  featured?: boolean;
  readingTime: string;
};

export type Post = PostMeta & {
  content: string;
  headings: { id: string; text: string; level: number }[];
};

function toPagesPost(
  post: ReturnType<typeof getCanonicalPost>,
): Post | undefined {
  if (!post) return undefined;
  return {
    slug: post.slug,
    title: post.metadata.title,
    date: post.metadata.publishedAt,
    summary: post.metadata.summary,
    tags: post.metadata.tags,
    featured: post.metadata.featured,
    readingTime: post.readingTime,
    content: post.content,
    headings: post.headings,
  };
}

export { getAllTags, getPostSlugs, slugifyHeading };

export function getPost(slug: string) {
  return toPagesPost(getCanonicalPost(slug));
}

export function getAllPosts(): Post[] {
  return getCanonicalPosts().map((post) => toPagesPost(post) as Post);
}

export function getPostsByTag(tag: string): Post[] {
  return getCanonicalPostsByTag(tag).map((post) => toPagesPost(post) as Post);
}
