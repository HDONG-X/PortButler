# Port Butler

**Port Butler** je lokalni CLI za upravljanje portovima na Windowsu i macOS-u. Prikazuje portove koji slušaju, objašnjava koji proces ih koristi, štiti važne portove i pravi plan prije rizičnih radnji.

Languages: [English](README.md) | [简体中文](README.zh.md) | [繁體中文](README.zh-TW.md) | [한국어](README.ko.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Français](README.fr.md) | [Italiano](README.it.md) | [Dansk](README.da.md) | [日本語](README.ja.md) | [Polski](README.pl.md) | [Русский](README.ru.md) | **Bosanski** | [العربية](README.ar.md) | [Norsk](README.no.md) | [Português (Brasil)](README.pt-BR.md) | [ไทย](README.th.md) | [Türkçe](README.tr.md) | [Українська](README.uk.md) | [বাংলা](README.bn.md) | [Ελληνικά](README.el.md) | [Tiếng Việt](README.vi.md)

## Mogućnosti

- Lista portova sa procesom, rizikom, zaštitom i zombie score.
- Objašnjenje porta kroz `/why` ili `pbt why`.
- Kill plan prije zaustavljanja procesa.
- Zaštita važnih portova.
- Pregled kandidata za čišćenje.
- Prepoznavanje Node, Vite, Next.js, Docker, Postgres, Redis i Bun.
- Podrška za Windows i macOS.
- TUI kroz `pbt ui` ili `bun run pbt`.
- JSON izlaz sa `--json`.

## Brzi početak

```bash
bun install
bun run pbt
```

```bash
bun run pbt ls
bun run pbt why 3000
bun run pbt kill 3000 --dry-run
```

## Komande

| Komanda | Opis |
| --- | --- |
| `pbt` | Pokreće TUI po defaultu. |
| `pbt ls` | Prikazuje portove koji slušaju. |
| `pbt why <port>` | Objašnjava vlasnika i klasifikaciju. |
| `pbt kill <port>` | Pravi kill plan. |
| `pbt protect <port>` | Štiti port. |
| `pbt unprotect <port>` | Uklanja zaštitu. |
| `pbt clean` | Prikazuje kandidate za čišćenje. |
| `pbt open <port>` | Otvara `http://localhost:<port>`. |
| `pbt doctor` | Provjerava zavisnosti. |
| `pbt ui` | Pokreće TUI. |

Opcije: `--json`, `--verbose`, `--dry-run`, `--yes`, `--force`, `--config <path>`.

## TUI

Slash komande: `/ls`, `/why 3000`, `/protect 3000`, `/unprotect 3000`, `/clean --dry-run`, `/doctor`, `/ip`.

Prečice: `Tab` dopunjava, `Ctrl+L` mijenja jezik, `Ctrl+C` ili `Esc` izlazi.

## Sigurnost

Port Butler ne ubija procese direktno iz skeniranja. Prvo pravi plan. Default zaštićeni portovi:

```text
22  80  443  5432  6379  3306  27017
```

`clean` ne čisti Docker, Postgres ili Redis po defaultu.

## Razvoj

```bash
bun install
bun run typecheck
bun test packages/cli/src packages/config/src packages/core/src packages/detector/src packages/platform/src
bun run build
```

## Licenca

Projekat još nema licencu. Dodajte licencu prije objave.
