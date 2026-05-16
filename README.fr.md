# Port Butler

**Port Butler** est une CLI de gestion des ports locaux pour Windows et macOS. Elle aide à voir les ports en écoute, comprendre quel processus les utilise, protéger les ports importants et prévisualiser les actions risquées.

Languages: [English](README.md) | [简体中文](README.zh.md) | [繁體中文](README.zh-TW.md) | [한국어](README.ko.md) | [Deutsch](README.de.md) | [Español](README.es.md) | **Français** | [Italiano](README.it.md) | [Dansk](README.da.md) | [日本語](README.ja.md) | [Polski](README.pl.md) | [Русский](README.ru.md) | [Bosanski](README.bs.md) | [العربية](README.ar.md) | [Norsk](README.no.md) | [Português (Brasil)](README.pt-BR.md) | [ไทย](README.th.md) | [Türkçe](README.tr.md) | [Українська](README.uk.md) | [বাংলা](README.bn.md) | [Ελληνικά](README.el.md) | [Tiếng Việt](README.vi.md)

## Fonctionnalités

- Liste les ports locaux avec processus, risque, protection et score zombie.
- Explique un port avec `/why` ou `pbt why`.
- Génère un kill plan avant toute terminaison.
- Protège les ports importants.
- Prévisualise les candidats au nettoyage.
- Détecte Node, Vite, Next.js, Docker, Postgres, Redis et Bun.
- Prend en charge Windows et macOS.
- Fournit une TUI via `pbt ui` ou `bun run pbt`.
- Sortie JSON avec `--json`.

## Démarrage rapide

```bash
bun install
bun run pbt
```

```bash
bun run pbt ls
bun run pbt why 3000
bun run pbt kill 3000 --dry-run
```

## Commandes

| Commande | Description |
| --- | --- |
| `pbt` | Lance la TUI par défaut. |
| `pbt ls` | Liste les ports en écoute. |
| `pbt why <port>` | Explique le propriétaire et la classification. |
| `pbt kill <port>` | Crée un kill plan. |
| `pbt protect <port>` | Protège un port. |
| `pbt unprotect <port>` | Retire la protection. |
| `pbt clean` | Prévisualise le nettoyage. |
| `pbt open <port>` | Ouvre `http://localhost:<port>`. |
| `pbt doctor` | Vérifie les dépendances. |
| `pbt ui` | Lance la TUI. |

Options : `--json`, `--verbose`, `--dry-run`, `--yes`, `--force`, `--config <path>`.

## TUI

Commandes slash : `/ls`, `/why 3000`, `/protect 3000`, `/unprotect 3000`, `/clean --dry-run`, `/doctor`, `/ip`.

Raccourcis : `Tab` complète, `Ctrl+L` change la langue, `Ctrl+C` ou `Esc` quitte.

## Sécurité

Port Butler ne tue jamais un processus directement depuis le scan. Les actions dangereuses créent d’abord un plan. Ports protégés par défaut :

```text
22  80  443  5432  6379  3306  27017
```

`clean` ne nettoie pas Docker, Postgres ni Redis par défaut.

## Développement

```bash
bun install
bun run typecheck
bun test packages/cli/src packages/config/src packages/core/src packages/detector/src packages/platform/src
bun run build
```

## Licence

Ce projet n’a pas encore de licence. Ajoutez-en une avant publication ou contribution externe.
