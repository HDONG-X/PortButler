# Port Butler

**Port Butler** é uma CLI para gerenciar portas locais no Windows e macOS. Ela mostra portas em escuta, explica qual processo usa uma porta, protege portas importantes e cria planos antes de ações perigosas.

Languages: [English](README.md) | [简体中文](README.zh.md) | [繁體中文](README.zh-TW.md) | [한국어](README.ko.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Français](README.fr.md) | [Italiano](README.it.md) | [Dansk](README.da.md) | [日本語](README.ja.md) | [Polski](README.pl.md) | [Русский](README.ru.md) | [Bosanski](README.bs.md) | [العربية](README.ar.md) | [Norsk](README.no.md) | **Português (Brasil)** | [ไทย](README.th.md) | [Türkçe](README.tr.md) | [Українська](README.uk.md) | [বাংলা](README.bn.md) | [Ελληνικά](README.el.md) | [Tiếng Việt](README.vi.md)

## Recursos

- Lista portas locais com processo, risco, proteção e zombie score.
- Explica uma porta com `/why` ou `pbt why`.
- Cria kill plan antes de encerrar processos.
- Protege portas importantes.
- Pré-visualiza candidatos de limpeza.
- Detecta Node, Vite, Next.js, Docker, Postgres, Redis e Bun.
- Suporta Windows e macOS.
- TUI com `pbt ui` ou `bun run pbt`.
- Saída JSON com `--json`.

## Início rápido

```bash
bun install
bun run pbt
```

```bash
bun run pbt ls
bun run pbt why 3000
bun run pbt kill 3000 --dry-run
```

## Comandos

| Comando | Descrição |
| --- | --- |
| `pbt` | Inicia a TUI por padrão. |
| `pbt ls` | Lista portas em escuta. |
| `pbt why <port>` | Explica dono e classificação. |
| `pbt kill <port>` | Cria um kill plan. |
| `pbt protect <port>` | Protege uma porta. |
| `pbt unprotect <port>` | Remove proteção. |
| `pbt clean` | Pré-visualiza limpeza. |
| `pbt open <port>` | Abre `http://localhost:<port>`. |
| `pbt doctor` | Verifica dependências. |
| `pbt ui` | Inicia a TUI. |

Opções: `--json`, `--verbose`, `--dry-run`, `--yes`, `--force`, `--config <path>`.

## TUI

Comandos slash: `/ls`, `/why 3000`, `/protect 3000`, `/unprotect 3000`, `/clean --dry-run`, `/doctor`, `/ip`.

Atalhos: `Tab` completa, `Ctrl+L` troca idioma, `Ctrl+C` ou `Esc` sai.

## Segurança

Port Butler nunca encerra processos diretamente durante o scan. Primeiro cria um plano. Portas protegidas por padrão:

```text
22  80  443  5432  6379  3306  27017
```

`clean` não remove Docker, Postgres ou Redis por padrão.

## Desenvolvimento

```bash
bun install
bun run typecheck
bun test packages/cli/src packages/config/src packages/core/src packages/detector/src packages/platform/src
bun run build
```

## Licença

Este projeto ainda não tem licença. Adicione uma antes de publicar.
