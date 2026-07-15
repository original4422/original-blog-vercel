# 双版本上线验收清单

> 状态说明：本文保留迁移前两仓库上线验收及历史证据。2026-07-15 的最终迁移基线已更新到 [`migration/baselines.md`](migration/baselines.md)；monorepo、共享内容、本地双构建和自动化门禁已经建立，但生产设置迁移、新 Pages 发布与灾备切换尚未验收，不能根据本文旧勾选项宣称新架构已经正式上线。

本文是 Goal 完成审计的权威清单。只有两套站点均满足对应条目并有当前证据时，Goal 才能标记完成。

## 共同要求

- [x] 首页高保真保留参考站的 Hero 流体背景、个人介绍、滚动 Intro、项目 Works 舞台和 Contact。
- [x] `/blog`、`/tags`、`/projects`、`/about` 与至少一篇文章详情、一个标签详情、一个项目详情可访问。
- [x] 作者身份使用 `original`；除许可证和源码归属外，不残留原作者域名、邮箱、社交账号、文章或项目素材。
- [x] 深色/浅色主题可切换并持久化；桌面和移动导航均可使用。
- [x] 搜索能加载静态/动态索引、匹配占位文章并跳转。
- [x] MDX、代码高亮、KaTeX、文章目录/阅读进度等保留功能正常。
- [x] `robots.txt`、`sitemap.xml`、`feed.xml`、Canonical 与 Open Graph 元数据指向各自正式站点。
- [x] 保留 MIT 许可证原版权声明，并在 README 说明基于参考仓库改造。
- [x] 依赖检查与生产构建通过，无未处理的关键控制台错误或资源 404。
- [x] 以桌面和移动视口完成视觉检查，主要内容不溢出、不遮挡、无明显布局退化。

## GitHub + Vercel 版本

- [x] 本地 `pnpm check` 与 `pnpm build` 通过。
- [x] 源码推送至 `https://github.com/original4422/original-blog-vercel`。
- [x] Vercel 项目连接该 GitHub 仓库和 `main` 生产分支。
- [x] 生产部署成功，正式网址 HTTP 200，关键路由逐一验证。
- [x] Vercel 后续提交能够触发自动部署。

## GitHub Pages 版本

- [x] Next.js 静态导出成功，`out/` 包含关键页面、搜索索引、Feed、Sitemap 和 404。
- [x] 源码推送至 `https://github.com/original4422/original-blog-pages`。
- [x] `.github/workflows/` 的 Pages 工作流成功完成。
- [x] `https://original4422.github.io/original-blog-pages/` HTTP 200，所有内部链接和静态资源适配仓库前缀。
- [x] 后续提交能够触发 GitHub Actions 并更新 Pages。

## 最终证据

验收时间：`2026-07-11 14:06 CST`（Asia/Shanghai）。

### GitHub + Vercel

- 正式网址：`https://original-blog-vercel.vercel.app/`
- 源码提交：`1f1880bb4efabf1a249f59f46c8ac7a31ac8dd69`
- GitHub Deployment：`5401280909`，状态 `success`；Vercel deployment
  `dpl_E1cjvmtUajxK1bP4MAFFAtvg8ePg`，状态 `Ready`，稳定 alias 已指向该部署。
- GitHub 推送自动触发生产部署；不是仅使用本地 CLI 上传。
- `pnpm check`、`pnpm typecheck`、Node 24 生产构建（31 页）及
  `pnpm audit --prod` 均通过，生产依赖为零已知漏洞。
- 最终 `verify-site.sh`：`17 passed, 0 failed`；24 条 Sitemap URL、4 条 Feed
  item、4 条搜索记录均有效。

### GitHub Pages

- 正式网址：`https://original4422.github.io/original-blog-pages/`
- 源码提交：`fe2ee811917ed59421d99aa4241a193df28accc3`
- GitHub Actions run：`29142197893`，由 push 自动触发；build 与 deploy 两个
  job 均成功，升级后的官方 Action 主版本无 Node 20 弃用注解。
- `pnpm check`、Next.js 静态导出（26 个生成页面）、静态审计（24 条公开路由、
  8 条搜索记录、11 个标签页）及 `pnpm audit --prod` 均通过。
- 最终 `verify-site.sh`：`17 passed, 0 failed`；24 条 Sitemap URL、4 条 Feed
  item、8 条搜索记录均有效。

### 视觉、交互与身份证据

- 相同生产构建在 `1440×900` 与 `390×844` 完成浏览器检查：两版均无横向溢出，
  Hero → Intro → Works → Contact 顺序正确；搜索筛选和详情跳转、深浅主题刷新持久化、
  桌面/移动导航均通过，控制台无站点错误。
- Vercel 示例验证了代码高亮、KaTeX、GFM 表格和文章目录；Pages 示例验证了代码、
  KaTeX、表格、目录及移动端局部滚动。
- 生产 HTML 再验证 Hero 文案；Vercel 首页 32 个、Pages 首页 17 个引用资源逐一返回
  200。生产浏览器控制连接本身连续超时，因此生产显示结论由“当前部署 SHA 与本地
  浏览器构建一致 + 线上 HTML/资源逐一验证”交叉证明，而非声称完成了未执行的在线截图。
- 特殊标签 `C++`、中文、含空格及 `Next.js` 均线上 200；代表性 Canonical 精确匹配。
- 两仓库工作区干净，`HEAD == origin/main`；源码身份扫描仅在 LICENSE、README 与
  DECISIONS 的合法归属说明中出现上游名称，MIT 原版权声明保留。
