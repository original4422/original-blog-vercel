# ADR-0002: 使用 GitHub 与 Vercel 构建和发布网站

## Status

Accepted

## Context

本站基于 `yunshenwuchuxun/yunshen-blogv1` 的 MIT 许可源码进行裁剪和个性化，需要保留 Next.js 16 的完整能力、参考站的动画体验，并让后续提交能够自动生成预览和生产部署。项目是个人公开博客，首版不需要数据库、管理后台或外部 API 密钥。

## Decision

使用 GitHub 托管源码并作为版本控制与发布触发源，使用 Vercel 托管 Next.js 网站。生产分支的提交自动部署到 Vercel；其他分支或拉取请求生成预览部署。首版可使用 Vercel 提供的公开域名，自定义域名作为独立的后续决策。复用源码时保留原 MIT 许可证与版权声明，并使用本站自己的内容和资源。

## Consequences

### Positive

- 与参考项目原生部署方式一致，无须将 Next.js 改造成受限的纯静态导出。
- 支持预览部署、生产自动部署、回滚、图片优化和 Vercel Analytics。
- 首版不需要自行购买或维护服务器。

### Negative

- 线上发布依赖 GitHub 与 Vercel 两个平台及其账户授权。
- Vercel Hobby 只适用于个人、非商业用途；用途变化时需要重新评估套餐或托管平台。
- 平台账户、GitHub App 安装和域名 DNS 权限需要由网站所有者持有并授权。

### Neutral

- 内容仍以仓库中的 MDX 文件管理，通过 Git 提交发布。
- 首版不引入数据库、CMS 或服务器密钥。

## Alternatives Considered

**GitHub Pages**

- 未采用：需要静态导出改造，并替换动态路由枚举、图片优化、搜索索引和 Vercel Analytics。
- 优点：只依赖 GitHub，部署边界更简单。

**自建服务器**

- 未采用：会增加服务器购买、安全更新、反向代理、证书和监控的运维成本，个人博客首版没有必要。

## References

- https://github.com/yunshenwuchuxun/yunshen-blogv1
- https://vercel.com/docs/deployments/git
- https://vercel.com/docs/plans/hobby
