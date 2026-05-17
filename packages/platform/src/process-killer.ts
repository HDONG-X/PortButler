/**
 * Port Butler 文件说明：
 * 跨平台进程终止工具。
 * 根据当前系统选择 taskkill 或 kill，并把系统命令结果转换为 KillResult。
 * 它只执行传入 PID 的终止动作，不负责判断 PID 是否安全。
 */
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
