/**
 * Port Butler 文件说明：
 * CLI doctor 子命令的薄封装。
 * 该文件把 core 的平台诊断结果转换为终端文本，保持诊断逻辑和展示逻辑分离。
 * doctor 是排障入口，因此返回内容要稳定、简短，并尽量保留每项检查的原始说明。
 */
import { Effect } from "effect";
import { runDoctor } from "@port-butler/core";
import type { GlobalOptions } from "../options";
import { renderJson } from "../output/json";

/**
 * pbt doctor：检查平台依赖与命令可用性。
 */
export function doctorCommand(options: GlobalOptions): Effect.Effect<string, Error> {
  return Effect.map(runDoctor(), (checks) => {
    if (options.json) return renderJson(checks);
    return checks
      .map((check) => `${check.ok ? "OK" : "FAIL"}  ${check.name}  ${check.message}`)
      .join("\n");
  });
}
