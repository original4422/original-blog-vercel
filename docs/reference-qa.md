# 参考站高保真 QA 规范

基准：`https://uestc.de5.net/` 与上游 `yunshenwuchuxun/yunshen-blogv1@dfbd51a88ea04423c9c2e13ee83e9eec8b44e480`。

## 页面与路由

- 首页顺序必须为 Hero → 黑白反转 Intro → 4 段 sticky Works → Contact。
- `/blog`、文章详情、`/tags`、标签详情、`/projects`、项目详情、`/about` 和定制 404 均需直达、刷新可用。
- Vercel 搜索使用 `/api/search-index`；Pages 使用构建期静态 JSON。
- 所有列表项必须进入相应详情页。
- 标签静态参数必须返回原始 tag，不能提前 `encodeURIComponent`；覆盖含空格、中文、`C++` 等特殊标签，避免参考站现有的双重编码 404。

## 视觉基准

- 主色以 `#de1d8d` 为核心；黑/白大色块、neutral 灰、洋红选区。
- 全局 Mukta，Hero 和横线页标题使用 Merriweather。
- 桌面导航固定、半透明并带 blur；内容页 `max-w-5xl`；Hero/Contact 至少 100svh。
- 1440×900：Works 左黑右白 1:1；390×844：两行移动导航、Works 30vh/70vh、无横向溢出。
- 明暗主题逐页抽查并验证刷新后保持。

## 动画与交互

- Hero WebGL 流体画布响应鼠标/触摸，正文与导航可交互；无 WebGL 时文字仍可读。
- 下箭头滚动到 Intro；Intro 三段文字按滚动依次由 0.2 到 1。
- Works 高度为项目数×100vh；sticky 舞台、标题与叠放预览卡按屏淡入/位移/退出。
- 搜索支持按钮、Cmd/Ctrl+K、中文 IME、循环方向键、Enter、Esc、遮罩关闭、焦点恢复和 loading/error/empty 状态。
- 主题切换优先使用右上圆形 View Transition，且必须有不支持时的回退。
- 修复上游鼠标监听与 WebGL RAF/资源未清理的问题，避免 SPA 往返累积。
- 图标组件只提供 `span/svg` 视觉；交互语义只放在唯一外层 `a` 或 `button`，禁止上游现有的 `a > button`、`button > button` 非法嵌套和 hydration/a11y 警告。

## MDX

- Frontmatter：`title,publishedAt,summary,draft,tags`，可选 `image`；draft 不进入列表、标签、搜索、Sitemap 和 RSS。
- 示例文章覆盖 H2/H3 锚点、GFM 表格、KaTeX、代码块、列表、引用、内外链和图片。
- 数学公式、表格和代码在手机上局部滚动，不使页面整体溢出。
- 文章详情含阅读进度、标题、日期、封面和正确 metadata。

## SEO 与静态文件

- `<html lang="zh-CN">`，站点名和 author 为 `original`。
- metadataBase、Canonical、OG/Twitter、robots、Sitemap 和 Feed 使用各版本最终生产 URL。
- `/feed.xml` 必须为可解析 XML；参考站声明了 Feed 但实际 404，不能复刻该缺陷。
- Sitemap 包含首页、栏目页和所有文章/标签/项目详情。
- favicon 200；未知路径返回真实 404。

## 身份与许可证清理

除 LICENSE 和 README 源码归属外，以下扫描必须无命中：

```bash
rg -ni 'Yun Shen|yunshen|uestc|yunshen\.eu\.cc|de5\.net|qq\.com|bilibili|linux\.do|dlarroder' . \
  --glob '!LICENSE' --glob '!pnpm-lock.yaml' --glob '!README.md' --glob '!DECISIONS.md'
```

- 原 MIT LICENSE 的真实声明为 `Copyright (c) 2022 Dale Larroder`，必须保留。
- 不复制原作者文章、头像、论文资料、项目截图和个人链接。
- README 说明基于上游改造，并区分代码许可证与本站内容/素材归属。

## 平台特定要求

### Vercel

- `pnpm check && pnpm build` 通过。
- Production 连接正确 GitHub repo/main；正式 alias 稳定。
- `/api/search-index` 返回至少一篇文章的结构化 JSON。
- Next Image、Analytics 与 Speed Insights 仅按生产配置工作。

### GitHub Pages

- `output:'export'`、`images.unoptimized:true`、`trailingSlash:true`。
- `basePath/assetPrefix:'/original-blog-pages'`，所有动态 slug 使用 `generateStaticParams()`。
- 静态搜索 JSON 与所有图片/链接均感知 basePath。
- Actions 权限最小化：`contents:read`、`pages:write`、`id-token:write`；上传 `out/`，包含 `.nojekyll`。
- 深层详情 URL 直接刷新，资源不得错误请求站点根 `/static/...`。

## 最终检查

```bash
pnpm check
pnpm build
```

两个生产 URL 均跑首页、栏目页、详情页、robots、sitemap、feed、404 的 HTTP 状态矩阵。浏览器使用 1440×900 与 390×844，检查明暗主题、滚动锚点、搜索、Console 和意外 4xx/5xx，并在相同视口/主题/滚动位置与参考站截图对照。
