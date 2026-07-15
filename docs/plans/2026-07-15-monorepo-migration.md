# Original Blog Monorepo Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将 `original-blog-vercel` 原地演进为一个可维护的 pnpm monorepo，以单一权威内容源驱动 Vercel 主站和 GitHub Pages 温备站，并在不切断现有线上站点的前提下完成迁移、验证和回退准备。

**Architecture:** 仓库根目录只负责 workspace、质量门禁、部署工作流与文档；`apps/vercel` 和 `apps/pages` 是两套独立 Next.js 应用；`packages/content` 保存唯一公开语义内容与 schema；两套应用通过适配器消费同一内容，但保留各自的视觉组件、运行约束和构建产物。日常发布由同一 `main` 提交独立触发 Vercel 与 Pages，Pages 线上提交在正常情况下 15 分钟内收敛。

**Tech Stack:** Next.js 16.2.10、React 19.2、TypeScript 5.9、pnpm 10.20 workspace、Biome、GitHub Actions、GitHub Pages、Vercel、Playwright。

---

## 原则与边界

- 迁移承接仓库：`https://github.com/original4422/original-blog-vercel.git`。
- 最终仓库名：`original-blog`；在启用新 Pages 站点前完成重命名。
- 旧 `original-blog-pages` 不嫁接历史、不删除；新 Pages 验收后只读归档。
- 权威内容以迁移前 Vercel 内容为基线。Pages 当前示例文章、示例项目不作为第二套内容保留；Pages 只保留其视觉与静态部署实现。
- 域名、安全加固、自动 DNS 切换不在本次范围内。
- 不引入 Turborepo。只有两个应用时，pnpm workspace 和明确脚本足以满足维护效率；待构建时间或依赖图复杂度出现实际问题后再评估任务编排器。
- 任何 GitHub 设置、仓库重命名、推送、归档和 Vercel 设置变更，执行前都需要用户对该阶段明确授权。

## 目标目录

