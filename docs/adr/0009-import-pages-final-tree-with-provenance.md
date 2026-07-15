---
status: accepted
---

# ADR-0009: 导入 Pages 最终文件树而不嫁接旧历史

`original-blog-pages` 只有少量独立初始化与上线修复提交，完整历史将由归档仓库永久保留。monorepo 不嫁接这组无关 Git 历史，而是将提交 `e76451c109b6da802b4d765ad518fc347bb6da0c`（tag `pre-monorepo-pages-2026-07-15`）的最终文件树一次性导入 `apps/pages`；导入提交必须记录原仓库地址和源提交，两个旧仓库还应在迁移前标记最终状态。

这样可以保持 monorepo 日志线性、清楚地表达架构迁移，同时仍能通过归档仓库和来源记录追溯 Pages 的原始开发过程。

## Consequences

- Vercel 原仓库历史随目录移动继续保留。
- Pages 在 monorepo 中从一次明确的迁移提交开始，不伪造两套历史的共同祖先。
- 归档 `original-blog-pages` 仓库成为旧 Pages 详细历史的查阅位置，但不再接收开发提交。
- 迁移验收必须核对导入树与 `e76451c109b6da802b4d765ad518fc347bb6da0c` 的内容边界，避免遗漏文件。

## Alternatives Considered

**合并无关历史或使用 subtree 保留全部提交**

- 未采用：仅三条旧提交不足以抵消合并日志和迁移操作的复杂度，且归档仓库已经保留完整证据。

**删除旧仓库历史**

- 未采用：会失去上线基线、部署记录和迁移前审计依据。
