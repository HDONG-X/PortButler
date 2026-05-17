import { Effect } from "effect";
import { readConfig, writeConfig } from "@port-butler/config";
import type { GlobalOptions } from "../options";
import { renderJson } from "../output/json";

/**
 * pbt unprotect：从保护列表移除端口。移除后仍需经过 kill 风险策略。
 */
export function unprotectCommand(
  port: number,
  options: GlobalOptions,
): Effect.Effect<string, Error> {
  return Effect.gen(function* () {
    const config = yield* readConfig(options.configPath);
    config.protectedPorts = config.protectedPorts.filter((item) => item !== port);
    yield* writeConfig(config, options.configPath);
    const json = options.json || config.output.defaultFormat === "json";
    return json
      ? renderJson({ protectedPorts: config.protectedPorts })
      : `已取消保护端口 ${port}。`;
  });
}
