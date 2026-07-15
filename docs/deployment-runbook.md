# Monorepo 双版本部署与恢复手册

本文记录 `original-blog` monorepo 的构建、部署、版本新鲜度和人工切换流程。迁移前两仓库的不可变证据见 [`migration/baselines.md`](migration/baselines.md)，历史验收结果见 [`acceptance.md`](acceptance.md)。

## 当前边界

| 目标 | 应用目录 | 平台 | 当前/最终公开地址 |
| --- | --- | --- | --- |
| 主站 | `apps/vercel` | Vercel | `https://original-blog-vercel.vercel.app/` |
| 温备站 | `apps/pages` | GitHub Pages | 最终为 `https://original4422.github.io/original-blog/` |
| 迁移期间旧温备 | 独立归档仓库 | GitHub Pages | `https://original4422.github.io/original-blog-pages/` |

当前没有自定义域名。旧 Pages 在新 Pages 完成生产验收前保持在线；不要把迁移承接仓库仍名为 `original-blog-vercel` 时产生的临时项目路径当成最终温备地址。

公开语义内容只允许在 `packages/content` 中维护。`apps/vercel` 与 `apps/pages` 可以使用不同组件、布局和平台能力，但不得分别维护文章、项目、身份或页面正文副本。

## 本地发布门禁

使用 Node.js 24.x 和根 `package.json` 指定的 pnpm 版本：

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm audit:content
pnpm check
pnpm typecheck
pnpm build
pnpm --filter @original/blog-pages audit:static
pnpm audit:versions
pnpm test:e2e
```

期望结果：

- 两套应用均完成生产构建；
- Pages 导出 24 条公开路由、8 条搜索记录和 11 个标签页；
- 320×568、390×844 与 1280×800 导航回归通过；
- `apps/vercel/public/version.json` 与 `apps/pages/out/version.json` 指向同一提交；
- 仓库中只有一个 `pnpm-lock.yaml`。

需要检查真实 Pages 生产路径时先运行 `pnpm build:pages`，再运行：

```bash
pnpm preview:pages
```

默认地址为 `http://127.0.0.1:4173/original-blog-pages/`。预览器直接挂载带生产 `basePath` 的 `apps/pages/out`，不重新构建无前缀变体。

## GitHub Actions 质量门禁

`.github/workflows/ci.yml` 在 Pull Request 和 `main` 更新时运行完整质量门禁：内容审计、格式与 lint、类型检查、双构建、Pages 静态审计、版本审计和 Playwright 导航测试。任一步骤失败均不得进入上线窗口。

工作流固定使用 Node.js 24。提交前的本地 Node 版本不同不代表 CI 已验证，最终以 GitHub Actions 结果为准。

## Vercel 主站部署

Vercel 继续由现有 GitHub 集成监听 `main`。正式迁移时必须在 Vercel Project 中确认：

1. Root Directory 为 `apps/vercel`；
2. 构建可以读取仓库根的 `pnpm-workspace.yaml`、根锁文件与 `packages/content`；
3. Production Branch 为 `main`；
4. 已启用 Automatically expose System Environment Variables，使 `VERCEL_GIT_COMMIT_SHA` 可用于 `/version.json`；
5. 迁移分支 Preview 通过后才合并，不预先删除当前 Production deployment。

只读核验命令：

```bash
NODE24_BIN="$(brew --prefix node@24)/bin"
env PATH="$NODE24_BIN:$PATH" vercel list original-blog-vercel
env PATH="$NODE24_BIN:$PATH" vercel inspect https://<deployment-url>
curl -fsS https://original-blog-vercel.vercel.app/version.json
```

验收时 `/version.json` 的 `commit` 必须等于目标 `main` SHA，`app` 必须为 `vercel`。

## GitHub Pages 构建与部署

`.github/workflows/deploy-pages.yml` 在每次 `main` 更新后独立构建并审计 Pages。它根据仓库名生成：

- `NEXT_PUBLIC_BASE_PATH=/<repository-name>`；
- `SITE_URL=https://<owner>.github.io/<repository-name>`。

仓库仍名为 `original-blog-vercel` 时，workflow 只执行 build 与 audit，不配置、上传或部署 Pages。仓库重命名为 `original-blog` 后，`configure-pages`、artifact upload 和 deploy job 自动激活，最终路径为 `/original-blog/`。

监控命令：

