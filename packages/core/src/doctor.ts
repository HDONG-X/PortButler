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
