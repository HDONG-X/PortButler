# Port Butler

**Port Butler** er en lokal portbehandler for Windows og macOS. Den viser porter som lytter, forklarer hvilken prosess som eier en port, beskytter viktige porter og lager planer før risikable handlinger.

Languages: [English](README.md) | [简体中文](README.zh.md) | [繁體中文](README.zh-TW.md) | [한국어](README.ko.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Français](README.fr.md) | [Italiano](README.it.md) | [Dansk](README.da.md) | [日本語](README.ja.md) | [Polski](README.pl.md) | [Русский](README.ru.md) | [Bosanski](README.bs.md) | [العربية](README.ar.md) | **Norsk** | [Português (Brasil)](README.pt-BR.md) | [ไทย](README.th.md) | [Türkçe](README.tr.md) | [Українська](README.uk.md) | [বাংলা](README.bn.md) | [Ελληνικά](README.el.md) | [Tiếng Việt](README.vi.md)

## Funksjoner

- Viser lokale porter med prosess, risiko, beskyttelse og zombie-score.
- Forklarer en port med `/why` eller `pbt why`.
- Lager kill-plan før prosesser stoppes.
- Beskytter viktige porter.
- Forhåndsviser cleanup-kandidater.
- Oppdager Node, Vite, Next.js, Docker, Postgres, Redis og Bun.
- Støtter Windows og macOS.
- TUI via `pbt ui` eller `bun run pbt`.
- JSON-output med `--json`.

## Hurtigstart

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
| `pbt ls` | Viser porter som lytter. |
| `pbt why <port>` | Forklarer eier og klassifisering. |
| `pbt kill <port>` | Lager kill-plan. |
| `pbt protect <port>` | Beskytter en port. |
| `pbt unprotect <port>` | Fjerner beskyttelse. |
| `pbt clean` | Viser cleanup-kandidater. |
| `pbt open <port>` | Åpner `http://localhost:<port>`. |
| `pbt doctor` | Sjekker avhengigheter. |
| `pbt ui` | Starter TUI. |

Alternativer: `--json`, `--verbose`, `--dry-run`, `--yes`, `--force`, `--config <path>`.

## TUI

Slash-kommandoer: `/ls`, `/why 3000`, `/protect 3000`, `/unprotect 3000`, `/clean --dry-run`, `/doctor`, `/ip`.

Snarveier: `Tab` fullfører, `Ctrl+L` bytter språk, `Ctrl+C` eller `Esc` avslutter.

## Sikkerhet

Port Butler stopper aldri prosesser direkte fra scanning. Først lages en plan. Beskyttet som standard:

```text
22  80  443  5432  6379  3306  27017
```

`clean` fjerner ikke Docker, Postgres eller Redis som standard.

## Utvikling

```bash
bun install
bun run typecheck
bun test packages/cli/src packages/config/src packages/core/src packages/detector/src packages/platform/src
bun run build
```

## Lisens

Prosjektet har ingen lisens ennå. Legg til en før publisering.
