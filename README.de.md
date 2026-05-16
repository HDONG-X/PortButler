# Port Butler

**Port Butler** ist ein lokaler Port-Manager als CLI für Windows und macOS. Er zeigt belegte Ports, erklärt den zugehörigen Prozess, schützt wichtige Ports und erstellt vor gefährlichen Aktionen einen Plan.

Languages: [English](README.md) | [简体中文](README.zh.md) | [繁體中文](README.zh-TW.md) | [한국어](README.ko.md) | **Deutsch** | [Español](README.es.md) | [Français](README.fr.md) | [Italiano](README.it.md) | [Dansk](README.da.md) | [日本語](README.ja.md) | [Polski](README.pl.md) | [Русский](README.ru.md) | [Bosanski](README.bs.md) | [العربية](README.ar.md) | [Norsk](README.no.md) | [Português (Brasil)](README.pt-BR.md) | [ไทย](README.th.md) | [Türkçe](README.tr.md) | [Українська](README.uk.md) | [বাংলা](README.bn.md) | [Ελληνικά](README.el.md) | [Tiếng Việt](README.vi.md)

## Funktionen

- Lokale Listening-Ports mit Prozess, Risiko, Schutzstatus und Zombie-Score anzeigen.
- Einen Port mit `/why` oder `pbt why` erklären.
- Vor jedem Kill einen Kill-Plan erzeugen.
- Wichtige Ports schützen.
- Cleanup-Kandidaten zuerst nur anzeigen.
- Node, Vite, Next.js, Docker, Postgres, Redis und Bun erkennen.
- Windows und macOS unterstützen.
- Terminal UI über `pbt ui` oder `bun run pbt`.
- JSON-Ausgabe mit `--json`.

## Schnellstart

```bash
bun install
bun run pbt
```

```bash
bun run pbt ls
bun run pbt why 3000
bun run pbt kill 3000 --dry-run
```

## Befehle

| Befehl | Beschreibung |
| --- | --- |
| `pbt` | Startet standardmäßig die Terminal UI. |
| `pbt ls` | Listet Listening-Ports. |
| `pbt why <port>` | Erklärt Besitzer und Klassifizierung. |
| `pbt kill <port>` | Erstellt einen Kill-Plan. |
| `pbt protect <port>` | Fügt einen Port zur Schutzliste hinzu. |
| `pbt unprotect <port>` | Entfernt einen Port aus der Schutzliste. |
| `pbt clean` | Zeigt Cleanup-Kandidaten an. |
| `pbt open <port>` | Öffnet `http://localhost:<port>`. |
| `pbt doctor` | Prüft Plattformabhängigkeiten. |
| `pbt ui` | Startet die Terminal UI. |

Optionen: `--json`, `--verbose`, `--dry-run`, `--yes`, `--force`, `--config <path>`.

## Terminal UI

Slash-Befehle: `/ls`, `/why 3000`, `/protect 3000`, `/unprotect 3000`, `/clean --dry-run`, `/doctor`, `/ip`.

Tasten: `Tab` vervollständigt, `Ctrl+L` wechselt Sprache, `Ctrl+C` oder `Esc` beendet.

## Sicherheit

Port Butler beendet Prozesse nie direkt aus der Scan-Logik. Gefährliche Aktionen erzeugen zuerst einen Plan. Standardmäßig geschützt:

```text
22  80  443  5432  6379  3306  27017
```

`clean` entfernt Docker, Postgres und Redis standardmäßig nicht.

## Entwicklung

```bash
bun install
bun run typecheck
bun test packages/cli/src packages/config/src packages/core/src packages/detector/src packages/platform/src
bun run build
```

## Lizenz

Dieses Projekt hat noch keine Lizenz. Füge vor Veröffentlichung oder externen Beiträgen eine Lizenz hinzu.
