# 2026-07-16 真实内容发布观察记录

## 状态

- 当前状态：已完成
- 时区：Asia/Shanghai（UTC+8）
- 观察开始：2026-07-16 23:00:19
- 最早关闭：2026-07-17 23:00:19
- 实际关闭：2026-07-17 23:50:28
- 持续时间：24 小时 50 分 09 秒
- 旧仓库：`original4422/original-blog-pages` 已归档

本记录用于证明一次真实公开内容变更能够从单一内容源同时进入 Vercel 主站与 GitHub Pages 温备站，并在观察窗内持续可用。观察窗结束前不归档旧 Pages 仓库。

## 发布范围与版本

- 内容提交：`c301a1705f751d640a3f87c1bf5347bb26045b78`
- 观察基线：`c0da902c46cdce4992046528f887215b446aeb31`
- 基线说明：内容提交上线后的移动端检查发现 Pages 教程页会被长代码块撑宽；`c0da902` 为 `.prose` 解除 Grid 固有最小宽度，并加入 320px、390px E2E 回归检查。观察窗从修复完成并通过双端生产复核后开始。
- Vercel 构建时间：`2026-07-16T14:56:28.012Z`
- Pages 构建时间：`2026-07-16T14:56:37.044Z`

观察期间可能继续提交不改变文章内容的证据文档。最终复查以“两个 `/version.json` 均等于当时 `origin/main`”为版本判据，同时保留上述内容与修复提交作为发布谱系。

## 公开文章

### 工程复盘

- Vercel：<https://original-blog-vercel.vercel.app/blog/from-two-blogs-to-one-system/>
- Pages：<https://original4422.github.io/original-blog/blog/from-two-blogs-to-one-system/>

### 可复现教程

- Vercel：<https://original-blog-vercel.vercel.app/blog/vercel-pages-monorepo-guide/>
- Pages：<https://original4422.github.io/original-blog/blog/vercel-pages-monorepo-guide/>

## 自动化证据

### 内容提交 `c301a17`

- [CI run 29505941385](https://github.com/original4422/original-blog/actions/runs/29505941385)：success
- [Pages run 29505944457](https://github.com/original4422/original-blog/actions/runs/29505944457)：success
- [新鲜度 run 29505943499](https://github.com/original4422/original-blog/actions/runs/29505943499)：success

### 修复提交 `c0da902`

- [CI run 29508856151](https://github.com/original4422/original-blog/actions/runs/29508856151)：success
- [Pages run 29508856238](https://github.com/original4422/original-blog/actions/runs/29508856238)：success
- [新鲜度 run 29508856359](https://github.com/original4422/original-blog/actions/runs/29508856359)：success

### 观察记录提交 `2ebfe65`

- [CI run 29509271131](https://github.com/original4422/original-blog/actions/runs/29509271131)：success
- [Pages run 29509270822](https://github.com/original4422/original-blog/actions/runs/29509270822)：success
- [新鲜度 run 29509269723](https://github.com/original4422/original-blog/actions/runs/29509269723)：success

## 观察窗前即时验收

| 检查项 | 结果 |
| --- | --- |
| Vercel `/version.json` | 200，指向 `c0da902` |
| Pages `/version.json` | 200，指向 `c0da902` |
| 两篇文章的四个公开路由 | 全部 200，标题正确 |
| 四张共享媒体在两端的八个请求 | 全部 200，类型与字节数一致 |
| Feed、Sitemap、搜索索引 | 两端均 200，均包含两个新 slug |
| 未知媒体路径 | 两端均为 404 |
| Vercel Web Analytics | 已由站点所有者启用并重新生产部署；`/_vercel/insights/script.js` 为 200 |
| 1280px、390px、320px 浏览器复核 | 四个文章路由均无页面级横向溢出，控制台与页面错误为空 |
| 图片解码 | 两端图片可解码；Pages 复盘页四张正文图显式 `decode()` 成功，无失败请求 |
| 旧 Pages 仓库 | `archived=false` |

本地 Node 24 门禁同时通过：`audit:content`、`check`、`typecheck`、两套 `build`、Pages `audit:static`、`audit:versions` 和 6 项 Playwright E2E。

## 观察窗关闭条件

以下条件已在 2026-07-17 23:00:19 之后重新检查：

- [x] `origin/main`、Vercel 与 Pages 均指向 `2ebfe65fe81a52d8bd589c01a56f252b7699d64e`。
- [x] 两篇文章的四个公开入口和四张共享媒体的八个请求仍可访问。
- [x] 两端 Feed、Sitemap 与搜索索引仍包含两个新 slug。
- [x] Vercel Web Analytics 脚本仍为 200，生产浏览器无关键错误。
- [x] 本观察窗相关的 CI、Pages 与新鲜度自动化全部成功。
- [x] 旧 Pages 仓库在全部检查通过前始终保持未归档，归档前旧站为 200。
- [x] 通过上述门禁后归档旧仓库，没有删除仓库、tag、Actions 或历史。

## 最终结果

最终门禁在 1280×800、390×844 和 320×568 三种视口检查两篇文章的两个生产版本，共 12 个浏览器组合。所有页面最终响应 200，无页面级横向溢出；正文图片全部解码；控制台与页面错误为空。四张共享媒体在两端的类型和字节数一致，未知媒体路径保持 404。

旧仓库归档结果：

- 仓库 ID：`1296878185`；
- `archived=true`，`disabled=false`，默认分支仍为 `main`；
- 1 个分支、1 个 tag 和 4 条 Actions 运行记录仍可读取；
- 旧 Pages 地址在归档后仍返回 200；
- 归档后 Vercel 与新 Pages 的 `/version.json` 仍共同指向 `2ebfe65`。

原计划的一次性 Codex 复查因 RRULE 小时被按 UTC 解释而未在北京时间 23:05 触发。该错误配置已移除，数据库中没有执行记录；最终复查由用户在观察窗到期后明确要求人工执行。调度错误没有改变部署状态，且旧仓库直到全部人工门禁通过后才归档。

Task 9.4 至此完成。异地 Git 镜像属于后续独立任务，不因本次归档自动完成。
