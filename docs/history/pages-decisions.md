# GitHub Pages 版本：重要决策记录

最后更新：2026-07-11

## 1. 以权威上游提交为设计基线

**决定**：以 `yunshenwuchuxun/yunshen-blogv1` 的 `dfbd51a88ea04423c9c2e13ee83e9eec8b44e480` 为审计基线，复现其“Hero → Intro → Works → Contact”首页叙事，以及 Blog、Tags、Projects、About、搜索和主题系统。

**理由**：锁定提交能避免上游继续变化导致两个本地版本的设计口径漂移，也让归属和后续差异审计可复现。

## 2. 复用体验方向，不复制个人内容

**决定**：保留黑白反差、`#de1d8d` 洋红点色、流体背景、滚动宣言、Sticky 项目舞台等体验；作者统一为 `original`。文章、项目文案、联系方式与图片均为新写的明确占位内容，视觉资源全部使用本项目自制 SVG。

**理由**：MIT 允许代码使用与修改，但个人文章和项目素材不应被当成模板内容。内容隔离同时让用户后续替换更简单。

## 3. 采用 Next.js App Router 静态导出

**决定**：配置 `output: 'export'`、`trailingSlash: true`，所有动态文章、标签、项目路径提供 `generateStaticParams()`，不使用 Route Handler、Server Action、数据库或运行时服务器。

**理由**：GitHub Pages 只能托管静态文件。构建期完整枚举路由可保留 Next.js 的组件与元数据体验，同时得到可直接发布的 `out/`。

## 4. 固定项目站点子路径

**决定**：正式 `basePath` 与 `assetPrefix` 默认均为 `/original-blog-pages`。`next/link` 的页面路由保留站内根路径，由 Next.js 自动添加 `basePath`；只有浏览器 `fetch`、原生资源 URL 和 `next/image` 静态资源通过统一的 `withBasePath()` 处理。

**理由**：仓库不是 `<username>.github.io` 用户站点，而是项目站点；同时 Next.js 会自动处理 `Link`，若再手工添加会产生双重前缀。职责分开既避免资源 404，也避免导航出现 `/original-blog-pages/original-blog-pages/`。

带点号或特殊字符的标签链接例外使用原生 `<a>` 与完整前缀，避免 `Next.js` 这类末段被客户端路由规范化为文件路径并移除尾斜杠。

## 5. 构建前生成静态发布资产

**决定**：`scripts/generate-static.mjs` 在 `next build` 前解析本地 MDX frontmatter，生成 `search-index.json`、`feed.xml`、`sitemap.xml` 与 `robots.txt`；搜索由 Fuse.js 在浏览器端完成。

**理由**：参考项目的 `/api/search-index` 依赖服务器，不适用于 Pages。构建期生成让搜索与 SEO 文件无需运行时计算，也能被自动审计。

## 6. 图片使用静态、无优化模式

**决定**：Next Image 设置 `unoptimized: true`，项目图使用体积小、可缩放的本地 SVG，并提供明确尺寸与替代文本。

**理由**：Next.js 默认图片优化需要服务端。SVG 既避免该依赖，又适合当前占位阶段并能保持 Retina 屏清晰度。

## 7. 保留高影响动画，同时尊重可访问性

**决定**：使用 Motion/GSAP/Lenis 保留首页滚动体验，导航、搜索和主题切换保持键盘可用；在 `prefers-reduced-motion` 下关闭持续动画和平滑滚动。

**理由**：动画是参考站辨识度的重要部分，但不能以眩晕、不可聚焦或移动端性能为代价。

## 8. 仅由 GitHub Actions 发布

**决定**：提交到 `main` 后，官方 Pages actions 构建、上传 `out/` 并发布；工作流使用最小写权限和并发取消。

**理由**：将本地环境差异降到最低，发布记录可审计，也避免将生成物手工提交到分支。

## 9. 动态标签参数保持原始值

**决定**：`generateStaticParams()` 返回原始 tag，不调用 `encodeURIComponent()`；只在生成 URL 时编码。构建验收显式覆盖 `Paper Notes`、`中文写作` 与 `C++`。

**理由**：Next.js 会负责动态参数的 URL 编码。预编码会让构建参数与请求解码后的值不一致，导致含空格、中文或 `+` 的标签在直接刷新时 404。

## 10. 图标本身不创建交互节点

**决定**：Lucide 图标只渲染为 `svg`，点击语义和键盘焦点全部由唯一的外层 `a` 或 `button` 提供。

**理由**：避免 `a > button`、`button > button` 等非法嵌套，防止 React hydration 警告，也使辅助技术读取到单一、明确的交互控件。

## 11. 发布前保持生产依赖零已知漏洞

**决定**：使用 Next.js `16.2.10`，并通过 pnpm override 将 Next.js 的精确传递依赖 PostCSS 固定为已修复的 `8.5.16`；发布前执行 `pnpm audit --prod`。

**理由**：初始版本落入多个已修复的安全公告区间；GitHub Pages 虽然只发布静态产物，构建供应链仍应使用无已知漏洞的依赖。

**影响**：依赖更新后必须重新通过静态导出、路由审计和桌面/移动浏览器回归；当前生产依赖审计为零已知漏洞。

## 12. Pages 发布源固定为 GitHub Actions

**决定**：仓库 Pages 设置使用 `build_type: workflow`，只由 `main` 分支上的 `.github/workflows/deploy-pages.yml` 构建和发布，不维护手工 `gh-pages` 分支。

**理由**：源码提交、构建日志、静态审计与部署记录能够绑定到同一 SHA；避免本地生成物和线上状态脱节。

**影响**：首次创建仓库时必须先启用 Pages 的 GitHub Actions 发布源；之后每次推送 `main` 都会自动运行 build 与 deploy 两阶段。

## 13. 工作流使用当前 Node 24 兼容的官方 Action 主版本

**决定**：使用 `actions/checkout@v7`、`actions/setup-node@v6`、`actions/configure-pages@v6`、`actions/upload-pages-artifact@v5`、`actions/deploy-pages@v5` 与 `pnpm/action-setup@v6`。

**理由**：旧主版本仍声明 Node 20 运行时，会被 GitHub Actions 强制切换并产生弃用警告；当前官方稳定主版本与工作流显式 Node 24 保持一致。

**影响**：升级 Action 主版本后必须由真实 push 完成 build + deploy 两阶段验证，不能仅依赖 YAML 静态检查。
