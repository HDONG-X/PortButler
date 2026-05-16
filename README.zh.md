# Port Butler

**Port Butler** 是一个支持 Windows 与 macOS 的本地端口管家 CLI。它可以帮助开发者查看监听端口、解释端口归属、保护关键端口、预览危险清理操作，并提供更安全的终端 UI 工作流。

语言： [English](README.md) | **简体中文** | [繁體中文](README.zh-TW.md) | [한국어](README.ko.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Français](README.fr.md) | [Italiano](README.it.md) | [Dansk](README.da.md) | [日本語](README.ja.md) | [Polski](README.pl.md) | [Русский](README.ru.md) | [Bosanski](README.bs.md) | [العربية](README.ar.md) | [Norsk](README.no.md) | [Português (Brasil)](README.pt-BR.md) | [ไทย](README.th.md) | [Türkçe](README.tr.md) | [Українська](README.uk.md) | [বাংলা](README.bn.md) | [Ελληνικά](README.el.md) | [Tiếng Việt](README.vi.md)

## 为什么需要 Port Butler？

本地开发时，Node、Vite、Next.js、Docker、Postgres、Redis 或旧的后台进程经常占用端口。Port Butler 提供统一命令 `pbt`，让你清楚知道谁在占用端口，并安全地决定下一步。

## 功能特性

- 列出本地监听端口，并展示进程、风险、保护状态和僵尸评分。
- 使用 `/why` 或 `pbt why` 解释指定端口。
- 所有 kill 操作都会先生成 kill plan。
- 支持保护关键端口，避免误杀。
- 清理僵尸开发进程前先预览候选项。
- 识别 Node、Vite、Next.js、Docker、Postgres、Redis、Bun。
- 支持 Windows 与 macOS。
- 通过 `pbt ui` 或 `bun run pbt` 打开终端 UI。
- 支持 `--json`，便于脚本集成。

## 快速开始

```bash
bun install
bun run pbt
```

直接执行命令：

```bash
bun run pbt ls
bun run pbt why 3000
bun run pbt kill 3000 --dry-run
```

## 命令

| 命令 | 说明 |
| --- | --- |
| `pbt` | 默认启动终端 UI。 |
| `pbt ls` | 列出监听端口。 |
| `pbt why <port>` | 解释端口归属和识别依据。 |
| `pbt kill <port>` | 生成 kill plan，确认后再加 `--yes`。 |
| `pbt protect <port>` | 将端口加入保护列表。 |
| `pbt unprotect <port>` | 从保护列表移除端口。 |
| `pbt clean` | 预览僵尸开发进程清理候选。 |
| `pbt open <port>` | 打开 `http://localhost:<port>`。 |
| `pbt doctor` | 检查平台依赖和命令可用性。 |
| `pbt ui` | 显式启动终端 UI。 |

全局选项：`--json`、`--verbose`、`--dry-run`、`--yes`、`--force`、`--config <path>`。

## 终端 UI

TUI 使用 slash 命令：

```text
/ls
/why 3000
/protect 3000
/unprotect 3000
/clean --dry-run
/doctor
/ip
```

快捷键：

- `Tab`：补齐 slash 命令。
- `Ctrl+L`：切换语言。
- `Ctrl+C` 或 `Esc`：退出。

## 安全模型

Port Butler 禁止扫描逻辑直接 kill。所有危险操作都必须先生成 kill plan。默认保护端口：

```text
22  80  443  5432  6379  3306  27017
```

`clean` 默认不会清理 Docker、Postgres、Redis。

## 开发

```bash
bun install
bun run typecheck
bun test packages/cli/src packages/config/src packages/core/src packages/detector/src packages/platform/src
bun run build
```

本仓库使用 Bun Workspaces、Turborepo、TypeScript、Effect、JSONC、Solid/OpenTUI 和 Prettier。

## Monorepo 结构

```text
packages/cli       CLI 入口和命令路由
packages/core      端口解释、kill plan、清理逻辑
packages/platform  Windows/macOS 平台适配
packages/config    JSONC 配置和默认值
packages/detector  进程识别和僵尸评分
packages/tui       终端 UI
packages/theme     主题变量
packages/testkit   测试工具
```

## 许可证

项目暂未添加许可证。发布或接受外部贡献前请先添加许可证。
