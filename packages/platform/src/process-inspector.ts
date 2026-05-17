/**
 * Port Butler 文件说明：
 * 进程详情检查器。
 * 根据 PID 调用不同平台命令获取命令行、父进程和启动时间等信息。
 * 如果系统拒绝访问或命令失败，会返回尽可能多的已知信息，而不是让整个扫描中断。
 */
import { Effect } from "effect";
import { runShell } from "./shell";
import type { PlatformProcessInfo } from "./model";
import { parseMacPs } from "./macos/ps";
import { parseCimProcessJson } from "./windows/powershell";

/**
 * 根据 PID 获取进程详情。权限不足时调用方会降级显示最小信息。
 */
export function inspectProcess(pid: number): Effect.Effect<PlatformProcessInfo, Error> {
  if (process.platform === "darwin") {
    return Effect.map(
      runShell("ps", [
        "-p",
        String(pid),
        "-o",
        "pid=",
        "-o",
        "ppid=",
        "-o",
        "comm=",
        "-o",
        "etime=",
        "-o",
        "args=",
      ]),
      (r) => parseMacPs(r.stdout),
    );
  }
  if (process.platform === "win32") {
    const script = `[Console]::OutputEncoding=[System.Text.Encoding]::UTF8; Get-CimInstance Win32_Process -Filter "ProcessId = ${pid}" | Select-Object ProcessId,ParentProcessId,Name,CommandLine,CreationDate | ConvertTo-Json -Depth 3`;
    return Effect.map(runShell("powershell.exe", ["-NoProfile", "-Command", script]), (r) =>
      parseCimProcessJson(r.stdout, pid),
    );
  }
  return Effect.fail(
    new Error("当前平台暂不支持进程详情读取。下一步：请在 macOS 或 Windows 上运行。"),
  );
}
