# 双版本部署与上线验收手册

> 迁移提示：本文当前记录迁移前的双仓库操作路径。monorepo 的根级命令、最终 `original-blog` Pages 路径和版本新鲜度检查将在迁移 Task 7 完成后更新；在此之前，它仍用于恢复和核对两个不可变基线。

本文把两套博客从“代码已完成”推进到“生产站点可访问且证据充分”的发布、监控和验收步骤固定下来。它不会取代 [`acceptance.md`](acceptance.md)；后者定义完成标准，本文定义如何取得这些标准所需的当前证据。

## 目标与固定边界

| 版本 | 本地目录 | GitHub 仓库 | 托管目标 | 正式站点根路径 |
| --- | --- | --- | --- | --- |
| GitHub + Vercel | `github-vercel/` | `original4422/original-blog-vercel` | Vercel | `https://original-blog-vercel.vercel.app/` |
| GitHub Pages | `github-pages/` | `original4422/original-blog-pages` | GitHub Pages | `https://original4422.github.io/original-blog-pages/` |

Pages 是项目站点，`/original-blog-pages` 是强制的 `basePath`，不是可以省略的展示前缀。验收时 `BASE_URL` 可以传 `https://original4422.github.io`，脚本会追加该前缀；也可以直接传完整站点根地址。Vercel 地址必须传 origin，不带页面路径。

发布前分别在两个版本目录执行其 README 规定的安装、检查和生产构建。GitHub Pages 还必须运行 `pnpm audit:static`，确认 `out/` 包含 `.nojekyll`、404、Feed、Sitemap、robots 和静态搜索索引。只有本地门禁全部成功后才推送 `main`。

## 仓库与提交身份核对

在发布前记录本地提交并确认远端指向正确仓库：

```bash
git -C github-vercel remote -v
git -C github-vercel rev-parse HEAD
gh repo view original4422/original-blog-vercel \
  --json nameWithOwner,url,defaultBranchRef

git -C github-pages remote -v
git -C github-pages rev-parse HEAD
gh repo view original4422/original-blog-pages \
  --json nameWithOwner,url,defaultBranchRef
```

最终验收记录必须包含两个部署提交 SHA。不要用“本地 build 通过”替代线上部署 SHA，也不要用旧工作流或旧 Vercel deployment 证明当前提交已上线。

## Vercel：固定 Node 24 并监控生产部署

本机 Vercel CLI 在 Node 24 下执行。每次调用都显式放置 Node 24，避免终端默认 Node 版本漂移：

```bash
NODE24_BIN="$(brew --prefix node@24)/bin"
env PATH="$NODE24_BIN:$PATH" node --version
env PATH="$NODE24_BIN:$PATH" vercel whoami
```

输出应显示 Node `v24.x`、Vercel 账号 `original4422` 与预期 team。由连接到 `main` 的 GitHub 集成触发生产部署后，用以下只读命令定位并检查 deployment；`<production-url>` 替换为实际 Production alias：

```bash
env PATH="$NODE24_BIN:$PATH" vercel list original-blog-vercel
env PATH="$NODE24_BIN:$PATH" vercel inspect https://<production-url>
```

验收条件是 deployment 状态为 Ready、来源仓库和生产分支正确、部署提交与本次 Git SHA 一致，并且稳定 Production alias 指向它。若失败，先看 Vercel build log，修复源码后提交新 SHA；不要把 Preview URL 当作正式网址。

## GitHub Pages：监控 build 与 deploy 两阶段

推送 `main` 后，工作流 `.github/workflows/deploy-pages.yml` 必须完整成功。读取最近运行并锁定当前 SHA 对应的 run：

```bash
gh run list \
  --repo original4422/original-blog-pages \
  --workflow deploy-pages.yml \
  --branch main \
  --limit 10 \
  --json databaseId,headSha,status,conclusion,url
```

确认 `headSha` 等于部署提交后再监控；不要默认列表第一条就是当前提交：

```bash
gh run watch <run-id> \
  --repo original4422/original-blog-pages \
  --exit-status
```

失败时读取失败步骤日志：

```bash
gh run view <run-id> \
  --repo original4422/original-blog-pages \
  --log-failed
```

成功后再读取 Pages 当前发布信息并确认 URL：

```bash
gh api repos/original4422/original-blog-pages/pages
```

仅 build job 成功不够；依赖它的 deploy job 也必须成功，且线上地址需要通过下一节的 HTTP 验收。

## 生产路由状态矩阵

所有检查使用 GET 并跟随平台规范化重定向，以下是最终响应预期：

