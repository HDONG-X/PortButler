/**
 * Port Butler 文件说明：
 * 平台依赖诊断。
 * 检查当前操作系统和必要命令是否可用，为 pbt doctor 提供原始诊断项。
 * 诊断逻辑尽量只读，不能修改用户系统状态。
 */
import { Effect } from "effect";
import { commandExists } from "./shell";

/**
 * 检查平台依赖是否可用，输出给 pbt doctor 展示。
 */
export function getPlatformDiagnostics(): Effect.Effect<
  Array<{ name: string; ok: boolean; message: string }>,
  Error
> {
  return Effect.gen(function* () {
    const platformOk = process.platform === "darwin" || process.platform === "win32";
    const checks: Array<{ name: string; ok: boolean; message: string }> = [
      {
        name: "platform",
        ok: platformOk,
        message: platformOk
          ? `当前平台 ${process.platform} 受支持`
          : "第一版只支持 macOS 与 Windows",
      },
    ];

    const commands =
      process.platform === "darwin"
        ? ["lsof", "ps", "kill", "open"]
        : ["powershell.exe", "netstat.exe", "taskkill.exe"];
    for (const command of commands) {
      const ok = yield* commandExists(command);
      checks.push({
        name: command,
        ok,
        message: ok ? `${command} 可用` : `${command} 不可用，请检查系统 PATH 或权限`,
      });
    }
    return checks;
  });
}
