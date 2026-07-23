<div align="center">

<a href="https://godui.design">
  <img src="https://raw.githubusercontent.com/LucasBassetti/godui/main/apps/docs/public/og-image.png" alt="GodUI — モダンなインターフェースのための UI コレクション" width="100%" />
</a>

<h1>GodUI</h1>

<p><a href="./README.md">English</a> · <a href="./README.zh-CN.md">简体中文</a> · <a href="./README.ja.md">日本語</a></p>

<p><strong>モダンなインターフェースのための UI コレクション。</strong></p>

<p>
  React、TypeScript、Tailwind CSS v4、Motion で構築され、
  <a href="https://ui.shadcn.com">shadcn</a> レジストリとして配布されています。
  コンポーネントはプロジェクトへ直接コピーされるため、すべてのコードを自分で管理できます。
</p>

<p><a href="https://github.com/LucasBassetti/godui/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="ライセンス：MIT" /></a> <a href="https://github.com/LucasBassetti/godui/stargazers"><img src="https://img.shields.io/github/stars/LucasBassetti/godui?style=flat&logo=github&color=yellow" alt="GitHub Star" /></a> <a href="https://github.com/LucasBassetti/godui/commits/main"><img src="https://img.shields.io/github/last-commit/LucasBassetti/godui?logo=git&logoColor=white" alt="最終コミット" /></a> <a href="https://github.com/LucasBassetti/godui/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PR を歓迎" /></a></p>

<p><img src="https://img.shields.io/badge/React-18%20%7C%2019-149ECA?logo=react&logoColor=white" alt="React" /> <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" /> <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" /> <img src="https://img.shields.io/badge/Motion-0055FF?logo=framer&logoColor=white" alt="Motion" /> <img src="https://img.shields.io/badge/shadcn-compatible-000000?logo=shadcnui&logoColor=white" alt="shadcn 互換" /></p>

<p>
  <a href="https://godui.design"><strong>ドキュメント</strong></a> ·
  <a href="https://godui.design/docs/components"><strong>コンポーネント</strong></a> ·
  <a href="https://godui.design/docs/installation"><strong>インストール</strong></a> ·
  <a href="./CONTRIBUTING.md"><strong>コントリビューション</strong></a>
</p>

</div>

---

## 概要

