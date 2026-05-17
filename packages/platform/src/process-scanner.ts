/**
 * Port Butler 文件说明：
 * 监听端口扫描器。
 * 根据平台调用 Windows 或 macOS 的端口命令，并统一转换为 ListeningPort 列表。
 * 扫描器只收集事实，不做进程分类、风险判断或清理决策。
 */
import { Effect } from "effect";
import { runShell } from "./shell";
import type { PlatformPortBinding } from "./model";
import { parseLsofListeningPorts } from "./macos/lsof";
import { parseGetNetTcpConnectionJson } from "./windows/powershell";
import { parseNetstat } from "./windows/netstat";

/**
 * 扫描当前系统监听端口。macOS 使用 lsof，Windows 优先 PowerShell 并用 netstat 兜底。
 */
export function listListeningPorts(): Effect.Effect<PlatformPortBinding[], Error> {
  if (process.platform === "darwin") {
    return Effect.map(
      runShell("lsof", ["-nP", "-iTCP", "-sTCP:LISTEN"], { allowFailure: true }),
      (r) => parseLsofListeningPorts(r.stdout),
    );
  }
  if (process.platform === "win32") {
    const script =
      "[Console]::OutputEncoding=[System.Text.Encoding]::UTF8; Get-NetTCPConnection -State Listen | Select-Object LocalAddress,LocalPort,OwningProcess,State | ConvertTo-Json -Depth 3";
    return Effect.catchAll(
      Effect.map(runShell("powershell.exe", ["-NoProfile", "-Command", script]), (r) =>
        parseGetNetTcpConnectionJson(r.stdout),
      ),
      () =>
        Effect.map(runShell("netstat.exe", ["-ano", "-p", "tcp"]), (r) => parseNetstat(r.stdout)),
    );
  }
  return Effect.fail(
    new Error(
      "当前平台暂不支持。原因：第一版只支持 macOS 与 Windows。下一步：请在受支持系统上运行。",
    ),
  );
}