```bash
gh run list \
  --repo original4422/original-blog \
  --workflow deploy-pages.yml \
  --branch main \
  --limit 10 \
  --json databaseId,headSha,status,conclusion,url

gh run watch <run-id> \
  --repo original4422/original-blog \
  --exit-status

gh api repos/original4422/original-blog/pages
curl -fsS https://original4422.github.io/original-blog/version.json
```

仅 build job 成功不代表已发布；deploy job、公开 URL 和 `version.json` 都必须通过。

## 15 分钟版本新鲜度目标

`.github/workflows/verify-deploy-freshness.yml` 在仓库最终命名为 `original-blog` 后激活。它轮询主站和温备站的 `/version.json`，最多等待 900 秒：

- 两边 `commit` 都等于触发 workflow 的 `main` SHA 时成功；
- 超过 15 分钟仍未收敛时 workflow 失败并形成可见告警；
- 新的 `main` 提交会取消旧轮询，只追踪最新生产意图，不逐个补发中间版本。

默认 Vercel 端点为 `https://original-blog-vercel.vercel.app/version.json`。如平台地址发生变化，可设置仓库变量 `VERCEL_VERSION_URL`；Pages 端点也可用 `PAGES_VERSION_URL` 覆盖。

## 生产访问矩阵

| 能力 | Vercel | 最终 Pages | 预期 |
| --- | --- | --- | --- |
| 首页 | `/` | `/original-blog/` | 200 |
| Blog | `/blog/` | `/original-blog/blog/` | 200 |
| Tags | `/tags/` | `/original-blog/tags/` | 200 |
| Projects | `/projects/` | `/original-blog/projects/` | 200 |
| About | `/about/` | `/original-blog/about/` | 200 |
| 文章详情 | `/blog/<slug>/` | `/original-blog/blog/<slug>/` | 200 |
| 标签详情 | `/tags/<tag>/` | `/original-blog/tags/<tag>/` | 200 |
| 项目详情 | `/projects/<slug>/` | `/original-blog/projects/<slug>/` | 200 |
| Feed | `/feed.xml` | `/original-blog/feed.xml` | 200 + XML |
| Sitemap | `/sitemap.xml` | `/original-blog/sitemap.xml` | 200 + XML |
| 搜索 | `/api/search-index` | `/original-blog/search-index.json` | 200 + JSON |
| 版本 | `/version.json` | `/original-blog/version.json` | 200 + 当前 SHA |
| 未知路径 | `/__missing__/` | `/original-blog/__missing__/` | 404 |

Pages 的 HTML、CSS、JavaScript、图片和内部链接都必须带 `/original-blog` 前缀。浏览器复检至少覆盖桌面 1280×800、移动 320×568 和 390×844，并检查菜单焦点、滚动锁定、Escape、导航关闭、主题、搜索、文章公式与控制台错误。

## 人工灾备切换

目标是已发布版本 RPO 为 0、RTO 不超过 1 小时，切换保持人工决策：

1. 先读取两边 `/version.json`，确认 Pages 已包含主站最后一个已发布提交；
2. 运行生产访问矩阵并检查 Pages 核心交互；
3. 在现有公开渠道明确通知临时入口为 Pages URL；
4. 记录故障开始时间、切换时间、目标提交和验证证据；
5. 主站恢复后再次核对版本与访问矩阵，再人工撤销临时入口通知。

当前没有自定义域名，因此“切换”只能通过发布和传播备用 URL 完成，不能实现透明 DNS 切换。域名方案后续单独讨论。

## 回退边界

- Vercel 迁移失败：保留并恢复到迁移前 tag `pre-monorepo-vercel-2026-07-15` 对应的已知良好 deployment；
- 新 Pages 失败：旧 `original-blog-pages` 继续在线，不归档旧仓库；
- 工作流配置错误：修复后提交新 SHA，不修改或伪造已发布版本文件；
- 两个线上版本不一致：以 `main` 的当前生产意图和 `/version.json` 为证据，等待或重新触发对应平台部署。

## 上线证据模板

```text
目标 main SHA:
CI workflow run:
Vercel deployment URL / Ready 时间 / version.json:
Pages workflow run / deployment URL / version.json:
新鲜度 workflow 结果与收敛耗时:
桌面与移动浏览器检查:
故障或回退记录:
```

只有 CI、两个平台部署、公开访问矩阵、版本新鲜度和浏览器复检都对应同一目标提交时，才可以宣称新架构正式上线。