**GodUI** は、モダンなインターフェースのための
UI コレクションです。
オープンソースのアニメーション付きコンポーネントを提供します。
**React**、**TypeScript**、**Tailwind CSS v4**、**Motion** で構築され、
[shadcn](https://ui.shadcn.com) レジストリとして配布されています。
コンポーネントはプロジェクトへ直接コピーされるため、すべてのコードを自分で管理できます。

すでに [shadcn/ui](https://ui.shadcn.com) を使用している場合、
GodUI もまったく同じ手順で導入できます。
`@godui` レジストリを追加し、名前を指定してコンポーネントを取得するだけです。

## ✨ 提供されるもの

- **コードを自分で管理。** コンポーネントは shadcn CLI を介してコードベースへインストールされ、
  バージョン付き依存関係の背後に隠されることはありません。
- **モーションを重視。** すべてのコンポーネントに、洗練された高性能なアニメーションが標準で備わっています。
- **shadcn ネイティブ。** インストール手順は shadcn/ui と同じです。
  すでに shadcn を使用している場合は、`@godui` レジストリを追加するだけです。
- **Tailwind v4 トークン。** CSS 変数でテーマを設定しているため、追加設定なしでライトモードとダークモードが動作します。
- **型安全。** すべてのコンポーネントとその props に完全な TypeScript 型が用意されています。

## 📦 インストール

GodUI は shadcn レジストリとして配布されています。
コンポーネントはプロジェクトへ直接コピーされ、ソースコードを自分で管理できます。

**1. プロジェクトを作成または設定します：**

```bash
pnpm dlx shadcn@latest init
```

**2. `@godui` レジストリを `registries` フィールドへ追加し、`components.json` に記述します
（初回のみ）：**

```json
{
  "registries": {
    "@godui": "https://godui.design/r/{name}.json"
  }
}
```

**3. 名前を指定して任意のコンポーネントを追加します：**

```bash
pnpm dlx shadcn@latest add @godui/magic-button
```

コンポーネントが `components/godui/` へコピーされ、GodUI のテーマトークンとコンポーネントスタイルが
グローバルスタイルシートへ自動的にマージされます。

> 設定なしで使いたい場合は、手順 2 を省略して完全なレジストリ URL からインストールできます：
> `pnpm dlx shadcn@latest add https://godui.design/r/magic-button.json`

タイポグラフィとダークモードの設定については、完全な
[インストールガイド](https://godui.design/docs/installation)を参照してください。

## 🚀 クイックスタート

コンポーネントをインストールしたら、インポートして使用します：

```tsx
import { MagicButton } from "@/components/godui/magic-button";

export function Demo() {
  return <MagicButton size="lg">Get Started</MagicButton>;
}
```

## 🧩 コンポーネント

ボタン、テキスト、オーバーレイ、ナビゲーション、レイアウト、エフェクト、ガラス、
背景、ビジュアライゼーション、入力など、カテゴリ別に整理されたアニメーション付き
コンポーネントのコレクションは今後も拡充されます。

**[すべてのコンポーネントを見る →](https://godui.design/docs/components)**

## 🛠️ ローカル開発

GodUI は [pnpm](https://pnpm.io) と [Turborepo](https://turborepo.com) を使用した
monorepo です。**Node >= 20.19.0** と **pnpm 10.x** が必要です。

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

## 📁 プロジェクト構成

```
godui/
├── apps/
│   ├── docs/          # Documentation site (Next.js + Fumadocs)
│   └── storybook/     # Component showcase (Storybook)
├── packages/
│   └── components/    # @godui/components — the component library
└── registry.json      # shadcn registry definition (source of truth)
```

## 🤝 コントリビューション

新しいコンポーネント、バグ修正、ドキュメント、アイデアのコントリビューションを歓迎します。
はじめに[コントリビューションガイド](./CONTRIBUTING.md)を読み、
[行動規範](./CODE_OF_CONDUCT.md)に従ってください。

## 📄 ライセンス

[MIT](./LICENSE) © Lucas Bassetti

## Star の推移

<a href="https://www.star-history.com/?repos=LucasBassetti%2Fgodui&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=LucasBassetti/godui&type=date&theme=dark&legend=top-left&sealed_token=Eco6rP5S6yhB-dwc1cgNpBCcbIi_Wg570aLFL_JgOQ8sDHnqysK_Dg_N_tEHNchW5IRlhIltx060Q0kZ8Dkk_b6ZigA559HwP7OMDalppL8khPsz0TWUrw" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=LucasBassetti/godui&type=date&legend=top-left&sealed_token=Eco6rP5S6yhB-dwc1cgNpBCcbIi_Wg570aLFL_JgOQ8sDHnqysK_Dg_N_tEHNchW5IRlhIltx060Q0kZ8Dkk_b6ZigA559HwP7OMDalppL8khPsz0TWUrw" />
   <img alt="Star の推移を示すグラフ" src="https://api.star-history.com/chart?repos=LucasBassetti/godui&type=date&legend=top-left&sealed_token=Eco6rP5S6yhB-dwc1cgNpBCcbIi_Wg570aLFL_JgOQ8sDHnqysK_Dg_N_tEHNchW5IRlhIltx060Q0kZ8Dkk_b6ZigA559HwP7OMDalppL8khPsz0TWUrw" />
 </picture>
</a>

---

<div align="center">

<a href="https://github.com/LucasBassetti">Lucas Bassetti</a> と
<a href="https://github.com/LucasBassetti/godui/graphs/contributors">コントリビューター</a>によって構築されています。

GodUI がプロダクトのリリースに役立ったら、<a href="https://github.com/LucasBassetti/godui">リポジトリに Star</a>をお願いします ⭐ ·
<a href="https://godui.design">godui.design</a>

</div>
