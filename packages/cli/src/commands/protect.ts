import { Effect } from "effect";
import { readConfig, writeConfig } from "@port-butler/config";
import type { GlobalOptions } from "../options";
import { renderJson } from "../output/json";

/**
 * pbt protect：把端口写入保护列表，后续 kill/clean 都会拒绝处理。
 */
export function protectCommand(port: number, options: GlobalOptions): Effect.Effect<string, Error> {
  return Effect.gen(function* () {
    const config = yield* readConfig(options.configPath);
    if (!config.protectedPorts.includes(port)) config.protectedPorts = [...config.protectedPorts, port].sort((a, b) => a - b);
    yield* writeConfig(config, options.configPath);
    return options.json ? renderJson({ protectedPorts: config.protectedPorts }) : `已保护端口 ${port}。`;
  });
}
