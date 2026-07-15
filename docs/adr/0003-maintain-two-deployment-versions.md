# ADR-0003: 维护两个独立部署版本

## Status

Superseded by ADR-0007

## Context

网站需要同时验证纯 GitHub Pages 与 GitHub + Vercel 两种发布方式。两者共享相同的产品目标、内容占位符和参考设计，但静态导出约束、图片处理、搜索索引、分析工具和部署配置不同。将两种配置混在同一代码根目录会增加条件分支，并可能使一个平台的修复破坏另一个平台。

## Decision

在 `personal-blog/` 总工作区下维护 `github-pages/` 和 `github-vercel/` 两个独立版本根目录，后续分别初始化 Git 仓库、安装依赖、测试和部署。先以 GitHub + Vercel 版本复现参考项目的原生行为，再将经过验证的页面和组件移植到 GitHub Pages 版本并完成静态化适配。共享产品术语和跨版本架构决策继续保存在总工作区根目录。

## Consequences

### Positive

- 两个版本可以独立构建、发布、回滚和验证。
- GitHub Pages 的静态限制不会污染 Vercel 版本的原生 Next.js 配置。
- 可以基于实际部署结果比较成本、性能、功能和维护体验。

### Negative

- 通用功能修复可能需要同步到两个版本。
- 两套依赖和源码会占用更多磁盘空间，并存在长期漂移风险。
- 发布权限、远程仓库和部署状态需要分别管理。

### Neutral

- 两个版本使用不同公开网址。
- 占位内容和真实内容替换可以按相同数据约定同步进行。

## Alternatives Considered

**单仓库条件化构建**

- 未采用：会在路由、图片、搜索和分析代码中引入平台判断，使调试和验收边界不清晰。

**只维护 Vercel 版本**

- 未采用：无法验证纯 GitHub Pages 是否满足个人博客的长期托管需求。

## References

- https://github.com/yunshenwuchuxun/yunshen-blogv1
- https://docs.github.com/pages
- https://vercel.com/docs/deployments/git
