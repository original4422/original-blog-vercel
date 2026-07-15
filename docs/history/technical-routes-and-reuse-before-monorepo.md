# 双版本技术路线与开源项目复用说明

> 历史文档：本文描述 2026-07-11 时两个独立仓库的技术路线。关于继续分别维护、不要合并仓库等建议已被 ADR-0007 至 ADR-0012 取代，只用于理解迁移前状态和复用来源。

最后更新：2026-07-11

## 一句话结论

- **GitHub + Vercel 版**是对上游项目原生 Next.js/Vercel 路线的深度改造版：产品形态、页面组织、核心动效和一部分组件结构与上游关系最紧密，在此基础上完成身份替换、内容重建、缺陷修复、SEO 与部署加固。
- **GitHub Pages 版**是以相同产品体验为目标的静态化重新实现：视觉与信息架构高度参考上游，但组件代码、样式组织、搜索、Feed、Sitemap 和部署流程主要为本站重新编写。
- 两个目录是**两个独立代码仓库**，不是同一套源码切换一个构建开关；后续新增文章、项目或通用功能时，需要分别维护或主动同步。

## 参考基线与复用边界

参考项目为 [`yunshenwuchuxun/yunshen-blogv1`](https://github.com/yunshenwuchuxun/yunshen-blogv1)，审计和复现基线固定在提交：

```text
dfbd51a88ea04423c9c2e13ee83e9eec8b44e480
```

两个版本都保留上游 MIT 许可证及其原版权声明。复用边界是“复用通用代码和体验，不复制个人身份与内容”：

- 保留或参考：页面信息架构、首页叙事、黑白高反差、`#de1d8d` 洋红强调、流体背景、滚动 Intro、Sticky Works、搜索、主题、MDX 内容系统。
- 不复用：原作者姓名、域名、邮箱、社交账号、文章、论文、项目说明、头像、截图及其他个人媒体。
- 本站新增：作者 `original`、示例文章与项目、自制 SVG、生产 URL 配置、完整 Feed/Sitemap/Canonical、静态部署适配、自动验收和安全依赖约束。

本文同时给出定性等级和百分比，方便直观比较。百分比是基于产品体验、组件代码、运行架构和部署工程四个维度的**工程估算值**，不是逐行代码相似度，也不能替代许可证或版权判断。

## 共同产品与前端基线

两个版本共同实现以下产品能力：

- 首页按照 Hero → Intro → 四段 Works → Contact 组织叙事。
- Blog、Tags、Projects、About 及文章、标签、项目详情页。
- Next.js App Router、React、TypeScript、pnpm 与文件型 MDX。
- GFM、KaTeX、Shiki 代码高亮、文章目录和阅读进度。
- Fuse.js 搜索、深浅主题、响应式导航及 `prefers-reduced-motion` 降级。
- `zh-CN` 语言标记、`original` 作者身份、Metadata、Open Graph、robots、Sitemap 与 `feed.xml`。
- 内容和图片均可在不引入 CMS 或数据库的情况下直接通过 Git 提交更新。

## 两个版本的技术路线对照

| 维度 | GitHub + Vercel 版 | GitHub Pages 版 |
| --- | --- | --- |
| 代码根目录 | `github-vercel/` | `github-pages/` |
| 生产地址 | `https://original-blog-vercel.vercel.app/` | `https://original4422.github.io/original-blog-pages/` |
| 运行模型 | Vercel 上的原生 Next.js 运行时 | `next build` 导出的纯静态文件 |
| Node.js | 生产环境固定为 Node 24.x | GitHub Actions 使用 Node 24 |
| 路由 | App Router；静态页面与 Route Handler 并存 | 所有公开页面在构建期生成；动态段必须枚举 `generateStaticParams()` |
| 搜索 | `/api/search-index` Route Handler 动态提供索引 | 构建前生成 `search-index.json`，浏览器加载后使用 Fuse.js |
| Feed | `app/feed.xml/route.ts` 在运行时响应并缓存 | `scripts/generate-static.mjs` 在构建期写出 `feed.xml` |
| Sitemap/robots | Next.js Metadata Route | 构建脚本生成普通静态文件 |
| 图片 | `next/image`，允许 Vercel 图片优化 | `next/image` 的 `unoptimized: true`，直接发布本地 SVG |
| URL 结构 | 部署在域名根路径 | 固定项目子路径 `/original-blog-pages`，配置 `basePath` 与 `assetPrefix` |
| 分析能力 | Vercel Analytics 与 Speed Insights | 不包含运行时分析服务 |
| 发布链路 | GitHub `main` → Vercel Git 集成 → Production | GitHub `main` → Actions 构建/审计 → Pages artifact → deploy |
| 服务器/密钥 | 需要 Vercel Next.js 运行时，但不需要数据库或业务密钥 | 不需要服务器、数据库或运行时密钥 |

## GitHub + Vercel 版技术路线

发布链路可以概括为：

```text
MDX / 项目配置 / React 组件
          ↓
Next.js 16 App Router + Node 24
          ↓
GitHub main 分支
          ↓
Vercel 自动构建与 Production alias
```

这一版尽量保留参考项目的原生运行方式，因此也是两版中与上游代码结构最接近的一版。

主要实现包括：

- `app/blog/posts/*.mdx` 保存文章，frontmatter 使用 `publishedAt`、`draft`、`image`、`tags` 等字段。
- `app/api/search-index/route.ts` 输出搜索数据；`app/feed.xml/route.ts` 输出 RSS。
- `app/components/splash-cursor.tsx`、`app/components/work/`、搜索弹窗、主题切换和 Lenis/GSAP/Motion 共同构成参考站式的流体首屏与滚动项目舞台。
- `site.config.ts` 集中管理作者、域名和社交链接，并根据 Vercel Production URL 生成 Canonical、Feed 与 Sitemap 地址。
- `next/image` 保留运行时优化；生产环境启用 Vercel Analytics 和 Speed Insights。
- Next.js、PostCSS 与 YAML 被固定到已审计的安全版本，生产 Node.js 固定在 24.x。

适合的场景：希望最大限度保留参考项目的原生体验、接受 Vercel 托管，并可能继续使用 Next.js 服务器能力。

## GitHub Pages 版技术路线

发布链路可以概括为：

```text
MDX / 项目数据 / React 组件
          ↓
构建前生成搜索、Feed、Sitemap、robots
          ↓
Next.js output: export → out/
          ↓
GitHub Actions 审计并上传 artifact
          ↓
GitHub Pages 静态托管
```

这一版把参考项目中依赖服务器的部分全部改造成构建期或浏览器端能力：

- `output: 'export'`、`trailingSlash: true`、`images.unoptimized: true`。
- `basePath` 和 `assetPrefix` 固定为 `/original-blog-pages`，解决项目站点不在域名根路径的问题。
- `content/posts/*.mdx` 保存文章，frontmatter 使用 `date`、`featured`、`tags` 等字段。
- `scripts/generate-static.mjs` 生成搜索索引、Feed、Sitemap、robots、路由清单和 `.nojekyll`。
- `scripts/audit-static.mjs` 检查公开路由、特殊标签、搜索数据、双重 base path、Feed 和关键静态产物。
- 首页流体效果、Works、导航、搜索和主题组件由 `components/` 下的代码重新实现；样式主要由独立 CSS 文件控制。
- GitHub Actions 使用最小权限完成 build 与 deploy，不维护手工 `gh-pages` 分支。

适合的场景：希望只依赖 GitHub、长期维护成本低、没有服务器运行时，并接受所有动态能力都必须静态化。

## 相对于上游项目的参考与复用程度

为了避免把“看起来相似”和“直接复用了代码”混为一谈，这里先区分三个指标：

| 汇总指标 | GitHub + Vercel 版 | GitHub Pages 版 | 含义 |
| --- | ---: | ---: | --- |
| 产品与体验参考对齐度 | **92%** | **88%** | 信息架构、视觉语言、页面顺序和交互体验与上游的一致程度 |
| 上游代码直接复用度 | **60%** | **15%** | 当前实现直接继承上游组件、模块组织或具体实现后再修改的程度 |
| 综合参考/复用指数 | **约 70%** | **约 40%** | 同时考虑体验、代码、运行架构和部署工程后的总体值 |

综合指数采用以下权重：产品与体验 30%、组件与代码 35%、运行架构与内容管线 20%、部署/SEO/质量工程 15%。取整过程如下：

```text
Vercel：92% × 30% + 60% × 35% + 80% × 20% + 20% × 15%
       = 67.6%，取整为约 70%

Pages： 88% × 30% + 15% × 35% + 30% × 20% + 10% × 15%
       = 39.15%，取整为约 40%
```

各层面的估算如下：

| 层次 | GitHub + Vercel 版 | GitHub Pages 版 | 说明 |
| --- | --- | --- | --- |
| 产品定位与信息架构 | 高（95%） | 高（95%） | 都复现个人数字花园、四个一级栏目和详情页体系 |
| 首页视觉与叙事顺序 | 高（90%） | 高（85%） | 都对齐 Hero、Intro、Works、Contact 与洋红强调 |
| 动效思想 | 高（90%） | 高（80%） | 都保留流体背景、滚动叙事和 Sticky Works |
| 上游组件/模块结构 | 中高（70%） | 低（20%） | Vercel 版保留较多相近模块和组织方式；Pages 版主要重写 |
| 上游代码直接继承后修改 | 中高（60%） | 低（15%） | Vercel 版属于深度改造；Pages 版以行为复现为主 |
| Next.js/Vercel 原生架构 | 高（85%） | 低（20%） | Vercel 版继续使用原生运行时；Pages 版改为静态导出 |
| MDX 内容思路 | 高（80%） | 中（50%） | 两版都使用文件型 MDX，但 Pages 版解析、字段和生成流程另写 |
| 搜索与 Feed 实现 | 中高（70%） | 低（15%） | Vercel 版保留服务器式思路；Pages 版完全静态化重写 |
| 文章、项目和个人媒体 | 无（0%） | 无（0%） | 两版均使用本站占位内容和自制视觉资源 |
| SEO、部署与验收加固 | 低（20%） | 低（10%） | 正式 URL、Feed、Canonical、特殊标签与自动验收主要由本站新建 |

因此更直观地说：**Vercel 版综合参考/复用程度约 70%，属于“代码和体验都复用后深改”；Pages 版约 40%，属于“体验高度参考、代码主要重构”。**

## 没有照搬的缺陷与本站修正

对齐参考站不意味着复刻其缺陷。两个版本共同处理了以下问题：

- 参考站声明 RSS 但实际 Feed 路由不可用；本站统一提供可解析的 `/feed.xml`。
- 标签值提前编码会导致空格、中文或 `C++` 路由异常；本站保留原始静态参数并在 URL 边界编码。
- 上游图标组件可能形成 `a > button` 或 `button > button`；本站把交互语义收敛到唯一外层节点。
- 清理 WebGL、滚动监听和动画资源，增加 reduced-motion 与无 WebGL 降级。
- 把散落的作者、域名和语言元数据改为 `original` 与 `zh-CN`，并集中管理生产 URL。
- 增加真实 404、Canonical、Open Graph、Sitemap、Feed、搜索索引和线上路由矩阵验收。
- 更新依赖和 CI Action，生产依赖审计保持零已知漏洞。

## 后续维护时需要注意

1. 两版文章目录和 frontmatter 字段不同，当前占位文章也不是逐篇完全相同；替换真实内容时需要分别更新，或另行设计共享内容源。
2. 通用视觉或交互修复不会自动同步。修改一版后，应判断另一版是否存在同类问题并分别验证。
3. 不建议把两版重新合成大量条件分支的单仓库构建；服务器能力、图片、base path、搜索和 Feed 的差异会让维护边界变得模糊。
4. 如果未来只保留一个版本：优先原生能力和扩展性可选 Vercel；优先零服务器与纯 GitHub 托管可选 Pages。
5. 新增内容或功能后，两版都应重新执行本地构建及根目录的 `scripts/verify-site.sh` 线上验收。

## 相关文件

- Vercel 版完整决策：[`github-vercel/DECISIONS.md`](github-vercel/DECISIONS.md)
- Pages 版完整决策：[`github-pages/DECISIONS.md`](github-pages/DECISIONS.md)
- 双版本架构 ADR：[`docs/adr/0003-maintain-two-deployment-versions.md`](docs/adr/0003-maintain-two-deployment-versions.md)
- 最终上线证据：[`docs/acceptance.md`](docs/acceptance.md)
- 部署与复检手册：[`docs/deployment-runbook.md`](docs/deployment-runbook.md)
