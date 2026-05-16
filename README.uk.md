# Port Butler

**Port Butler** — CLI для керування локальними портами у Windows і macOS. Він показує порти, пояснює процес-власник, захищає важливі порти та створює план перед ризикованими діями.

Languages: [English](README.md) | [简体中文](README.zh.md) | [繁體中文](README.zh-TW.md) | [한국어](README.ko.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Français](README.fr.md) | [Italiano](README.it.md) | [Dansk](README.da.md) | [日本語](README.ja.md) | [Polski](README.pl.md) | [Русский](README.ru.md) | [Bosanski](README.bs.md) | [العربية](README.ar.md) | [Norsk](README.no.md) | [Português (Brasil)](README.pt-BR.md) | [ไทย](README.th.md) | [Türkçe](README.tr.md) | **Українська** | [বাংলা](README.bn.md) | [Ελληνικά](README.el.md) | [Tiếng Việt](README.vi.md)

## Можливості

- Список портів із процесом, ризиком, захистом і zombie score.
- Пояснення порту через `/why` або `pbt why`.
- Kill plan перед завершенням процесу.
- Захист важливих портів.
- Попередній перегляд кандидатів для очищення.
- Виявлення Node, Vite, Next.js, Docker, Postgres, Redis і Bun.
- Підтримка Windows і macOS.
- TUI через `pbt ui` або `bun run pbt`.
- JSON-вивід через `--json`.

## Швидкий старт

```bash
bun install
bun run pbt
```

```bash
bun run pbt ls
bun run pbt why 3000
bun run pbt kill 3000 --dry-run
```

## Команди

| Команда | Опис |
| --- | --- |
| `pbt` | Запускає TUI за замовчуванням. |
| `pbt ls` | Показує порти, що слухають. |
| `pbt why <port>` | Пояснює власника і класифікацію. |
| `pbt kill <port>` | Створює kill plan. |
| `pbt protect <port>` | Захищає порт. |
| `pbt unprotect <port>` | Знімає захист. |
| `pbt clean` | Показує кандидатів для очищення. |
| `pbt open <port>` | Відкриває `http://localhost:<port>`. |
| `pbt doctor` | Перевіряє залежності. |
| `pbt ui` | Запускає TUI. |

Опції: `--json`, `--verbose`, `--dry-run`, `--yes`, `--force`, `--config <path>`.

## TUI

Slash-команди: `/ls`, `/why 3000`, `/protect 3000`, `/unprotect 3000`, `/clean --dry-run`, `/doctor`, `/ip`.

Клавіші: `Tab` доповнює, `Ctrl+L` змінює мову, `Ctrl+C` або `Esc` виходить.

## Безпека

Port Butler не завершує процеси напряму під час сканування. Спочатку створюється план. Захищені за замовчуванням:

```text
22  80  443  5432  6379  3306  27017
```

`clean` за замовчуванням не очищає Docker, Postgres і Redis.

## Розробка

```bash
bun install
bun run typecheck
bun test packages/cli/src packages/config/src packages/core/src packages/detector/src packages/platform/src
bun run build
```

## Ліцензія

Проєкт ще не має ліцензії. Додайте її перед публікацією.
