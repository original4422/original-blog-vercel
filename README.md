# original — Personal Digital Garden

`original` 的个人数字花园：个人首页、技术博客与项目作品集。仓库正在从两套独立源码迁移为单一 pnpm monorepo，由一份权威内容同时驱动 Vercel 主站和 GitHub Pages 温备站。

## 目标架构

```text
apps/vercel/      # Next.js 原生运行时与 Vercel 主站
apps/pages/       # Next.js 静态导出与 GitHub Pages 温备站
packages/content/ # 文章、项目、身份与页面文案的唯一来源
docs/             # ADR、迁移证据、验收与恢复手册
```

两套应用保留各自的组件、样式、搜索实现、图片策略和部署生命周期；公开语义内容不得在应用目录分别维护。`main` 表达两版共同的生产意图，合并后由两个平台独立自动部署。

当前迁移分支及逐步验证方式见 [monorepo 实施计划](docs/plans/2026-07-15-monorepo-migration.md)。迁移前不可变基线见 [baselines.md](docs/migration/baselines.md)。

## 迁移后的本地命令

需要 Node.js 24.x 与 pnpm 10.20.0。

```bash
corepack enable
pnpm install
pnpm check
pnpm typecheck
pnpm build
pnpm --filter @original/blog-pages audit:static
pnpm audit:versions
pnpm test:e2e
```

按应用运行：

```bash
pnpm dev:vercel
pnpm dev:pages
pnpm build:vercel
pnpm build:pages
pnpm preview:pages
```

`pnpm preview:pages` 直接按生产 `basePath` 预览 Pages 导出物。CI 在 Node.js 24 上执行相同的内容、类型、双构建、静态导出、版本和导航门禁。

## 生产站点

- Vercel 主站：<https://original-blog-vercel.vercel.app/>
- 迁移期间旧 Pages：<https://original4422.github.io/original-blog-pages/>
- 最终 Pages 温备站：仓库重命名为 `original-blog` 后启用 `/original-blog/` 项目站点路径

域名方案暂缓。旧 Pages 仓库在新 Pages 完成访问、内容一致性和恢复验收前保持在线且不归档。

## 文档入口

- [项目统一语言](CONTEXT.md)
- [架构决策](docs/adr/)
- [迁移基线](docs/migration/baselines.md)
- [上线验收](docs/acceptance.md)
- [部署与恢复手册](docs/deployment-runbook.md)
- [两套旧实现的决策历史](docs/history/)

## 来源与许可

本项目基于 MIT 开源项目 [`yunshenwuchuxun/yunshen-blogv1`](https://github.com/yunshenwuchuxun/yunshen-blogv1) 的提交 `dfbd51a88ea04423c9c2e13ee83e9eec8b44e480` 改造。保留通用布局、动画与内容系统思路；原作者文章、论文、项目说明和个人媒体均未纳入本项目。

上游仓库携带的 [LICENSE](LICENSE) 已原样保留，其中版权声明为 `Copyright (c) 2022 Dale Larroder`。使用和分发本项目时须继续遵守该 MIT 许可文本。
