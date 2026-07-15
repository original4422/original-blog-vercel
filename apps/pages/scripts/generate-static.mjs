import fs from 'node:fs';
import path from 'node:path';
import { projects, siteContent } from '@original/content';
import { getAllPosts, postBodyForSearch } from '@original/content/server';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const basePath = (
  process.env.NEXT_PUBLIC_BASE_PATH ?? '/original-blog-pages'
).replace(/\/$/, '');
const siteUrl = (
  process.env.SITE_URL ?? 'https://original4422.github.io/original-blog-pages'
).replace(/\/$/, '');

const escapeXml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const posts = getAllPosts().map((post) => ({
  slug: post.slug,
  title: post.metadata.title,
  date: post.metadata.publishedAt,
  summary: post.metadata.summary,
  tags: post.metadata.tags,
  body: postBodyForSearch(post.content),
}));

const searchIndex = [
  ...posts.map((post) => ({
    type: 'post',
    title: post.title,
    summary: post.summary,
    tags: post.tags,
    body: post.body,
    url: `/blog/${post.slug}/`,
  })),
  ...projects.map((project) => ({
    type: 'project',
    title: project.title,
    summary: project.summary,
    tags: project.techStack.flatMap((group) => group.items),
    url: `/projects/${project.slug}/`,
  })),
];

const allTags = [...new Set(posts.flatMap((post) => post.tags))].sort();
const staticPaths = ['/', '/blog/', '/tags/', '/projects/', '/about/'];
const articlePaths = posts.map((post) => `/blog/${post.slug}/`);
const projectPaths = projects.map((project) => `/projects/${project.slug}/`);
const tagPaths = allTags.map((tag) => `/tags/${encodeURIComponent(tag)}/`);
const sitemapPaths = [
  ...staticPaths,
  ...articlePaths,
  ...projectPaths,
  ...tagPaths,
];

const rssItems = posts
  .map(
    (post) => `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${siteUrl}/blog/${encodeURIComponent(post.slug)}/</link>
    <guid isPermaLink="true">${siteUrl}/blog/${encodeURIComponent(post.slug)}/</guid>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <description>${escapeXml(post.summary)}</description>
    ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('')}
  </item>`,
  )
  .join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(siteContent.name)}</title>
  <link>${siteUrl}/</link>
  <description>${escapeXml(siteContent.description)}</description>
  <language>${escapeXml(siteContent.language)}</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${rssItems}
</channel>
</rss>
`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPaths
  .map((route) => `  <url><loc>${escapeXml(`${siteUrl}${route}`)}</loc></url>`)
  .join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: ${basePath}/

Sitemap: ${siteUrl}/sitemap.xml
`;

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(
  path.join(publicDir, 'search-index.json'),
  `${JSON.stringify(searchIndex, null, 2)}\n`,
);
fs.writeFileSync(path.join(publicDir, 'feed.xml'), rss);
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);
fs.writeFileSync(
  path.join(publicDir, 'static-routes.json'),
  `${JSON.stringify({ basePath, siteUrl, tags: allTags, paths: sitemapPaths }, null, 2)}\n`,
);
fs.writeFileSync(path.join(publicDir, '.nojekyll'), '');

console.log(
  `Generated static assets for ${posts.length} posts, ${allTags.length} tags and ${projects.length} projects.`,
);
