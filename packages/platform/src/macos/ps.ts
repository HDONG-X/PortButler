/**
 * Port Butler 文件说明：
 * macOS ps 输出解析器。
 * 把 ps 的 pid/ppid/command 输出转换为 ProcessInfo，供进程检查器补充命令行和父进程信息。
 * 解析逻辑独立出来，方便用 fixture 测试平台文本格式。
 */
import type { PlatformProcessInfo } from "../model";

/**
 * 解析 ps 单进程输出。ps 的 args 可能包含空格，因此只固定解析前四列，其余作为命令行。
 */
export function parseMacPs(output: string): PlatformProcessInfo {
  const line = output.trim().split(/\r?\n/).at(-1)?.trim() ?? "";
  const match = line.match(/^(\d+)\s+(\d+)\s+(\S+)\s+(\S+)\s*(.*)$/);
  if (!match) throw new Error("无法解析 ps 输出");
  const [, pid, ppid, comm, etime, args] = match;
  return {
    pid: Number(pid),
    ppid: Number(ppid),
    name: comm.split("/").at(-1) ?? comm,
    commandLine: args || comm,
    cwd: null,
    startedAt: startedAtFromEtime(etime),
    user: null,
  };
}

function startedAtFromEtime(etime: string): Date | null {
  const normalized = etime.trim();
  let days = 0;
  let time = normalized;
  if (normalized.includes("-")) {
    const [dayPart, timePart] = normalized.split("-");
    days = Number(dayPart);
    time = timePart;
  }
  const parts = time.split(":").map(Number);
  if (parts.some((part) => !Number.isFinite(part))) return null;
  const [hours = 0, minutes = 0, seconds = 0] =
    parts.length === 3 ? parts : [0, parts[0] ?? 0, parts[1] ?? 0];
  const ms = (((days * 24 + hours) * 60 + minutes) * 60 + seconds) * 1000;
  return new Date(Date.now() - ms);
}
