# Port Butler

**Port Butler** คือ CLI สำหรับจัดการพอร์ตในเครื่องบน Windows และ macOS ช่วยดูพอร์ตที่กำลังฟังอยู่ อธิบายว่าโปรเซสใดใช้งานพอร์ต ป้องกันพอร์ตสำคัญ และสร้างแผนก่อนคำสั่งที่เสี่ยง

Languages: [English](README.md) | [简体中文](README.zh.md) | [繁體中文](README.zh-TW.md) | [한국어](README.ko.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Français](README.fr.md) | [Italiano](README.it.md) | [Dansk](README.da.md) | [日本語](README.ja.md) | [Polski](README.pl.md) | [Русский](README.ru.md) | [Bosanski](README.bs.md) | [العربية](README.ar.md) | [Norsk](README.no.md) | [Português (Brasil)](README.pt-BR.md) | **ไทย** | [Türkçe](README.tr.md) | [Українська](README.uk.md) | [বাংলা](README.bn.md) | [Ελληνικά](README.el.md) | [Tiếng Việt](README.vi.md)

## คุณสมบัติ

- แสดงพอร์ตในเครื่องพร้อมโปรเซส ความเสี่ยง การป้องกัน และ zombie score
- อธิบายพอร์ตด้วย `/why` หรือ `pbt why`
- สร้าง kill plan ก่อนหยุดโปรเซส
- ป้องกันพอร์ตสำคัญ
- ดูตัวอย่างรายการที่จะ clean ก่อน
- ตรวจจับ Node, Vite, Next.js, Docker, Postgres, Redis และ Bun
- รองรับ Windows และ macOS
- มี TUI ผ่าน `pbt ui` หรือ `bun run pbt`
- รองรับ JSON ด้วย `--json`

## เริ่มต้นเร็ว

```bash
bun install
bun run pbt
```

```bash
bun run pbt ls
bun run pbt why 3000
bun run pbt kill 3000 --dry-run
```

## คำสั่ง

| คำสั่ง | คำอธิบาย |
| --- | --- |
| `pbt` | เปิด TUI เป็นค่าเริ่มต้น |
| `pbt ls` | แสดงพอร์ตที่ฟังอยู่ |
| `pbt why <port>` | อธิบายเจ้าของและการจัดประเภท |
| `pbt kill <port>` | สร้าง kill plan |
| `pbt protect <port>` | ป้องกันพอร์ต |
| `pbt unprotect <port>` | ยกเลิกการป้องกัน |
| `pbt clean` | ดูตัวอย่างการ clean |
| `pbt open <port>` | เปิด `http://localhost:<port>` |
| `pbt doctor` | ตรวจสอบระบบ |
| `pbt ui` | เปิด TUI |

ตัวเลือก: `--json`, `--verbose`, `--dry-run`, `--yes`, `--force`, `--config <path>`

## TUI

คำสั่ง slash: `/ls`, `/why 3000`, `/protect 3000`, `/unprotect 3000`, `/clean --dry-run`, `/doctor`, `/ip`

ปุ่มลัด: `Tab` เติมคำสั่ง, `Ctrl+L` เปลี่ยนภาษา, `Ctrl+C` หรือ `Esc` ออก

## ความปลอดภัย

Port Butler ไม่ kill โปรเซสโดยตรงจากการสแกน แต่จะสร้างแผนก่อน พอร์ตที่ป้องกันโดยค่าเริ่มต้น:

```text
22  80  443  5432  6379  3306  27017
```

`clean` จะไม่ลบ Docker, Postgres หรือ Redis โดยค่าเริ่มต้น

## พัฒนา

```bash
bun install
bun run typecheck
bun test packages/cli/src packages/config/src packages/core/src packages/detector/src packages/platform/src
bun run build
```

## ใบอนุญาต

โปรเจกต์นี้ยังไม่มีใบอนุญาต กรุณาเพิ่มก่อนเผยแพร่