```text
original-blog/
├── .github/workflows/
│   ├── ci.yml
│   ├── deploy-pages.yml
│   └── verify-deploy-freshness.yml
├── apps/
│   ├── vercel/
│   └── pages/
├── packages/
│   └── content/
│       ├── media/
│       ├── posts/
│       ├── src/
│       │   ├── index.ts
│       │   ├── pages.ts
│       │   ├── projects.ts
│       │   ├── schema.ts
│       │   └── site.ts
│       └── package.json
├── scripts/
│   ├── audit-content.ts
│   ├── generate-build-version.mjs
│   └── preview-pages.mjs
├── tests/e2e/
│   └── pages-navigation.spec.ts
├── docs/
│   ├── adr/
│   ├── migration/
│   └── plans/
├── CONTEXT.md
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

## Task 0: 固化两个迁移前基线

**Files:**

- Modify: `github-vercel/site.config.ts`
- Modify: `github-pages/data/site.ts`
- Modify: `github-pages/components/contact.tsx`
- Modify: `github-pages/components/top-nav.tsx`
- Modify: `github-pages/components/chrome.css`
- Later modify: `docs/adr/0009-import-pages-final-tree-with-provenance.md`

**Step 1: 重新验证 Vercel 当前工作树**

Run:

```bash
cd /Users/original/Project/Code/Blog/personal-blog/github-vercel
pnpm check
pnpm typecheck
pnpm build
```

Expected: 三条命令均退出 0，联系邮箱为 `pzg24@mails.tsinghua.edu.cn`。

**Step 2: 单独提交并推送 Vercel 联系方式修改**

```bash
git add site.config.ts
git commit -m "chore: update public contact email"
git push origin main
```

Expected: Vercel 自动部署该提交，主站联系邮箱正确。

**Step 3: 重新验证 Pages 当前工作树**

```bash
cd /Users/original/Project/Code/Blog/personal-blog/github-pages
pnpm check
pnpm build
pnpm audit:static
```

Expected: 检查和构建通过；静态审计仍报告 24 个路由、8 条搜索记录、11 个标签页；移动导航修复包含在产物中。

**Step 4: 单独提交并推送 Pages 联系方式与移动导航修改**

```bash
git add data/site.ts components/contact.tsx components/top-nav.tsx components/chrome.css
git commit -m "fix: repair mobile navigation and contact details"
git push origin main
```

Expected: Pages 自动部署该提交；320×568、390×844 和桌面宽度访问验证通过。

**Step 5: 记录不可变基线**

```bash
VERCEL_BASELINE=$(git -C ../github-vercel rev-parse HEAD)
PAGES_BASELINE=$(git -C ../github-pages rev-parse HEAD)
git -C ../github-vercel tag -a pre-monorepo-vercel-2026-07-15 "$VERCEL_BASELINE" -m "Final Vercel baseline before monorepo migration"
git -C ../github-pages tag -a pre-monorepo-pages-2026-07-15 "$PAGES_BASELINE" -m "Final Pages baseline before monorepo migration"
git -C ../github-vercel push origin pre-monorepo-vercel-2026-07-15
git -C ../github-pages push origin pre-monorepo-pages-2026-07-15
```

Expected: 两个标签都指向已经上线并验证的提交。ADR-0009 后续改为记录 `$PAGES_BASELINE`，不再写死旧提交 `fe2ee81`。

## Task 1: 创建隔离迁移工作树

**Files:** None.

**Step 1: 确认原仓库干净**

```bash
cd /Users/original/Project/Code/Blog/personal-blog/github-vercel
git status --short
git fetch origin
```

Expected: `git status --short` 无输出，`main` 与远端一致。

**Step 2: 创建专用 worktree 和分支**

```bash
git worktree add ../original-blog-monorepo -b feat/monorepo-migration origin/main
cd ../original-blog-monorepo
```

Expected: 日常主站 checkout 保持不动；所有结构迁移只发生在 `feat/monorepo-migration`。

## Task 2: 把现有架构决定纳入承接仓库

**Files:**

- Create: `CONTEXT.md`
- Create: `docs/adr/0004-*.md` through `docs/adr/0012-*.md`
- Create: `docs/migration/baselines.md`
- Create: `docs/migration/pages-import.sha256`
- Create: `docs/history/vercel-decisions.md`
- Create: `docs/history/pages-decisions.md`
- Modify: `docs/adr/0009-import-pages-final-tree-with-provenance.md`
- Modify: `README.md`

**Step 1: 导入已确认文档**

从 `/Users/original/Project/Code/Blog/personal-blog` 导入 `CONTEXT.md`、`docs/adr`、验收清单、部署 runbook 和参考 QA 文档。保留根仓库已有 README 的许可证与上游致谢，并把 monorepo 使用方法写在前面。

**Step 2: 修正 Pages 来源证据**

在 ADR-0009 和 `docs/migration/baselines.md` 中记录：

- 两个原仓库 URL；
- 两个最终 baseline SHA 与 tag；
- 验证时间和线上 URL；
- Pages 仅导入最终文件树；
- 旧 Pages 仓库保留历史并在最终验收后归档。

**Step 3: 提交文档基线**

```bash
git add CONTEXT.md README.md docs
git commit -m "docs: record monorepo migration baselines"
```

## Task 3: 将 Vercel 应用移动到 pnpm workspace

**Files:**

- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `apps/vercel/package.json`
- Move: `app` to `apps/vercel/app`
- Move: `public` to `apps/vercel/public`
- Move: `site.config.ts` to `apps/vercel/site.config.ts`
- Move: `next.config.ts`, `postcss.config.js`, `tsconfig.json`, `biome.json`, `next-env.d.ts` to `apps/vercel/`
- Modify: `.gitignore`
- Regenerate: `pnpm-lock.yaml`

**Step 1: 先写失败检查**

在根 `package.json` 中声明目标命令后先运行：

```bash
pnpm --filter @original/blog-vercel check
```

Expected: 因 workspace 和目标包尚未建立而失败，证明后续检查确实覆盖新路径。

**Step 2: 建立最小 workspace**

根 `pnpm-workspace.yaml` 只包含：

```yaml
packages:
  - apps/*
  - packages/*
```

根包负责 `check`、`typecheck`、`build`、`test:e2e` 和按应用过滤的命令；应用包名必须唯一，Vercel 应用命名为 `@original/blog-vercel`。

**Step 3: 移动 Vercel 文件并安装**

使用 `git mv` 保留移动可读性。根目录只保留一个 lockfile，不在应用目录保留 lockfile。运行：

```bash
pnpm install
pnpm --filter @original/blog-vercel check
pnpm --filter @original/blog-vercel typecheck
pnpm --filter @original/blog-vercel build
```

Expected: Vercel 版在 `apps/vercel` 中独立通过检查和生产构建。

**Step 4: 提交结构移动**

```bash
git add -A
git commit -m "refactor: move Vercel app into pnpm workspace"
```

## Task 4: 从最终 Pages 基线导入文件树

**Files:**

- Create: `apps/pages/**`
- Modify: `apps/pages/package.json`
- Delete after import: `apps/pages/.github/**`
- Delete after import: `apps/pages/pnpm-lock.yaml`
- Modify: `docs/migration/pages-import.sha256`

**Step 1: 从 tag 导出，而不是从未跟踪工作树复制**

```bash
rm -rf /tmp/original-blog-pages-import
mkdir -p /tmp/original-blog-pages-import apps/pages
git -C ../github-pages archive pre-monorepo-pages-2026-07-15 | tar -x -C /tmp/original-blog-pages-import
rsync -a --exclude='.github' --exclude='README.md' --exclude='LICENSE' /tmp/original-blog-pages-import/ apps/pages/
```

Expected: 导入内容完全来自已标记 SHA；不包含 `.git`、构建产物或嵌套 workflow。

**Step 2: 记录原始树校验和**

对导入前的受跟踪文件生成排序 SHA-256 清单，写入 `docs/migration/pages-import.sha256`；随后才做 workspace 适配。

**Step 3: 接入 workspace 并验证**

将包名改为 `@original/blog-pages`，删除应用 lockfile，重新执行：

```bash
pnpm install
pnpm --filter @original/blog-pages check
pnpm --filter @original/blog-pages build
pnpm --filter @original/blog-pages audit:static
```

Expected: 导入后的 Pages 仍可独立静态构建和审计。

**Step 4: 提交 Pages 导入**

```bash
git add apps/pages docs/migration/pages-import.sha256 pnpm-lock.yaml
git commit -m "refactor: import Pages app from final archived tree"
```

## Task 5: 建立唯一公开语义内容包

**Files:**

- Create: `packages/content/package.json`
- Create: `packages/content/src/schema.ts`
- Create: `packages/content/src/site.ts`
- Create: `packages/content/src/pages.ts`
- Create: `packages/content/src/projects.ts`
- Create: `packages/content/src/index.ts`
- Create: `packages/content/posts/*.mdx`
- Create: `packages/content/media/**`
- Create: `scripts/audit-content.ts`
- Modify: `apps/vercel/app/blog/utils.ts`
- Modify: `apps/vercel/app/projects/constants.ts`
- Modify: `apps/vercel/site.config.ts`
- Modify: `apps/pages/lib/posts.ts`
- Modify: `apps/pages/data/site.ts`
- Modify: `apps/pages/data/projects.ts`
- Modify: both apps' page and component files that contain semantic copy

**Step 1: 写内容契约的失败审计**

`scripts/audit-content.ts` 首先检查：必填字段、唯一 slug、有效日期、非空标签、内部媒体存在、公开路径唯一、联系方式一致，以及两套应用声明消费同一内容包。迁移前运行：

```bash
pnpm audit:content
```

Expected: 因内容仍分散在两个应用中而失败。

**Step 2: 定义规范 schema**

- 文章字段：`title`、`publishedAt`、`summary`、`draft`、`image?`、`tags`、`featured?`。
- 项目字段：`slug`、`title`、`role`、`summary`、`description`、`image`、`imageAlt`、`status`、`stack`、`highlights`、`links` 和详情段落。
- 站点字段：作者名、标题、描述、语言、邮箱、GitHub、统一导航和规范公开路径。
- 页面文案：Home、About、Contact 等对外表达集中在 `pages.ts`。
- 部署 URL、basePath、动画参数、颜色和布局不属于语义内容，保留在各应用。

**Step 3: 以 Vercel 当前内容为唯一基线**

将 Vercel 的四篇文章和项目数据迁入 `packages/content`。Pages 原示例文章和项目从应用中删除；Pages 组件通过适配器渲染共享内容。展示字段不足时扩展规范 schema，不在 Pages 内建立第二份语义数据。

**Step 4: 将两套应用显式依赖共享包**

两个应用的 `package.json` 都声明：

```json
"@original/content": "workspace:*"
```

应用内只允许存在渲染适配器和视觉配置，不允许再维护文章、项目、作者信息或页面正文副本。

**Step 5: 验证并提交**

```bash
pnpm audit:content
pnpm check
pnpm typecheck
pnpm build
git add -A
git commit -m "refactor: centralize public content in shared package"
```

Expected: 两版构建包含相同文章 slug、标签集合、项目 slug、联系方式和公开路径。

## Task 6: 修复 Pages 本地预览并加入移动导航回归测试

**Files:**

- Create: `scripts/preview-pages.mjs`
- Create: `playwright.config.ts`
- Create: `tests/e2e/pages-navigation.spec.ts`
- Modify: `apps/pages/next.config.ts`
- Modify: `apps/pages/package.json`
- Modify: root `package.json`

**Step 1: 写会复现当前问题的测试**

Playwright 以生产 basePath 构建产物启动预览，断言：

- CSS 与 JavaScript 请求无 404；
- 320×568 和 390×844 下四个导航入口均在视口内；
- 打开菜单后页面滚动锁定，焦点进入菜单；
- Escape、点击导航和切换到桌面宽度都会关闭菜单并恢复滚动；
- 1280×800 下使用桌面导航。

首次运行应因现有 `serve out -l 4173` 无法挂载 basePath 而失败。

**Step 2: 实现真实生产路径预览器**

`scripts/preview-pages.mjs` 读取 `NEXT_PUBLIC_BASE_PATH`，把 `out` 作为该路径的站点根提供服务，而不是要求为了本地 QA 重新构建一个无 basePath 的非生产变体。

**Step 3: 运行回归测试**

```bash
pnpm build:pages
pnpm test:e2e --project=pages-mobile
pnpm test:e2e --project=pages-desktop
```

Expected: 所有尺寸通过，无资源 404、控制台错误或可见导航回归。

**Step 4: 提交测试和预览修复**

```bash
git add scripts playwright.config.ts tests apps/pages/next.config.ts apps/pages/package.json package.json pnpm-lock.yaml
git commit -m "test: cover Pages navigation and base-path preview"
```

## Task 7: 建立双应用 CI、Pages 部署与版本可观测性

**Files:**

- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/deploy-pages.yml`
- Create: `.github/workflows/verify-deploy-freshness.yml`
- Create: `scripts/generate-build-version.mjs`
- Modify: root and app build scripts

**Step 1: PR 质量门禁**

`ci.yml` 对 Pull Request 和 `main` 运行：安装、内容审计、两版检查、类型检查、两版生产构建、Pages 静态审计和 Playwright 导航测试。任一失败都不能合并。

**Step 2: 独立 Pages 自动部署**

`deploy-pages.yml` 在 `main` 合并后独立构建 `apps/pages`，上传 `apps/pages/out` 并部署。basePath 与 `SITE_URL` 从最终仓库名生成，避免把 `original-blog-pages` 写死进代码。并发组包含 workflow 与 ref，只取消同一部署链的旧运行。

在仓库仍名为 `original-blog-vercel` 时，部署 job 暂不激活，只做完整 build/audit；旧 Pages 继续在线。仓库重命名为 `original-blog` 后再启用最终 Pages URL。

**Step 3: 暴露线上源提交**

两版构建都生成 `/version.json`，至少包含 `commit`、`builtAt`、`app`。Vercel 使用 `VERCEL_GIT_COMMIT_SHA`，Pages 使用 `GITHUB_SHA`。

**Step 4: 验证 15 分钟新鲜度目标**

`verify-deploy-freshness.yml` 在 `main` 更新后轮询两个公开 `version.json`，最多等待 15 分钟；超过目标则失败并留下可见告警，重试只追最新 `main`，不逐个补发中间提交。

**Step 5: 提交自动化**

```bash
git add .github scripts package.json apps pnpm-lock.yaml
git commit -m "ci: validate and deploy both blog applications"
```

## Task 8: 迁移部署设置并合并

**Files:** No additional source files unless preview exposes a defect.

**Step 1: 推送迁移分支并创建 PR**

```bash
git push -u origin feat/monorepo-migration
```

Expected: PR 中所有本地同等检查在 GitHub Actions 再次通过。

**Step 2: 调整现有 Vercel Project**

在 Vercel 中把现有项目 Root Directory 改为 `apps/vercel`，确认允许构建读取 Root Directory 之外的 workspace 文件。Vercel 官方要求 pnpm 包出现在根 `pnpm-workspace.yaml` 中、包名唯一、内部依赖显式声明；本计划已按此组织。

先验证迁移分支 Preview；不要先删除当前 Production deployment。

**Step 3: 合并并验证 Vercel Production**

合并 PR 后，验证主站页面、文章、标签、项目、RSS、Sitemap、搜索、联系邮箱、移动端导航和 `/version.json`。若失败，立即回退到 `pre-monorepo-vercel-2026-07-15` 对应提交或 Vercel 上一个已知良好 deployment。

## Task 9: 重命名仓库、启用最终 Pages 并归档旧仓库

**Files:**

- Modify if needed: URLs in `packages/content/src/projects.ts`, README and runbook

**Step 1: 重命名承接仓库**

把 `original-blog-vercel` 重命名为 `original-blog`，随后更新本地 remote：

```bash
git remote set-url origin https://github.com/original4422/original-blog.git
git remote -v
```

GitHub 会重定向仓库 Web 与 Git 访问，但不会重定向项目型 GitHub Pages URL。因此必须先定最终仓库名，再把新 Pages URL视为有效验收对象。

**Step 2: 触发并验证新 Pages**

手动触发一次 `deploy-pages.yml`，验证：

- `https://original4422.github.io/original-blog/` 可访问；
- 内容与 Vercel 的同一 `main` 提交一致；
- 所有 basePath 资源、深层路由、RSS、Sitemap、搜索、移动导航正常；
- `/version.json` 与主站在 15 分钟目标内收敛。

**Step 3: 演练人工切换 runbook**

在不改域名的前提下，计时完成：确认主站故障、核对 Pages 健康与提交、给出温备 URL、恢复主站。记录是否能在 1 小时内完成。域名接入后再把“给出温备 URL”替换为 DNS 切换步骤。

**Step 4: 观察后归档旧 Pages**

至少完成一次真实内容变更的双部署验证，并经过一个观察窗口后，才将 `original-blog-pages` 设为 archived。保留其 tags、Actions 记录和历史，不删除仓库。

## Task 10: 异地 Git 镜像（整合完成后的独立阶段）

**Files:**

- Create: `docs/recovery/offsite-mirror.md`
- Create: mirror workflow or local mirror script after provider choice

选择 GitHub 故障域之外的 Git 服务，建立只读 `--mirror` 副本，验证分支、tags 和完整历史可恢复。镜像不能接受日常内容编辑，也不能触发正式发布。该任务不阻塞 monorepo 代码整合，但在宣称完整灾备能力前必须完成。

## 最终验收标准

- 根目录只有一个 pnpm lockfile，一条命令可检查和构建两套应用。
- 所有公开语义内容只有 `packages/content` 一个可编辑来源。
- 两套应用保留独立组件、样式、Next 配置和部署产物。
- Pages 移动导航有永久回归测试，生产 basePath 可在本地真实预览。
- PR 必须同时通过两版；合并后两条部署互不阻塞。
- 两个线上站点都可从 `/version.json` 识别源提交，正常情况下 15 分钟内收敛。
- 旧 Pages 仓库仅在新 Pages 和恢复演练通过后归档。
- Vercel 可回滚到旧 deployment；Pages 可由 baseline tag 或最后已知良好静态产物恢复。
- 域名相关配置明确留待后续，不隐含为本次已完成能力。

## 推荐执行节奏

1. 立即执行 Task 0，先把当前两边修复发布成干净基线。
2. 基线线上验证完成后，立即开始 Task 1；这就是 monorepo 整合的正式开始，不等待域名或镜像服务商决定。
3. Task 1–7 在迁移分支完成并通过 PR 门禁，期间现有两个线上站点继续服务。
4. Task 8–9 单独作为上线窗口执行，每个外部设置变更前设置明确检查点。
5. 新架构稳定后再做 Task 10 和域名方案。
