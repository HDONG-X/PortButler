# Port Butler

**Port Butler** — CLI для управления локальными портами в Windows и macOS. Он показывает слушающие порты, объясняет владельца процесса, защищает важные порты и создает план перед опасными действиями.

Languages: [English](README.md) | [简体中文](README.zh.md) | [繁體中文](README.zh-TW.md) | [한국어](README.ko.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Français](README.fr.md) | [Italiano](README.it.md) | [Dansk](README.da.md) | [日本語](README.ja.md) | [Polski](README.pl.md) | **Русский** | [Bosanski](README.bs.md) | [العربية](README.ar.md) | [Norsk](README.no.md) | [Português (Brasil)](README.pt-BR.md) | [ไทย](README.th.md) | [Türkçe](README.tr.md) | [Українська](README.uk.md) | [বাংলা](README.bn.md) | [Ελληνικά](README.el.md) | [Tiếng Việt](README.vi.md)

## Возможности

- Список портов с процессом, риском, защитой и zombie score.
- Объяснение порта через `/why` или `pbt why`.
- Kill plan перед завершением процесса.
- Защита важных портов.
- Предпросмотр кандидатов для очистки.
- Определение Node, Vite, Next.js, Docker, Postgres, Redis и Bun.
- Поддержка Windows и macOS.
- TUI через `pbt ui` или `bun run pbt`.
- JSON-вывод через `--json`.

## Быстрый старт

```bash
bun install
bun run pbt
```

```bash
bun run pbt ls
bun run pbt why 3000
bun run pbt kill 3000 --dry-run
```

## Команды

| Команда | Описание |
| --- | --- |
| `pbt` | Запускает TUI по умолчанию. |
| `pbt ls` | Показывает слушающие порты. |
| `pbt why <port>` | Объясняет владельца и классификацию. |
| `pbt kill <port>` | Создает kill plan. |
| `pbt protect <port>` | Защищает порт. |
| `pbt unprotect <port>` | Снимает защиту. |
| `pbt clean` | Показывает кандидатов на очистку. |
| `pbt open <port>` | Открывает `http://localhost:<port>`. |
| `pbt doctor` | Проверяет зависимости. |
| `pbt ui` | Запускает TUI. |

Опции: `--json`, `--verbose`, `--dry-run`, `--yes`, `--force`, `--config <path>`.

## TUI

Slash-команды: `/ls`, `/why 3000`, `/protect 3000`, `/unprotect 3000`, `/clean --dry-run`, `/doctor`, `/ip`.

Клавиши: `Tab` дополняет, `Ctrl+L` меняет язык, `Ctrl+C` или `Esc` выходит.

## Безопасность

Port Butler не завершает процессы напрямую из сканирования. Сначала создается план. Защищено по умолчанию:

```text
22  80  443  5432  6379  3306  27017
```

`clean` по умолчанию не очищает Docker, Postgres и Redis.

## Разработка

```bash
bun install
bun run typecheck
bun test packages/cli/src packages/config/src packages/core/src packages/detector/src packages/platform/src
bun run build
```

## Лицензия

У проекта пока нет лицензии. Добавьте ее перед публикацией.