| 能力 | Vercel 路径 | Pages 路径 | 最终状态 |
| --- | --- | --- | --- |
| 首页 | `/` | `/original-blog-pages/` | 200 |
| Blog | `/blog/` | `/original-blog-pages/blog/` | 200 |
| Tags | `/tags/` | `/original-blog-pages/tags/` | 200 |
| Projects | `/projects/` | `/original-blog-pages/projects/` | 200 |
| About | `/about/` | `/original-blog-pages/about/` | 200 |
| 文章详情 | `/blog/<slug>/` | `/original-blog-pages/blog/<slug>/` | 200 |
| 标签详情 | `/tags/<tag>/` | `/original-blog-pages/tags/<tag>/` | 200 |
| 项目详情 | `/projects/<slug>/` | `/original-blog-pages/projects/<slug>/` | 200 |
| robots | `/robots.txt` | `/original-blog-pages/robots.txt` | 200 |
| Sitemap | `/sitemap.xml` | `/original-blog-pages/sitemap.xml` | 200 + 可解析 XML |
| Feed | `/feed.xml` | `/original-blog-pages/feed.xml` | 200 + 至少一条 item/entry |
| 搜索 | `/api/search-index` | `/original-blog-pages/search-index.json` | 200 + 非空合法 JSON |
| 未知路径 | `/__deployment_verifier_missing__/` | `/original-blog-pages/__deployment_verifier_missing__/` | 404 |

`feed.xml` 是两版共同的正式契约；遗留的 `rss.xml` 不能替代它。Sitemap、Feed 和 robots 中的绝对 URL 必须属于各自生产站点，Pages URL 必须包含项目 base path。搜索 JSON 至少要为每条记录提供非空 `title`，并提供显式 `slug` 或可推导 slug 的站内 `url`。

## 自动化 HTTP 验收

根工作区的 [`scripts/verify-site.sh`](../scripts/verify-site.sh) 只发送只读 GET 请求；响应体写入临时目录并在退出时清理。它不调用 GitHub/Vercel 写接口，不跳过 TLS 验证，也不使用 `eval`。详情参数传原始值，脚本负责 URL-segment 编码，因此可以覆盖中文、空格和 `C++` 标签。

Vercel 示例：

```bash
BASE_URL=https://<production-url> \
  ./scripts/verify-site.sh \
  --target vercel \
  --slug <known-post-slug> \
  --tag 'C++' \
  --project <known-project-slug>
```

GitHub Pages 示例：

```bash
BASE_URL=https://original4422.github.io \
  ./scripts/verify-site.sh \
  --target pages \
  --pages-base-path /original-blog-pages \
  --slug <known-post-slug> \
  --tag 'C++' \
  --project <known-project-slug>
```

脚本会检查核心路由、可选详情路由、真实 404、robots 的 Sitemap 声明、Sitemap 路由覆盖、Feed XML 与生产链接、平台对应的搜索 JSON。任一失败均以退出码 1 结束；参数或依赖错误以退出码 2 结束。没有提供详情参数时相应路由会明确显示 `SKIP`，因此最终 Goal 验收应提供三个当前确实存在的值，而不是依赖跳过项。

## 浏览器视觉与交互复检

HTTP 通过只证明路由和发布资产可用，不能证明“显示符合预期”。两个正式网址都需要在 `1440×900` 与 `390×844` 下逐项检查：

1. 首页 Hero → Intro → 四段 Works → Contact 顺序、流体背景与滚动动画；无横向溢出。
2. 桌面/移动导航、深浅主题切换与刷新后持久化。
3. 搜索按钮、`Cmd/Ctrl+K`、键盘选择、关闭与详情跳转。
4. 示例 MDX 的目录、阅读进度、代码高亮、KaTeX、表格和图片。
5. DevTools Console 无关键错误，Network 无意外 4xx/5xx；Pages 静态资源请求均包含 `/original-blog-pages`。
6. 未知路径显示定制 404；文章、标签和项目详情直接刷新仍可用。

发现问题后必须修复、重新构建、提交、等待对应平台完成新部署，再从 HTTP 矩阵和浏览器检查起点复验。

## 最终证据模板

把当前结果写入 [`acceptance.md`](acceptance.md) 的“最终证据”，至少包含：

```text
Vercel URL:
Vercel deployment SHA / Ready 时间:
Pages URL: https://original4422.github.io/original-blog-pages/
Pages workflow run / deployment SHA:
verify-site.sh 两次运行结果与日期（Asia/Shanghai）:
桌面、移动、深浅主题、搜索和 Console 检查结果:
```

只有两版生产 URL 均通过自动化矩阵和浏览器复检，且证据对应当前部署 SHA，才满足上线完成条件。
