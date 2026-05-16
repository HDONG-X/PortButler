# Port Butler

**Port Butler** は Windows と macOS 向けのローカルポート管理 CLI です。待ち受け中のポート、所有プロセス、リスク、保護状態を確認し、安全に操作できます。

Languages: [English](README.md) | [简体中文](README.zh.md) | [繁體中文](README.zh-TW.md) | [한국어](README.ko.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Français](README.fr.md) | [Italiano](README.it.md) | [Dansk](README.da.md) | **日本語** | [Polski](README.pl.md) | [Русский](README.ru.md) | [Bosanski](README.bs.md) | [العربية](README.ar.md) | [Norsk](README.no.md) | [Português (Brasil)](README.pt-BR.md) | [ไทย](README.th.md) | [Türkçe](README.tr.md) | [Українська](README.uk.md) | [বাংলা](README.bn.md) | [Ελληνικά](README.el.md) | [Tiếng Việt](README.vi.md)

## 機能

- ローカルの待ち受けポートをプロセス、リスク、保護状態、zombie score とともに表示。
- `/why` または `pbt why` で指定ポートを説明。
- kill の前に必ず kill plan を作成。
- 重要なポートを保護。
- cleanup 候補を事前表示。
- Node、Vite、Next.js、Docker、Postgres、Redis、Bun を検出。
- Windows と macOS をサポート。
- `pbt ui` または `bun run pbt` で TUI を起動。
- `--json` 出力に対応。

## クイックスタート

```bash
bun install
bun run pbt
```

```bash
bun run pbt ls
bun run pbt why 3000
bun run pbt kill 3000 --dry-run
```

## コマンド

| コマンド | 説明 |
| --- | --- |
| `pbt` | デフォルトで TUI を起動。 |
| `pbt ls` | 待ち受けポートを一覧表示。 |
| `pbt why <port>` | 所有者と分類理由を説明。 |
| `pbt kill <port>` | kill plan を作成。 |
| `pbt protect <port>` | ポートを保護。 |
| `pbt unprotect <port>` | 保護を解除。 |
| `pbt clean` | cleanup 候補を表示。 |
| `pbt open <port>` | `http://localhost:<port>` を開く。 |
| `pbt doctor` | 依存関係を確認。 |
| `pbt ui` | TUI を起動。 |

オプション: `--json`, `--verbose`, `--dry-run`, `--yes`, `--force`, `--config <path>`.

## TUI

Slash コマンド: `/ls`, `/why 3000`, `/protect 3000`, `/unprotect 3000`, `/clean --dry-run`, `/doctor`, `/ip`.

ショートカット: `Tab` 補完、`Ctrl+L` 言語切替、`Ctrl+C` または `Esc` 終了。

## 安全性

Port Butler はスキャン処理から直接 kill しません。危険な操作は先に plan を作ります。デフォルト保護ポート:

```text
22  80  443  5432  6379  3306  27017
```

`clean` はデフォルトで Docker、Postgres、Redis を削除しません。

## 開発

```bash
bun install
bun run typecheck
bun test packages/cli/src packages/config/src packages/core/src packages/detector/src packages/platform/src
bun run build
```

## ライセンス

このプロジェクトにはまだライセンスがありません。公開前に追加してください。
