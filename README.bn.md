# Port Butler

**Port Butler** Windows এবং macOS-এর জন্য একটি local port manager CLI। এটি listening port দেখায়, কোন process port ব্যবহার করছে তা ব্যাখ্যা করে, গুরুত্বপূর্ণ port সুরক্ষিত করে এবং ঝুঁকিপূর্ণ action-এর আগে plan তৈরি করে।

Languages: [English](README.md) | [简体中文](README.zh.md) | [繁體中文](README.zh-TW.md) | [한국어](README.ko.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Français](README.fr.md) | [Italiano](README.it.md) | [Dansk](README.da.md) | [日本語](README.ja.md) | [Polski](README.pl.md) | [Русский](README.ru.md) | [Bosanski](README.bs.md) | [العربية](README.ar.md) | [Norsk](README.no.md) | [Português (Brasil)](README.pt-BR.md) | [ไทย](README.th.md) | [Türkçe](README.tr.md) | [Українська](README.uk.md) | **বাংলা** | [Ελληνικά](README.el.md) | [Tiếng Việt](README.vi.md)

## বৈশিষ্ট্য

- process, risk, protection এবং zombie score সহ local port তালিকা।
- `/why` বা `pbt why` দিয়ে নির্দিষ্ট port ব্যাখ্যা।
- process kill করার আগে kill plan।
- গুরুত্বপূর্ণ port protect করা।
- cleanup candidate preview।
- Node, Vite, Next.js, Docker, Postgres, Redis এবং Bun শনাক্ত।
- Windows এবং macOS সমর্থন।
- `pbt ui` বা `bun run pbt` দিয়ে TUI।
- `--json` output।

## দ্রুত শুরু

```bash
bun install
bun run pbt
```

```bash
bun run pbt ls
bun run pbt why 3000
bun run pbt kill 3000 --dry-run
```

## কমান্ড

| কমান্ড | বর্ণনা |
| --- | --- |
| `pbt` | default TUI চালু করে। |
| `pbt ls` | listening port দেখায়। |
| `pbt why <port>` | owner এবং classification ব্যাখ্যা করে। |
| `pbt kill <port>` | kill plan তৈরি করে। |
| `pbt protect <port>` | port protect করে। |
| `pbt unprotect <port>` | protection সরায়। |
| `pbt clean` | cleanup preview দেখায়। |
| `pbt open <port>` | `http://localhost:<port>` খোলে। |
| `pbt doctor` | dependency check করে। |
| `pbt ui` | TUI চালু করে। |

Options: `--json`, `--verbose`, `--dry-run`, `--yes`, `--force`, `--config <path>`.

## TUI

Slash commands: `/ls`, `/why 3000`, `/protect 3000`, `/unprotect 3000`, `/clean --dry-run`, `/doctor`, `/ip`.

Shortcuts: `Tab` complete করে, `Ctrl+L` language বদলায়, `Ctrl+C` বা `Esc` exit করে।

## নিরাপত্তা

Port Butler scan logic থেকে সরাসরি process kill করে না। আগে plan তৈরি করে। Default protected ports:

```text
22  80  443  5432  6379  3306  27017
```

`clean` defaultভাবে Docker, Postgres বা Redis পরিষ্কার করে না।

## Development

```bash
bun install
bun run typecheck
bun test packages/cli/src packages/config/src packages/core/src packages/detector/src packages/platform/src
bun run build
```

## License

এই project-এ এখনো license নেই। publish করার আগে license যোগ করুন।
