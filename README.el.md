# Port Butler

**Port Butler** είναι ένα CLI για διαχείριση τοπικών ports σε Windows και macOS. Δείχνει listening ports, εξηγεί ποια διεργασία τα χρησιμοποιεί, προστατεύει σημαντικά ports και δημιουργεί σχέδιο πριν από επικίνδυνες ενέργειες.

Languages: [English](README.md) | [简体中文](README.zh.md) | [繁體中文](README.zh-TW.md) | [한국어](README.ko.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Français](README.fr.md) | [Italiano](README.it.md) | [Dansk](README.da.md) | [日本語](README.ja.md) | [Polski](README.pl.md) | [Русский](README.ru.md) | [Bosanski](README.bs.md) | [العربية](README.ar.md) | [Norsk](README.no.md) | [Português (Brasil)](README.pt-BR.md) | [ไทย](README.th.md) | [Türkçe](README.tr.md) | [Українська](README.uk.md) | [বাংলা](README.bn.md) | **Ελληνικά** | [Tiếng Việt](README.vi.md)

## Δυνατότητες

- Λίστα ports με διεργασία, ρίσκο, προστασία και zombie score.
- Εξήγηση port με `/why` ή `pbt why`.
- Kill plan πριν από τερματισμό διεργασίας.
- Προστασία σημαντικών ports.
- Προεπισκόπηση cleanup candidates.
- Ανίχνευση Node, Vite, Next.js, Docker, Postgres, Redis και Bun.
- Υποστήριξη Windows και macOS.
- TUI με `pbt ui` ή `bun run pbt`.
- JSON με `--json`.

## Γρήγορη εκκίνηση

```bash
bun install
bun run pbt
```

```bash
bun run pbt ls
bun run pbt why 3000
bun run pbt kill 3000 --dry-run
```

## Εντολές

| Εντολή | Περιγραφή |
| --- | --- |
| `pbt` | Εκκινεί το TUI από προεπιλογή. |
| `pbt ls` | Δείχνει listening ports. |
| `pbt why <port>` | Εξηγεί owner και classification. |
| `pbt kill <port>` | Δημιουργεί kill plan. |
| `pbt protect <port>` | Προστατεύει port. |
| `pbt unprotect <port>` | Αφαιρεί προστασία. |
| `pbt clean` | Δείχνει cleanup preview. |
| `pbt open <port>` | Ανοίγει `http://localhost:<port>`. |
| `pbt doctor` | Ελέγχει dependencies. |
| `pbt ui` | Εκκινεί TUI. |

Επιλογές: `--json`, `--verbose`, `--dry-run`, `--yes`, `--force`, `--config <path>`.

## TUI

Slash commands: `/ls`, `/why 3000`, `/protect 3000`, `/unprotect 3000`, `/clean --dry-run`, `/doctor`, `/ip`.

Συντομεύσεις: `Tab` συμπληρώνει, `Ctrl+L` αλλάζει γλώσσα, `Ctrl+C` ή `Esc` έξοδος.

## Ασφάλεια

Το Port Butler δεν σκοτώνει διεργασίες απευθείας από το scan. Πρώτα δημιουργεί plan. Προστατευμένα ports:

```text
22  80  443  5432  6379  3306  27017
```

Το `clean` δεν αφαιρεί Docker, Postgres ή Redis από προεπιλογή.

## Ανάπτυξη

```bash
bun install
bun run typecheck
bun test packages/cli/src packages/config/src packages/core/src packages/detector/src packages/platform/src
bun run build
```

## Άδεια

Το έργο δεν έχει ακόμα άδεια. Προσθέστε μία πριν τη δημοσίευση.
