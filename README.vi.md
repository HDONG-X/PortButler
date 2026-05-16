# Port Butler

**Port Butler** là CLI quản lý cổng cục bộ cho Windows và macOS. Công cụ giúp xem cổng đang lắng nghe, giải thích tiến trình sở hữu cổng, bảo vệ cổng quan trọng và tạo kế hoạch trước hành động rủi ro.

Languages: [English](README.md) | [简体中文](README.zh.md) | [繁體中文](README.zh-TW.md) | [한국어](README.ko.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Français](README.fr.md) | [Italiano](README.it.md) | [Dansk](README.da.md) | [日本語](README.ja.md) | [Polski](README.pl.md) | [Русский](README.ru.md) | [Bosanski](README.bs.md) | [العربية](README.ar.md) | [Norsk](README.no.md) | [Português (Brasil)](README.pt-BR.md) | [ไทย](README.th.md) | [Türkçe](README.tr.md) | [Українська](README.uk.md) | [বাংলা](README.bn.md) | [Ελληνικά](README.el.md) | **Tiếng Việt**

## Tính năng

- Liệt kê cổng cục bộ với tiến trình, rủi ro, bảo vệ và zombie score.
- Giải thích cổng bằng `/why` hoặc `pbt why`.
- Tạo kill plan trước khi dừng tiến trình.
- Bảo vệ cổng quan trọng.
- Xem trước ứng viên cleanup.
- Nhận diện Node, Vite, Next.js, Docker, Postgres, Redis và Bun.
- Hỗ trợ Windows và macOS.
- TUI qua `pbt ui` hoặc `bun run pbt`.
- Xuất JSON với `--json`.

## Bắt đầu nhanh

```bash
bun install
bun run pbt
```

```bash
bun run pbt ls
bun run pbt why 3000
bun run pbt kill 3000 --dry-run
```

## Lệnh

| Lệnh | Mô tả |
| --- | --- |
| `pbt` | Mặc định mở TUI. |
| `pbt ls` | Liệt kê cổng đang lắng nghe. |
| `pbt why <port>` | Giải thích chủ sở hữu và phân loại. |
| `pbt kill <port>` | Tạo kill plan. |
| `pbt protect <port>` | Bảo vệ cổng. |
| `pbt unprotect <port>` | Gỡ bảo vệ. |
| `pbt clean` | Xem trước cleanup. |
| `pbt open <port>` | Mở `http://localhost:<port>`. |
| `pbt doctor` | Kiểm tra phụ thuộc hệ thống. |
| `pbt ui` | Mở TUI. |

Tùy chọn: `--json`, `--verbose`, `--dry-run`, `--yes`, `--force`, `--config <path>`.

## TUI

Slash commands: `/ls`, `/why 3000`, `/protect 3000`, `/unprotect 3000`, `/clean --dry-run`, `/doctor`, `/ip`.

Phím tắt: `Tab` tự hoàn thành, `Ctrl+L` đổi ngôn ngữ, `Ctrl+C` hoặc `Esc` thoát.

## An toàn

Port Butler không kill tiến trình trực tiếp từ bước quét. Mọi thao tác nguy hiểm tạo plan trước. Cổng được bảo vệ mặc định:

```text
22  80  443  5432  6379  3306  27017
```

`clean` mặc định không dọn Docker, Postgres hoặc Redis.

## Phát triển

```bash
bun install
bun run typecheck
bun test packages/cli/src packages/config/src packages/core/src packages/detector/src packages/platform/src
bun run build
```

## Giấy phép

Dự án chưa có giấy phép. Hãy thêm giấy phép trước khi phát hành.
