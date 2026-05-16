# Port Butler

**Port Butler** es una CLI para administrar puertos locales en Windows y macOS. Permite ver puertos en escucha, entender qué proceso los ocupa, proteger puertos importantes y revisar acciones peligrosas antes de ejecutarlas.

Languages: [English](README.md) | [简体中文](README.zh.md) | [繁體中文](README.zh-TW.md) | [한국어](README.ko.md) | [Deutsch](README.de.md) | **Español** | [Français](README.fr.md) | [Italiano](README.it.md) | [Dansk](README.da.md) | [日本語](README.ja.md) | [Polski](README.pl.md) | [Русский](README.ru.md) | [Bosanski](README.bs.md) | [العربية](README.ar.md) | [Norsk](README.no.md) | [Português (Brasil)](README.pt-BR.md) | [ไทย](README.th.md) | [Türkçe](README.tr.md) | [Українська](README.uk.md) | [বাংলা](README.bn.md) | [Ελληνικά](README.el.md) | [Tiếng Việt](README.vi.md)

## Funciones

- Lista puertos locales con proceso, riesgo, protección y zombie score.
- Explica un puerto con `/why` o `pbt why`.
- Crea un kill plan antes de terminar procesos.
- Protege puertos importantes.
- Previsualiza candidatos de limpieza.
- Detecta Node, Vite, Next.js, Docker, Postgres, Redis y Bun.
- Soporta Windows y macOS.
- Incluye TUI con `pbt ui` o `bun run pbt`.
- Soporta salida JSON con `--json`.

## Inicio rápido

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

| Comando | Descripción |
| --- | --- |
| `pbt` | Inicia la TUI por defecto. |
| `pbt ls` | Lista puertos en escucha. |
| `pbt why <port>` | Explica propietario y clasificación. |
| `pbt kill <port>` | Crea un kill plan. |
| `pbt protect <port>` | Protege un puerto. |
| `pbt unprotect <port>` | Quita la protección. |
| `pbt clean` | Previsualiza limpieza. |
| `pbt open <port>` | Abre `http://localhost:<port>`. |
| `pbt doctor` | Revisa dependencias del sistema. |
| `pbt ui` | Inicia la TUI. |

Opciones: `--json`, `--verbose`, `--dry-run`, `--yes`, `--force`, `--config <path>`.

## TUI

Comandos slash: `/ls`, `/why 3000`, `/protect 3000`, `/unprotect 3000`, `/clean --dry-run`, `/doctor`, `/ip`.

Atajos: `Tab` completa, `Ctrl+L` cambia idioma, `Ctrl+C` o `Esc` sale.

## Seguridad

Port Butler nunca mata procesos directamente desde el escaneo. Primero crea un plan. Puertos protegidos por defecto:

```text
22  80  443  5432  6379  3306  27017
```

`clean` no limpia Docker, Postgres ni Redis por defecto.

## Desarrollo

```bash
bun install
bun run typecheck
bun test packages/cli/src packages/config/src packages/core/src packages/detector/src packages/platform/src
bun run build
```

## Licencia

Este proyecto aún no tiene licencia. Añade una antes de publicar o aceptar contribuciones externas.
