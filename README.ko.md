# Port Butler

**Port Butler**는 Windows와 macOS를 지원하는 로컬 포트 관리 CLI입니다. 열려 있는 포트를 확인하고, 어떤 프로세스가 포트를 점유하는지 설명하며, 중요한 포트를 보호하고, 위험한 정리 작업을 미리 검토할 수 있습니다.

Languages: [English](README.md) | [简体中文](README.zh.md) | [繁體中文](README.zh-TW.md) | **한국어** | [Deutsch](README.de.md) | [Español](README.es.md) | [Français](README.fr.md) | [Italiano](README.it.md) | [Dansk](README.da.md) | [日本語](README.ja.md) | [Polski](README.pl.md) | [Русский](README.ru.md) | [Bosanski](README.bs.md) | [العربية](README.ar.md) | [Norsk](README.no.md) | [Português (Brasil)](README.pt-BR.md) | [ไทย](README.th.md) | [Türkçe](README.tr.md) | [Українська](README.uk.md) | [বাংলা](README.bn.md) | [Ελληνικά](README.el.md) | [Tiếng Việt](README.vi.md)

## 주요 기능

- 로컬 listening 포트와 프로세스, 위험도, 보호 상태, zombie score 표시.
- `/why` 또는 `pbt why`로 특정 포트 설명.
- 모든 kill 작업 전에 kill plan 생성.
- 중요한 포트를 보호 목록에 추가.
- 정리 작업은 먼저 미리보기로 확인.
- Node, Vite, Next.js, Docker, Postgres, Redis, Bun 감지.
- Windows와 macOS 지원.
- `pbt ui` 또는 `bun run pbt`로 터미널 UI 실행.
- `--json` 출력 지원.

## 빠른 시작

```bash
bun install
bun run pbt
```

```bash
bun run pbt ls
bun run pbt why 3000
bun run pbt kill 3000 --dry-run
```

## 명령

| 명령 | 설명 |
| --- | --- |
| `pbt` | 기본 터미널 UI 시작. |
| `pbt ls` | listening 포트 목록 표시. |
| `pbt why <port>` | 포트 소유자와 분류 이유 설명. |
| `pbt kill <port>` | kill plan 생성. 검토 후 `--yes` 사용. |
| `pbt protect <port>` | 보호 목록에 포트 추가. |
| `pbt unprotect <port>` | 보호 목록에서 포트 제거. |
| `pbt clean` | zombie 개발 프로세스 정리 후보 미리보기. |
| `pbt open <port>` | `http://localhost:<port>` 열기. |
| `pbt doctor` | 플랫폼 의존성 확인. |
| `pbt ui` | 터미널 UI 시작. |

전역 옵션: `--json`, `--verbose`, `--dry-run`, `--yes`, `--force`, `--config <path>`.

## 터미널 UI

Slash 명령: `/ls`, `/why 3000`, `/protect 3000`, `/unprotect 3000`, `/clean --dry-run`, `/doctor`, `/ip`.

단축키: `Tab` 자동 완성, `Ctrl+L` 언어 전환, `Ctrl+C` 또는 `Esc` 종료.

## 안전 모델

Port Butler는 스캔 로직에서 직접 kill하지 않습니다. 위험한 작업은 먼저 kill plan을 만듭니다. 기본 보호 포트:

```text
22  80  443  5432  6379  3306  27017
```

`clean`은 기본적으로 Docker, Postgres, Redis를 정리하지 않습니다.

## 개발

```bash
bun install
bun run typecheck
bun test packages/cli/src packages/config/src packages/core/src packages/detector/src packages/platform/src
bun run build
```

## 라이선스

아직 라이선스가 없습니다. 공개 배포나 외부 기여를 받기 전에 라이선스를 추가하세요.
