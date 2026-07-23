<div align="center">

<a href="https://godui.design">
  <img src="https://raw.githubusercontent.com/LucasBassetti/godui/main/apps/docs/public/og-image.png" alt="GodUI — 面向现代界面的 UI 组件集合" width="100%" />
</a>

<h1>GodUI</h1>

<p><a href="./README.md">English</a> · <a href="./README.zh-CN.md">简体中文</a> · <a href="./README.ja.md">日本語</a></p>

<p><strong>面向现代界面的 UI 组件集合。</strong></p>

<p>
  使用 React、TypeScript、Tailwind CSS v4 和 Motion 构建，
  并以 <a href="https://ui.shadcn.com">shadcn</a> 注册表的形式分发，
  因此组件会直接复制到你的项目中，
  每一行代码都由你掌控。
</p>

<p><a href="https://github.com/LucasBassetti/godui/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="许可证：MIT" /></a> <a href="https://github.com/LucasBassetti/godui/stargazers"><img src="https://img.shields.io/github/stars/LucasBassetti/godui?style=flat&logo=github&color=yellow" alt="GitHub Star" /></a> <a href="https://github.com/LucasBassetti/godui/commits/main"><img src="https://img.shields.io/github/last-commit/LucasBassetti/godui?logo=git&logoColor=white" alt="最近提交" /></a> <a href="https://github.com/LucasBassetti/godui/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="欢迎提交 PR" /></a></p>

<p><img src="https://img.shields.io/badge/React-18%20%7C%2019-149ECA?logo=react&logoColor=white" alt="React" /> <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" /> <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" /> <img src="https://img.shields.io/badge/Motion-0055FF?logo=framer&logoColor=white" alt="Motion" /> <img src="https://img.shields.io/badge/shadcn-compatible-000000?logo=shadcnui&logoColor=white" alt="兼容 shadcn" /></p>

<p>
  <a href="https://godui.design"><strong>文档</strong></a> ·
  <a href="https://godui.design/docs/components"><strong>组件</strong></a> ·
  <a href="https://godui.design/docs/installation"><strong>安装</strong></a> ·
  <a href="./CONTRIBUTING.md"><strong>参与贡献</strong></a>
</p>

</div>

---

## 概述

