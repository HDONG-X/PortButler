# Port Butler

**Port Butler**, Windows ve macOS için yerel port yöneticisi CLI aracıdır. Dinleyen portları gösterir, portu hangi sürecin kullandığını açıklar, önemli portları korur ve riskli işlemlerden önce plan oluşturur.

Languages: [English](README.md) | [简体中文](README.zh.md) | [繁體中文](README.zh-TW.md) | [한국어](README.ko.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Français](README.fr.md) | [Italiano](README.it.md) | [Dansk](README.da.md) | [日本語](README.ja.md) | [Polski](README.pl.md) | [Русский](README.ru.md) | [Bosanski](README.bs.md) | [العربية](README.ar.md) | [Norsk](README.no.md) | [Português (Brasil)](README.pt-BR.md) | [ไทย](README.th.md) | **Türkçe** | [Українська](README.uk.md) | [বাংলা](README.bn.md) | [Ελληνικά](README.el.md) | [Tiếng Việt](README.vi.md)

## Özellikler

- Yerel portları süreç, risk, koruma ve zombie score ile listeler.
- `/why` veya `pbt why` ile portu açıklar.
- Süreç sonlandırmadan önce kill plan oluşturur.
- Önemli portları korur.
- Temizleme adaylarını önizler.
- Node, Vite, Next.js, Docker, Postgres, Redis ve Bun algılar.
- Windows ve macOS destekler.
- `pbt ui` veya `bun run pbt` ile TUI sağlar.
- `--json` çıktısı destekler.

## Hızlı Başlangıç

```bash
bun install
bun run pbt
```

```bash
bun run pbt ls
bun run pbt why 3000
bun run pbt kill 3000 --dry-run
```

## Komutlar

| Komut | Açıklama |
| --- | --- |
| `pbt` | Varsayılan olarak TUI başlatır. |
| `pbt ls` | Dinleyen portları listeler. |
| `pbt why <port>` | Sahibi ve sınıflandırmayı açıklar. |
| `pbt kill <port>` | Kill plan oluşturur. |
| `pbt protect <port>` | Portu korur. |
| `pbt unprotect <port>` | Korumayı kaldırır. |
| `pbt clean` | Temizleme adaylarını gösterir. |
| `pbt open <port>` | `http://localhost:<port>` açar. |
| `pbt doctor` | Sistem bağımlılıklarını kontrol eder. |
| `pbt ui` | TUI başlatır. |

Seçenekler: `--json`, `--verbose`, `--dry-run`, `--yes`, `--force`, `--config <path>`.

## TUI

Slash komutları: `/ls`, `/why 3000`, `/protect 3000`, `/unprotect 3000`, `/clean --dry-run`, `/doctor`, `/ip`.

Kısayollar: `Tab` tamamlar, `Ctrl+L` dili değiştirir, `Ctrl+C` veya `Esc` çıkar.

## Güvenlik

Port Butler tarama aşamasında doğrudan süreç sonlandırmaz. Önce plan oluşturur. Varsayılan korumalı portlar:

```text
22  80  443  5432  6379  3306  27017
```

`clean` varsayılan olarak Docker, Postgres veya Redis temizlemez.

## Geliştirme

```bash
bun install
bun run typecheck
bun test packages/cli/src packages/config/src packages/core/src packages/detector/src packages/platform/src
bun run build
```

## Lisans

Projenin henüz lisansı yok. Yayınlamadan önce lisans ekleyin.
