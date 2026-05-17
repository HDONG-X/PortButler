import { Effect } from "effect";
import { runShell } from "./shell";

/**
 * 使用系统默认浏览器打开本地端口。macOS 使用 open，Windows 使用 PowerShell Start-Process。
 */
export function openLocalhost(url: string): Effect.Effect<void, Error> {
  if (process.platform === "darwin") {
    return Effect.asVoid(runShell("open", [url]));
  }
  if (process.platform === "win32") {
    return Effect.asVoid(
      runShell("powershell.exe", ["-NoProfile", "-Command", `Start-Process '${url}'`]),
    );
  }
  return Effect.fail(new Error("当前平台暂不支持打开浏览器。下一步：请手动打开该 URL。"));
}
