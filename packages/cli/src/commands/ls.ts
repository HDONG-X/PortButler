/**
 * Port Butler 文件说明：
 * CLI ls 子命令的只读入口。
 * 该命令读取配置后调用 core 聚合端口、进程、保护策略和风险信息，再按 --json 或表格输出。
 * 它不做任何写入和终止动作，是用户了解当前端口状态的最低风险命令。
 */
import { Effect } from "effect";
import { readConfig } from "@port-butler/config";
import { listExplainedPorts } from "@port-butler/core";
import type { GlobalOptions } from "../options";
import { renderJson } from "../output/json";
import { renderPortTable } from "../output/table";

/**
 * pbt ls：列出当前监听端口。该命令只读，不会触发危险操作。
 */
export function lsCommand(options: GlobalOptions): Effect.Effect<string, Error> {
  return Effect.gen(function* () {
    const config = yield* readConfig(options.configPath);
    const ports = yield* listExplainedPorts(config);
    const json = options.json || config.output.defaultFormat === "json";
    return json ? renderJson(ports) : renderPortTable(ports);
  });
}
