# Port Butler

**Port Butler** è una CLI per gestire le porte locali su Windows e macOS. Mostra le porte in ascolto, spiega quale processo le usa, protegge porte importanti e crea piani prima di azioni rischiose.

Languages: [English](README.md) | [简体中文](README.zh.md) | [繁體中文](README.zh-TW.md) | [한국어](README.ko.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Français](README.fr.md) | **Italiano** | [Dansk](README.da.md) | [日本語](README.ja.md) | [Polski](README.pl.md) | [Русский](README.ru.md) | [Bosanski](README.bs.md) | [العربية](README.ar.md) | [Norsk](README.no.md) | [Português (Brasil)](README.pt-BR.md) | [ไทย](README.th.md) | [Türkçe](README.tr.md) | [Українська](README.uk.md) | [বাংলা](README.bn.md) | [Ελληνικά](README.el.md) | [Tiếng Việt](README.vi.md)

## Funzionalità

- Elenco delle porte locali con processo, rischio, protezione e zombie score.
- Spiegazione di una porta con `/why` o `pbt why`.
- Kill plan prima di terminare un processo.
- Protezione delle porte importanti.
- Anteprima dei candidati alla pulizia.
- Rilevamento di Node, Vite, Next.js, Docker, Postgres, Redis e Bun.
- Supporto per Windows e macOS.
- TUI con `pbt ui` o `bun run pbt`.
- Output JSON con `--json`.

## Avvio rapido

```bash
bun install
bun run pbt
```

```bash
bun run pbt ls
bun run pbt why 3000
bun run pbt kill 3000 --dry-run
```

## Comandi

| Comando | Descrizione |
| --- | --- |
| `pbt` | Avvia la TUI predefinita. |
| `pbt ls` | Elenca le porte in ascolto. |
| `pbt why <port>` | Spiega proprietario e classificazione. |
| `pbt kill <port>` | Crea un kill plan. |
| `pbt protect <port>` | Protegge una porta. |
| `pbt unprotect <port>` | Rimuove la protezione. |
| `pbt clean` | Mostra i candidati alla pulizia. |
| `pbt open <port>` | Apre `http://localhost:<port>`. |
| `pbt doctor` | Controlla le dipendenze. |
| `pbt ui` | Avvia la TUI. |

Opzioni: `--json`, `--verbose`, `--dry-run`, `--yes`, `--force`, `--config <path>`.

## TUI

Comandi slash: `/ls`, `/why 3000`, `/protect 3000`, `/unprotect 3000`, `/clean --dry-run`, `/doctor`, `/ip`.

Scorciatoie: `Tab` completa, `Ctrl+L` cambia lingua, `Ctrl+C` o `Esc` esce.

## Sicurezza

Port Butler non termina processi direttamente durante la scansione. Prima crea un piano. Porte protette:

```text
22  80  443  5432  6379  3306  27017
```

`clean` non rimuove Docker, Postgres o Redis per impostazione predefinita.

## Sviluppo

```bash
bun install
bun run typecheck
bun test packages/cli/src packages/config/src packages/core/src packages/detector/src packages/platform/src
bun run build
```

## Licenza

Il progetto non ha ancora una licenza. Aggiungine una prima della pubblicazione.
