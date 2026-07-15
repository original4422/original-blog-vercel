import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, 'out');
const manifestPath = path.join(out, 'static-routes.json');

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const requiredFiles = [
  'index.html',
  '404.html',
  '.nojekyll',
  'search-index.json',
  'feed.xml',
  'sitemap.xml',
  'robots.txt',
  'blog/index.html',
  'tags/index.html',
  'projects/index.html',
  'about/index.html',
];

assert(fs.existsSync(out), 'out/ does not exist. Run pnpm build first.');
for (const file of requiredFiles) {
  assert(
    fs.existsSync(path.join(out, file)),
    `Missing static artifact: out/${file}`,
  );
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const homeHtml = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
const tagsHtml = fs.readFileSync(path.join(out, 'tags', 'index.html'), 'utf8');
assert(
  homeHtml.includes('/original-blog-pages/_next/'),
  'Exported assets are not prefixed with /original-blog-pages.',
);
assert(
  !homeHtml.includes('/original-blog-pages/original-blog-pages/'),
  'An internal link contains the base path twice.',
);
assert(homeHtml.includes('我是'), 'Home hero copy missing from export.');
assert(
  tagsHtml.includes('/original-blog-pages/tags/System%20Design/'),
  'The spaced tag route lost its required trailing slash.',
);

const searchIndex = JSON.parse(
  fs.readFileSync(path.join(out, 'search-index.json'), 'utf8'),
);
assert(
  searchIndex.some((item) => item.type === 'post'),
  'Search index has no posts.',
);
assert(
  searchIndex.some((item) => item.type === 'project'),
  'Search index has no projects.',
);

for (const tag of ['Paper Reading', '数字花园', 'C++']) {
  assert(
    manifest.tags.includes(tag),
    `Special tag missing from manifest: ${tag}`,
  );
}

const tagHtmlFiles = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    if (entry.isFile() && entry.name === 'index.html')
      tagHtmlFiles.push(fullPath);
  }
};
walk(path.join(out, 'tags'));

for (const tag of ['Paper Reading', '数字花园', 'C++']) {
  const tagPage = path.join(out, 'tags', tag, 'index.html');
  assert(fs.existsSync(tagPage), `Missing exported tag route: ${tag}`);
  const tagHtml = fs.readFileSync(tagPage, 'utf8');
  assert(
    !tagHtml.includes('id="__next_error__"') && tagHtml.includes(`#${tag}`),
    `Exported tag route rendered an error page: ${tag}`,
  );
}

for (const route of manifest.paths.filter(
  (item) => item.startsWith('/blog/') && item !== '/blog/',
)) {
  const slug = route.split('/').filter(Boolean).at(-1);
  assert(
    fs.existsSync(path.join(out, 'blog', slug, 'index.html')),
    `Missing article route: ${route}`,
  );
}
for (const route of manifest.paths.filter(
  (item) => item.startsWith('/projects/') && item !== '/projects/',
)) {
  const slug = route.split('/').filter(Boolean).at(-1);
  assert(
    fs.existsSync(path.join(out, 'projects', slug, 'index.html')),
    `Missing project route: ${route}`,
  );
}

console.log(
  `Static audit passed: ${manifest.paths.length} routes, ${searchIndex.length} search records, ${tagHtmlFiles.length - 1} tag pages.`,
);
