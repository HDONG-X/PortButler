/**
 * Port Butler 文件说明：
 * CLI protect 子命令的配置写入入口。
 * 它把端口加入用户保护列表，并通过 config 包完成读写，避免 CLI 自己拼配置文件。
 * 保护端口会影响 kill 和 clean 的风险决策，因此这里保持幂等：重复保护不会产生重复值。
 */
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
    if (!config.protectedPorts.includes(port))
      config.protectedPorts = [...config.protectedPorts, port].sort((a, b) => a - b);
    yield* writeConfig(config, options.configPath);
    const json = options.json || config.output.defaultFormat === "json";
    return json ? renderJson({ protectedPorts: config.protectedPorts }) : `已保护端口 ${port}。`;
  });
}
