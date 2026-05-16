import { Effect } from "effect";
import type { PlatformKillOptions, PlatformKillResult } from "./model";
import { runShell } from "./shell";

/**
 * 终止指定进程。此函数只执行调用方已经批准的计划，不做扫描或安全决策。
 */
export function killProcess(
  pid: number,
  options: PlatformKillOptions,
): Effect.Effect<PlatformKillResult, Error> {
  if (process.platform === "darwin") {
    const signal = options.force ? "-KILL" : options.graceful ? "-TERM" : "-TERM";
    return Effect.map(runShell("kill", [signal, String(pid)]), () => ({
      pid,
      ok: true,
      message: `已向 PID ${pid} 发送 ${signal} 信号。`,
    }));
  }
  if (process.platform === "win32") {
    const args = ["/PID", String(pid)];
    if (options.tree) args.push("/T");
    if (options.force) args.push("/F");
    return Effect.map(runShell("taskkill.exe", args), () => ({
      pid,
      ok: true,
      message: `已执行 taskkill 终止 PID ${pid}。`,
    }));
  }
  return Effect.fail(new Error("当前平台暂不支持终止进程。下一步：请在 macOS 或 Windows 上运行。"));
}
