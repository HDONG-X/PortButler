# Port Butler

**Port Butler** هو أداة سطر أوامر لإدارة المنافذ المحلية على Windows و macOS. يساعدك على معرفة المنافذ المفتوحة، وفهم العملية التي تستخدم المنفذ، وحماية المنافذ المهمة، ومراجعة العمليات الخطرة قبل تنفيذها.

Languages: [English](README.md) | [简体中文](README.zh.md) | [繁體中文](README.zh-TW.md) | [한국어](README.ko.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Français](README.fr.md) | [Italiano](README.it.md) | [Dansk](README.da.md) | [日本語](README.ja.md) | [Polski](README.pl.md) | [Русский](README.ru.md) | [Bosanski](README.bs.md) | **العربية** | [Norsk](README.no.md) | [Português (Brasil)](README.pt-BR.md) | [ไทย](README.th.md) | [Türkçe](README.tr.md) | [Українська](README.uk.md) | [বাংলা](README.bn.md) | [Ελληνικά](README.el.md) | [Tiếng Việt](README.vi.md)

## الميزات

- عرض المنافذ المحلية مع العملية والمخاطر والحماية و zombie score.
- شرح منفذ محدد باستخدام `/why` أو `pbt why`.
- إنشاء kill plan قبل إنهاء أي عملية.
- حماية المنافذ المهمة.
- معاينة عمليات التنظيف قبل التنفيذ.
- اكتشاف Node و Vite و Next.js و Docker و Postgres و Redis و Bun.
- دعم Windows و macOS.
- واجهة طرفية عبر `pbt ui` أو `bun run pbt`.
- دعم JSON عبر `--json`.

## البدء السريع

```bash
bun install
bun run pbt
```

```bash
bun run pbt ls
bun run pbt why 3000
bun run pbt kill 3000 --dry-run
```

## الأوامر

| الأمر | الوصف |
| --- | --- |
| `pbt` | تشغيل الواجهة الطرفية افتراضيًا. |
| `pbt ls` | عرض المنافذ المفتوحة. |
| `pbt why <port>` | شرح مالك المنفذ وسبب التصنيف. |
| `pbt kill <port>` | إنشاء kill plan. |
| `pbt protect <port>` | حماية منفذ. |
| `pbt unprotect <port>` | إزالة الحماية. |
| `pbt clean` | معاينة التنظيف. |
| `pbt open <port>` | فتح `http://localhost:<port>`. |
| `pbt doctor` | فحص الاعتماديات. |
| `pbt ui` | تشغيل الواجهة الطرفية. |

الخيارات: `--json`, `--verbose`, `--dry-run`, `--yes`, `--force`, `--config <path>`.

## الواجهة الطرفية

أوامر slash: `/ls`, `/why 3000`, `/protect 3000`, `/unprotect 3000`, `/clean --dry-run`, `/doctor`, `/ip`.

الاختصارات: `Tab` للإكمال، `Ctrl+L` لتغيير اللغة، `Ctrl+C` أو `Esc` للخروج.

## الأمان

Port Butler لا ينهي العمليات مباشرة أثناء الفحص. يتم إنشاء خطة أولًا. المنافذ المحمية افتراضيًا:

```text
22  80  443  5432  6379  3306  27017
```

`clean` لا ينظف Docker أو Postgres أو Redis افتراضيًا.

## التطوير

```bash
bun install
bun run typecheck
bun test packages/cli/src packages/config/src packages/core/src packages/detector/src packages/platform/src
bun run build
```

## الترخيص

لا يحتوي المشروع على ترخيص بعد. أضف ترخيصًا قبل النشر.
