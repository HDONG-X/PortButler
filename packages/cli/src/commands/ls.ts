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
