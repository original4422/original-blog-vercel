---
status: accepted
---

# ADR-0008: 由 original-blog-vercel 承接并最终命名 monorepo

现有 `original-blog-vercel` 仓库承载主站、Vercel 部署关系和权威内容源，因此由这个 Git 仓库原地演进为 monorepo。迁移验证完成后，将仓库重命名为中立的 `original-blog`；这是同一仓库的重命名，不改变权威内容所有权。

Vercel 应用迁入 `apps/vercel`，Pages 应用迁入 `apps/pages`。迁移期间保留现有 Pages 站点，只有新仓库中的 Pages 构建、访问与恢复验收通过后，才归档 `original-blog-pages` 仓库；旧仓库不删除，以保留审计和回溯依据。

当前没有自定义域名。GitHub 不会在仓库重命名后重定向项目型 Pages URL，因此新 Pages 的最终线上验收必须发生在承接仓库已重命名为 `original-blog` 之后。重命名前只验证静态产物和 CI，旧 `original-blog-pages` 继续承担公开访问，不把临时 `/original-blog-vercel/` Pages 地址视为迁移目标。

## Consequences

- 尽量保留现有主站 Git/Vercel 关系，减少重新绑定生产部署的范围。
- 仓库名称从平台导向变为产品导向，避免未来更换主站托管平台时再次改名。
- 移动 Vercel 应用目录后，需要显式更新并验证 Vercel Root Directory。
- 新旧 Pages 部署需要短期并行，避免迁移过程直接切断现有对照站。
- 仓库重命名必须先于新 Pages 最终启用，避免在没有自定义域名时产生一次无意义的项目站点 URL 迁移。
- Pages 旧提交不嫁接进 monorepo 历史，具体导入和追溯方式由 ADR-0009 决定；旧仓库保留为只读归档。

## Alternatives Considered

**新建 original-blog 仓库**

- 未采用：会额外迁移主站 Git 连接、仓库设置和部署状态，却不能增加故障域独立性。

**由 original-blog-pages 承接 monorepo**

- 未采用：会让权威内容源和主站部署绕行到原对照站仓库，违背已经确定的所有权方向。

**永久保留 original-blog-vercel 名称**

- 未采用：平台名称不应成为个人数字花园的长期产品名称。
