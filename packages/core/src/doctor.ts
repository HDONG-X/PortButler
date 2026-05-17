/**
 * Port Butler 文件说明：
 * core 层诊断聚合器。
 * 它把 platform 包的系统依赖检查包装为领域函数，供 CLI 和 TUI 共用。
 * 诊断不改变系统状态，只用于给用户提供下一步排障线索。
 */
import { Effect } from "effect";
import { getPlatformDiagnostics } from "@port-butler/platform";

/**
 * 执行系统诊断，检查当前平台和所需命令是否可用。
 */
export function runDoctor(): Effect.Effect<
  Array<{ name: string; ok: boolean; message: string }>,
  Error
> {
  return getPlatformDiagnostics();
}