**GodUI** 是一个面向现代界面的 UI 组件集合，
提供开源的动画组件。
它使用 **React**、**TypeScript**、
**Tailwind CSS v4** 和 **Motion** 构建，并以 [shadcn](https://ui.shadcn.com)
注册表的形式分发，因此组件会直接复制到你的项目中，
每一行代码都由你掌控。

如果你已经在使用 [shadcn/ui](https://ui.shadcn.com)，
GodUI 的工作方式完全相同：
添加 `@godui` 注册表，然后按名称获取组件即可。

## ✨ 你将获得

- **代码完全归你掌控。** 组件通过 shadcn CLI 安装到你的代码库中，
  而不是隐藏在带版本号的依赖之后。
- **动效优先。** 每个组件开箱即带精心打磨且性能出色的动画。
- **原生适配 shadcn。** 安装流程与 shadcn/ui 相同。如果你已经在使用 shadcn，只需添加
  `@godui` 注册表。
- **Tailwind v4 设计令牌。** 使用 CSS 变量提供主题支持；
  无需额外配置即可使用浅色和深色模式。
- **类型安全。** 每个组件及其属性都提供完整的 TypeScript 类型。

## 📦 安装

GodUI 以 shadcn 注册表的形式分发。组件会直接复制到你的项目中，源代码完全由你掌控。

**1. 创建或配置项目：**

```bash
pnpm dlx shadcn@latest init
```

**2. 将 `@godui` 注册表添加到 `registries` 字段，并写入 `components.json`
（只需配置一次）：**

```json
{
  "registries": {
    "@godui": "https://godui.design/r/{name}.json"
  }
}
```

**3. 按名称添加任意组件：**

```bash
pnpm dlx shadcn@latest add @godui/magic-button
```

该命令会把组件复制到 `components/godui/`，
并自动将 GodUI 的主题令牌和组件样式合并到全局样式表中。

> 更喜欢零配置？跳过第 2 步，使用完整的注册表 URL 安装：
> `pnpm dlx shadcn@latest add https://godui.design/r/magic-button.json`

有关字体排印和深色模式的配置，
请参阅完整的[安装指南](https://godui.design/docs/installation)。

## 🚀 快速开始

安装组件后，导入并使用它：

```tsx
import { MagicButton } from "@/components/godui/magic-button";

export function Demo() {
  return <MagicButton size="lg">Get Started</MagicButton>;
}
```

## 🧩 组件

这是一个不断扩充的动画组件集合，按按钮、文本、浮层、导航、布局、特效、玻璃效果、
背景、可视化、输入控件等类别组织。

**[浏览所有组件 →](https://godui.design/docs/components)**

## 🛠️ 本地开发

GodUI 是一个基于 [pnpm](https://pnpm.io) 和 [Turborepo](https://turborepo.com)
的 monorepo。需要 **Node >= 20.19.0** 和 **pnpm 10.x**。

```bash
# Clone
git clone https://github.com/LucasBassetti/godui.git
cd godui

# Install dependencies
pnpm install

# Start everything (docs + storybook) in dev
pnpm dev

# Build the shadcn registry from registry.json
pnpm build:registry

# Run tests
pnpm test

# Lint & format with Biome
pnpm check        # check
pnpm check:fix    # check and auto-fix
```

## 📁 项目结构

```
godui/
├── apps/
│   ├── docs/          # Documentation site (Next.js + Fumadocs)
│   └── storybook/     # Component showcase (Storybook)
├── packages/
│   └── components/    # @godui/components — the component library
└── registry.json      # shadcn registry definition (source of truth)
```

## 🤝 参与贡献

欢迎贡献新组件、错误修复、文档和想法。
请先阅读[贡献指南](./CONTRIBUTING.md)，
并遵守我们的[行为准则](./CODE_OF_CONDUCT.md)。

## 📄 许可证

[MIT](./LICENSE) © Lucas Bassetti

## Star 历史

<a href="https://www.star-history.com/?repos=LucasBassetti%2Fgodui&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=LucasBassetti/godui&type=date&theme=dark&legend=top-left&sealed_token=Eco6rP5S6yhB-dwc1cgNpBCcbIi_Wg570aLFL_JgOQ8sDHnqysK_Dg_N_tEHNchW5IRlhIltx060Q0kZ8Dkk_b6ZigA559HwP7OMDalppL8khPsz0TWUrw" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=LucasBassetti/godui&type=date&legend=top-left&sealed_token=Eco6rP5S6yhB-dwc1cgNpBCcbIi_Wg570aLFL_JgOQ8sDHnqysK_Dg_N_tEHNchW5IRlhIltx060Q0kZ8Dkk_b6ZigA559HwP7OMDalppL8khPsz0TWUrw" />
   <img alt="Star 历史图表" src="https://api.star-history.com/chart?repos=LucasBassetti/godui&type=date&legend=top-left&sealed_token=Eco6rP5S6yhB-dwc1cgNpBCcbIi_Wg570aLFL_JgOQ8sDHnqysK_Dg_N_tEHNchW5IRlhIltx060Q0kZ8Dkk_b6ZigA559HwP7OMDalppL8khPsz0TWUrw" />
 </picture>
</a>

---

<div align="center">

由 <a href="https://github.com/LucasBassetti">Lucas Bassetti</a> 和
<a href="https://github.com/LucasBassetti/godui/graphs/contributors">各位贡献者</a>共同构建。

如果 GodUI 帮助你更快地发布产品，欢迎为<a href="https://github.com/LucasBassetti/godui">仓库点亮 Star</a> ⭐ ·
<a href="https://godui.design">godui.design</a>

</div>
