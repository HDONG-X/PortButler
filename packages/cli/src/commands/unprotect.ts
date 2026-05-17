/**
 * Port Butler 文件说明：
 * CLI unprotect 子命令的配置写入入口。
 * 它从用户保护列表移除端口，但不会绕过 core 的系统端口和高风险保护策略。
 * 该操作只改变配置，不会立即影响任何正在运行的进程。
 */
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
