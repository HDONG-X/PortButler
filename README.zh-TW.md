# Port Butler

**Port Butler** 是一個支援 Windows 與 macOS 的本機連接埠管理 CLI。它可協助開發者查看監聽連接埠、理解連接埠由哪個程序占用、保護重要連接埠、預覽危險清理動作，並提供終端 UI。

語言： [English](README.md) | [简体中文](README.zh.md) | **繁體中文** | [한국어](README.ko.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Français](README.fr.md) | [Italiano](README.it.md) | [Dansk](README.da.md) | [日本語](README.ja.md) | [Polski](README.pl.md) | [Русский](README.ru.md) | [Bosanski](README.bs.md) | [العربية](README.ar.md) | [Norsk](README.no.md) | [Português (Brasil)](README.pt-BR.md) | [ไทย](README.th.md) | [Türkçe](README.tr.md) | [Українська](README.uk.md) | [বাংলা](README.bn.md) | [Ελληνικά](README.el.md) | [Tiếng Việt](README.vi.md)

## 為什麼需要 Port Butler？

本機開發常會留下 Node、Vite、Next.js、Docker、Postgres、Redis 或舊的背景程序占用連接埠。Port Butler 提供 `pbt`，讓你安全地查看、判斷與處理。

## 功能

- 列出監聽連接埠，包含程序、風險、保護狀態與僵屍評分。
- 使用 `/why` 或 `pbt why` 解釋指定連接埠。
- 所有 kill 動作都會先產生 kill plan。
- 保護重要連接埠，避免誤殺。
- 清理前先預覽候選程序。
- 辨識 Node、Vite、Next.js、Docker、Postgres、Redis、Bun。
- 支援 Windows 與 macOS。
- 透過 `pbt ui` 或 `bun run pbt` 開啟終端 UI。
- 支援 `--json` 方便腳本整合。

## 快速開始

```bash
bun install
bun run pbt
```

```bash
bun run pbt ls
bun run pbt why 3000
bun run pbt kill 3000 --dry-run
```

## 常用命令

| 命令 | 說明 |
| --- | --- |
| `pbt` | 預設啟動終端 UI。 |
| `pbt ls` | 列出監聽連接埠。 |
| `pbt why <port>` | 解釋連接埠歸屬與識別依據。 |
| `pbt kill <port>` | 產生 kill plan，確認後再加 `--yes`。 |
| `pbt protect <port>` | 將連接埠加入保護清單。 |
| `pbt unprotect <port>` | 從保護清單移除連接埠。 |
| `pbt clean` | 預覽僵屍開發程序清理候選。 |
| `pbt open <port>` | 開啟 `http://localhost:<port>`。 |
| `pbt doctor` | 檢查平台依賴。 |
| `pbt ui` | 啟動終端 UI。 |

全域選項：`--json`、`--verbose`、`--dry-run`、`--yes`、`--force`、`--config <path>`。

## 終端 UI

Slash 命令：`/ls`、`/why 3000`、`/protect 3000`、`/unprotect 3000`、`/clean --dry-run`、`/doctor`、`/ip`。

快捷鍵：`Tab` 補齊、`Ctrl+L` 切換語言、`Ctrl+C` 或 `Esc` 退出。

## 安全模型

Port Butler 不會在掃描階段直接 kill。危險操作必須先產生 kill plan。預設保護：

```text
22  80  443  5432  6379  3306  27017
```

`clean` 預設不會清理 Docker、Postgres、Redis。

## 開發

```bash
bun install
bun run typecheck
bun test packages/cli/src packages/config/src packages/core/src packages/detector/src packages/platform/src
bun run build
```

## 授權

專案尚未加入授權條款。發布或接受外部貢獻前請先新增授權。
