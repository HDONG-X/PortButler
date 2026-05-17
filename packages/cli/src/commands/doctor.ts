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
