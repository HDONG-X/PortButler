# Port Butler

**Port Butler** er en lokal port-manager CLI til Windows og macOS. Den viser lyttende porte, forklarer hvilken proces der ejer en port, beskytter vigtige porte og laver planer før risikable handlinger.

Languages: [English](README.md) | [简体中文](README.zh.md) | [繁體中文](README.zh-TW.md) | [한국어](README.ko.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Français](README.fr.md) | [Italiano](README.it.md) | **Dansk** | [日本語](README.ja.md) | [Polski](README.pl.md) | [Русский](README.ru.md) | [Bosanski](README.bs.md) | [العربية](README.ar.md) | [Norsk](README.no.md) | [Português (Brasil)](README.pt-BR.md) | [ไทย](README.th.md) | [Türkçe](README.tr.md) | [Українська](README.uk.md) | [বাংলা](README.bn.md) | [Ελληνικά](README.el.md) | [Tiếng Việt](README.vi.md)

## Funktioner

- Vis lokale porte med proces, risiko, beskyttelse og zombie-score.
- Forklar en port med `/why` eller `pbt why`.
- Opret en kill-plan før en proces stoppes.
- Beskyt vigtige porte.
- Forhåndsvis cleanup-kandidater.
- Genkend Node, Vite, Next.js, Docker, Postgres, Redis og Bun.
- Understøtter Windows og macOS.
- TUI via `pbt ui` eller `bun run pbt`.
- JSON-output med `--json`.

## Hurtig start

```bash
bun install
bun run pbt
```

```bash
bun run pbt ls
bun run pbt why 3000
bun run pbt kill 3000 --dry-run
```

## Kommandoer

| Kommando | Beskrivelse |
| --- | --- |
| `pbt` | Starter TUI som standard. |
| `pbt ls` | Viser lyttende porte. |
| `pbt why <port>` | Forklarer ejer og klassifikation. |
| `pbt kill <port>` | Opretter kill-plan. |
| `pbt protect <port>` | Beskytter en port. |
| `pbt unprotect <port>` | Fjerner beskyttelse. |
| `pbt clean` | Forhåndsviser cleanup. |
| `pbt open <port>` | Åbner `http://localhost:<port>`. |
| `pbt doctor` | Tjekker platformen. |
| `pbt ui` | Starter TUI. |

Optioner: `--json`, `--verbose`, `--dry-run`, `--yes`, `--force`, `--config <path>`.

## TUI

Slash-kommandoer: `/ls`, `/why 3000`, `/protect 3000`, `/unprotect 3000`, `/clean --dry-run`, `/doctor`, `/ip`.

Genveje: `Tab` fuldfører, `Ctrl+L` skifter sprog, `Ctrl+C` eller `Esc` afslutter.

## Sikkerhed

Port Butler stopper aldrig processer direkte fra scanning. Farlige handlinger får først en plan. Standardbeskyttede porte:

```text
22  80  443  5432  6379  3306  27017
```

`clean` fjerner ikke Docker, Postgres eller Redis som standard.

## Udvikling

```bash
bun install
bun run typecheck
bun test packages/cli/src packages/config/src packages/core/src packages/detector/src packages/platform/src
bun run build
```

## Licens

Projektet har endnu ingen licens. Tilføj en før udgivelse.
