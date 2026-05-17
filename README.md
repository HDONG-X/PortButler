# Port Butler

**Port Butler** is a local port manager CLI for Windows and macOS. It helps developers inspect listening ports, understand which process owns a port, protect important ports, preview risky cleanup actions, and open a terminal UI with a safer workflow.

Languages: **English** | [简体中文](README.zh.md) | [繁體中文](README.zh-TW.md) | [한국어](README.ko.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Français](README.fr.md) | [Italiano](README.it.md) | [Dansk](README.da.md) | [日本語](README.ja.md) | [Polski](README.pl.md) | [Русский](README.ru.md) | [Bosanski](README.bs.md) | [العربية](README.ar.md) | [Norsk](README.no.md) | [Português (Brasil)](README.pt-BR.md) | [ไทย](README.th.md) | [Türkçe](README.tr.md) | [Українська](README.uk.md) | [বাংলা](README.bn.md) | [Ελληνικά](README.el.md) | [Tiếng Việt](README.vi.md)

## Why Port Butler?

Local development often leaves ports occupied by Node, Vite, Next.js, Docker, Postgres, Redis, or old background processes. Port Butler gives you a single command, `pbt`, to see what is running and decide what to do safely.

## Features

- List local listening ports with process, risk, protection, and zombie-score context.
- Explain a specific port with `/why` or `pbt why`.
- Generate a kill plan before any process is terminated.
- Protect important ports from accidental `kill` and `clean`.
- Preview cleanup candidates before running destructive actions.
- Detect Node, Vite, Next.js, Docker, Postgres, Redis, and Bun processes.
- Support Windows and macOS platform commands.
- Provide a Solid/OpenTUI terminal interface via `pbt ui` or `bun run pbt`.
- Output JSON for scripting with `--json`.

## Quick Start

```bash
bun install
bun run pbt
```

On first launch, `bun run pbt` prepares the terminal UI build automatically if needed.

Run a command directly:

```bash
bun run pbt ls
bun run pbt why 3000
bun run pbt kill 3000 --dry-run
```

## Commands

| Command                | Description                                            |
| ---------------------- | ------------------------------------------------------ |
| `pbt`                  | Start the terminal UI by default.                      |
| `pbt ls`               | List listening ports.                                  |
| `pbt why <port>`       | Explain who owns a port and why it was classified.     |
| `pbt kill <port>`      | Create a kill plan. Add `--yes` only after review.     |
| `pbt protect <port>`   | Add a port to the protected list.                      |
| `pbt unprotect <port>` | Remove a port from the protected list.                 |
| `pbt clean`            | Preview zombie development-process cleanup candidates. |
| `pbt config path`      | Print the config file path Port Butler will use.       |
| `pbt config show`      | Print the merged runtime configuration as JSON.        |
| `pbt config init`      | Write the default configuration file.                  |
| `pbt open <port>`      | Open `http://localhost:<port>` in the default browser. |
| `pbt doctor`           | Check platform support and required commands.          |
| `pbt ui`               | Start the terminal UI explicitly.                      |
| `pbt version`          | Print the current Port Butler version.                 |

Global options: `--json`, `--verbose`, `--dry-run`, `--yes`, `--force`, `--include-infra`, `--no-color`, `--config <path>`.

## Terminal UI

The TUI uses slash commands:

```text
/ls
/why 3000
/protect 3000
/unprotect 3000
/clean --dry-run
/doctor
/ip
```

Keyboard shortcuts:

- `Tab`: complete slash commands.
- `Ctrl+L`: switch language.
- `Ctrl+C` or `Esc`: exit.

## Safety Model

Port Butler never kills directly from scan logic. Every dangerous action creates a kill plan first. By default, protected ports include:

```text
22  80  443  5432  6379  3306  27017
```

`clean` does not remove Docker, Postgres, or Redis by default.

`pbt kill <port>` displays the plan by default. Add `--yes` only after review; high-risk targets also require `--force`.

## Development

```bash
bun install
bun run typecheck
bun test packages/cli/src packages/config/src packages/core/src packages/detector/src packages/platform/src
bun run build
```

This repository uses Bun Workspaces, Turborepo, TypeScript, Effect, JSONC, Solid/OpenTUI, and Prettier.

Design and engineering notes live in:

- [Architecture](docs/architecture.md)
- [CLI spec](docs/cli-spec.md)
- [Safety model](docs/safety.md)
- [Detector rules](docs/detector-rules.md)
- [Release notes](docs/release.md)

## Monorepo Layout

```text
packages/cli       CLI entrypoint and command routing
packages/core      port explanation, kill plans, cleanup logic
packages/platform  Windows/macOS process and port adapters
packages/config    JSONC configuration and defaults
packages/detector  process classification and zombie scoring
packages/tui       terminal UI
packages/theme     shared theme tokens
packages/testkit   test helpers
```

## License

Apache License 2.0. See [LICENSE](LICENSE).
