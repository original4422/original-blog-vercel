# original — GitHub + Vercel 版

`original` 的个人数字花园：个人首页、技术博客与项目作品集。此版本保留
Next.js 的服务端能力，通过 GitHub 托管源码，并由 Vercel 持续部署。

## 功能

- WebGL 流体首屏、Lenis 平滑滚动与滚动驱动的项目舞台
- Blog、Tags、Projects、About 四个一级栏目
- MDX、GFM、KaTeX、Shiki 代码高亮与文章目录
- `⌘/Ctrl + K` Fuse.js 全文搜索（Vercel Route Handler 提供索引）
- 深浅主题、响应式导航、键盘操作及 reduced-motion 降级
- Metadata、Open Graph、Sitemap、Robots 与 RSS
- Vercel Analytics 和 Speed Insights

## 本地运行

需要 Node.js 20.9+ 与 pnpm 10.20.0。

```bash
corepack enable
pnpm install
pnpm dev
```

打开 <http://localhost:3000>。发布前执行：

```bash
pnpm lint
pnpm typecheck
pnpm check
pnpm build
```

## 内容与配置

- 站点身份、域名与社交链接：`site.config.ts`
- 文章：`app/blog/posts/*.mdx`
- 项目：`app/projects/constants.ts`
- 首页项目舞台：`app/components/work/workTiles.ts`
- 占位插图：`public/static/images/`

生产域名按以下顺序解析：`NEXT_PUBLIC_SITE_URL`、Vercel 自动提供的
`VERCEL_PROJECT_PRODUCTION_URL`、本地开发地址。若绑定自定义域名，建议在
Vercel 中设置 `NEXT_PUBLIC_SITE_URL=https://你的域名`。

## 来源与许可

本项目基于 MIT 开源项目
[`yunshenwuchuxun/yunshen-blogv1`](https://github.com/yunshenwuchuxun/yunshen-blogv1)
的 `main` 分支提交
`dfbd51a88ea04423c9c2e13ee83e9eec8b44e480` 改造。保留了其通用布局、动画与
内容系统思路；原作者文章、论文、项目说明和个人媒体均未纳入本项目。

上游仓库携带的 [LICENSE](LICENSE) 已原样保留，其中版权声明为
`Copyright (c) 2022 Dale Larroder`。使用和分发本项目时须继续遵守该 MIT
许可文本。

关键实现选择与理由见 [DECISIONS.md](DECISIONS.md)。
