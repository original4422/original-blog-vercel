---
status: accepted
---

# ADR-0006: original-blog-vercel 仓库拥有权威内容源

GitHub 上当前名为 `original-blog-vercel` 的仓库既是主站实现仓库，也是全部公开语义内容的权威来源。内容将在仓库内采用与 Next.js 页面实现解耦的规范结构；作者只在这个来源中创作和修改内容，Pages 实现只能消费或派生它。ADR-0008 决定由同一个 Git 仓库承接 monorepo，并在迁移验证后将其重命名为 `original-blog`。

这里的所有权属于 Git 仓库，不属于 Vercel 托管平台。即使更换主站部署平台，内容历史和权威关系仍由 GitHub 仓库保持。

## Consequences

- 不新增第三个内容仓库，也不把两个实现合并为单一条件化代码库。
- Pages 仓库中的内容不得成为可独立编辑的第二来源。
- Pages 需要记录其内容对应的权威源提交，以便验证一致性和恢复点。
- 具体同步机制需要兼顾日常维护成本与未来灾备独立性。

## Alternatives Considered

**独立 original-blog-content 仓库**

- 未采用：平台中立性更强，但会增加第三个仓库、触发链和版本协调成本。

**合并为 monorepo**

- 未采用：虽然共享内容直接，但会改变已经验证的双仓库部署与比较边界。

**由 Pages 仓库拥有内容**

- 未采用：内容权威与唯一主站的发布路径相反，会增加日常创作和发布绕行。
