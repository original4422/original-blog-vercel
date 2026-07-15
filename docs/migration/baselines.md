# Monorepo 迁移前不可变基线

记录时间：2026-07-15 19:53:40 CST（Asia/Shanghai）

本文记录两个原仓库在 monorepo 整合前最后一次已验证、已部署的源提交。后续文件导入、回退和历史追溯必须引用完整 SHA 或对应 annotated tag，不能引用未提交工作树。

## Vercel 主站基线

- 原仓库：`https://github.com/original4422/original-blog-vercel.git`
- 提交：`c54b611267cc018e019fded6503c852fc7d30431`
- 标签：`pre-monorepo-vercel-2026-07-15`
- 正式地址：`https://original-blog-vercel.vercel.app/`
- GitHub Deployment：`5456484163`，环境 `Production`，状态 `success`
- Vercel deployment URL：`https://original-blog-vercel-mluhog4zn-original4422s-projects.vercel.app`

本地 `pnpm check`、`pnpm typecheck` 和生产构建通过，构建生成 31 个静态或 SSG 页面。正式首页返回 HTTP 200，公开邮箱为 `pzg24@mails.tsinghua.edu.cn`，旧邮箱不再出现。

## GitHub Pages 基线

- 原仓库：`https://github.com/original4422/original-blog-pages.git`
- 提交：`e76451c109b6da802b4d765ad518fc347bb6da0c`
- 标签：`pre-monorepo-pages-2026-07-15`
- 正式地址：`https://original4422.github.io/original-blog-pages/`
- GitHub Actions run：`29412989917`，结论 `success`
- build job：`87344243670`
- deploy job：`87344354049`

本地检查、生产静态导出与静态审计通过：24 条公开路由、8 条搜索记录、11 个标签页。线上浏览器验收结果：

- 320×568 与 390×844 下，移动菜单占满视口且 Blog、Tags、Projects、About 全部可见；
- 打开菜单后焦点进入 Blog，页面滚动锁定；Escape 关闭后焦点和滚动恢复；
- 从移动宽度切换到 1280×800 后自动恢复桌面导航；
- 联系邮箱为 `pzg24@mails.tsinghua.edu.cn`；
- 浏览器控制台无 warning 或 error。

## 导入与回退规则

- Vercel 原仓库历史由承接 monorepo 原地保留。
- Pages 只从 `pre-monorepo-pages-2026-07-15` 导出受跟踪文件树，不合并无关 Git 历史。
- 导入前生成排序 SHA-256 清单并随迁移提交保存。
- 新 Pages 完成最终仓库名下的访问、内容一致性和恢复验收前，旧 Pages 仓库与站点保持在线。
- 任一迁移阶段失败时，Vercel 可恢复到上述提交或其已知良好 deployment；Pages 可从上述 tag 重新构建静态产物。
