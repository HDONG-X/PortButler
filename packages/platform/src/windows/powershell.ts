import type { PlatformPortBinding, PlatformProcessInfo } from "../model";

interface NetTcpRow {
  LocalAddress?: string;
  LocalPort?: number;
  OwningProcess?: number;
  State?: string;
}

interface CimProcessRow {
  ProcessId?: number;
  ParentProcessId?: number;
  Name?: string;
  CommandLine?: string;
  CreationDate?: string;
}

/**
 * 解析 Get-NetTCPConnection 的 JSON 输出。PowerShell 单条记录会返回对象，多条才是数组。
 */
export function parseGetNetTcpConnectionJson(output: string): PlatformPortBinding[] {
  if (!output.trim()) return [];
  const parsed = JSON.parse(output) as NetTcpRow | NetTcpRow[];
  const rows = Array.isArray(parsed) ? parsed : [parsed];
  return rows
    .filter((row) => row.LocalPort && row.OwningProcess)
    .map((row) => ({
      localAddress: row.LocalAddress ?? "0.0.0.0",
      localPort: Number(row.LocalPort),
      pid: Number(row.OwningProcess),
      protocol: "tcp" as const,
    }));
}

/**
 * 解析 Get-CimInstance Win32_Process 的 JSON 输出。
 */
export function parseCimProcessJson(output: string, pid: number): PlatformProcessInfo {
  const parsed = JSON.parse(output) as CimProcessRow;
  return {
    pid: Number(parsed.ProcessId ?? pid),
    ppid: parsed.ParentProcessId === undefined ? null : Number(parsed.ParentProcessId),
    name: parsed.Name ?? "unknown",
    commandLine: parsed.CommandLine ?? parsed.Name ?? null,
    cwd: null,
    startedAt: parseWmiDate(parsed.CreationDate),
    user: null,
  };
}

function parseWmiDate(value?: string): Date | null {
  if (!value) return null;
  const jsonDate = value.match(/\/Date\((\d+)\)\//);
  if (jsonDate) return new Date(Number(jsonDate[1]));
  const match = value.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
  if (!match) return null;
  const [, year, month, day, hour, minute, second] = match;
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  );
}
