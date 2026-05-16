# Port Butler

**Port Butler** to lokalny menedżer portów CLI dla Windows i macOS. Pokazuje porty nasłuchujące, wyjaśnia proces właściciela, chroni ważne porty i tworzy plan przed ryzykowną operacją.

Languages: [English](README.md) | [简体中文](README.zh.md) | [繁體中文](README.zh-TW.md) | [한국어](README.ko.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Français](README.fr.md) | [Italiano](README.it.md) | [Dansk](README.da.md) | [日本語](README.ja.md) | **Polski** | [Русский](README.ru.md) | [Bosanski](README.bs.md) | [العربية](README.ar.md) | [Norsk](README.no.md) | [Português (Brasil)](README.pt-BR.md) | [ไทย](README.th.md) | [Türkçe](README.tr.md) | [Українська](README.uk.md) | [বাংলা](README.bn.md) | [Ελληνικά](README.el.md) | [Tiếng Việt](README.vi.md)

## Funkcje

- Lista portów z procesem, ryzykiem, ochroną i zombie score.
- Wyjaśnienie portu przez `/why` lub `pbt why`.
- Kill plan przed zakończeniem procesu.
- Ochrona ważnych portów.
- Podgląd kandydatów do czyszczenia.
- Wykrywanie Node, Vite, Next.js, Docker, Postgres, Redis i Bun.
- Wsparcie Windows i macOS.
- TUI przez `pbt ui` lub `bun run pbt`.
- JSON z `--json`.

## Start

```bash
bun install
bun run pbt
```

```bash
bun run pbt ls
bun run pbt why 3000
bun run pbt kill 3000 --dry-run
```

## Polecenia

| Polecenie | Opis |
| --- | --- |
| `pbt` | Uruchamia TUI domyślnie. |
| `pbt ls` | Pokazuje porty nasłuchujące. |
| `pbt why <port>` | Wyjaśnia właściciela i klasyfikację. |
| `pbt kill <port>` | Tworzy kill plan. |
| `pbt protect <port>` | Chroni port. |
| `pbt unprotect <port>` | Usuwa ochronę. |
| `pbt clean` | Pokazuje kandydatów do czyszczenia. |
| `pbt open <port>` | Otwiera `http://localhost:<port>`. |
| `pbt doctor` | Sprawdza zależności. |
| `pbt ui` | Uruchamia TUI. |

Opcje: `--json`, `--verbose`, `--dry-run`, `--yes`, `--force`, `--config <path>`.

## TUI

Polecenia slash: `/ls`, `/why 3000`, `/protect 3000`, `/unprotect 3000`, `/clean --dry-run`, `/doctor`, `/ip`.

Skróty: `Tab` uzupełnia, `Ctrl+L` zmienia język, `Ctrl+C` lub `Esc` zamyka.

## Bezpieczeństwo

Port Butler nie zabija procesów bezpośrednio ze skanowania. Najpierw tworzy plan. Domyślnie chronione:

```text
22  80  443  5432  6379  3306  27017
```

`clean` domyślnie nie usuwa Docker, Postgres ani Redis.

## Rozwój

```bash
bun install
bun run typecheck
bun test packages/cli/src packages/config/src packages/core/src packages/detector/src packages/platform/src
bun run build
```

## Licencja

Projekt nie ma jeszcze licencji. Dodaj ją przed publikacją.
