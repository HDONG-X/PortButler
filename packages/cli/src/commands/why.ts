import { Effect } from "effect";
import { readConfig } from "@port-butler/config";
import { explainPort } from "@port-butler/core";
import type { GlobalOptions } from "../options";
import { renderJson } from "../output/json";
import { renderWhy } from "../output/table";

/**
 * pbt why：解释指定端口由谁占用，以及为什么这么识别。
 */
export function whyCommand(port: number, options: GlobalOptions): Effect.Effect<string, Error> {
  return Effect.gen(function* () {
    const config = yield* readConfig(options.configPath);
    const json = options.json || config.output.defaultFormat === "json";
    const explained = yield* explainPort(port, config);
    if (!explained)
      return json ? renderJson({ port, bindings: [] }) : `端口 ${port} 当前没有监听进程。`;
    return json ? renderJson(explained) : renderWhy(explained);
  });
}
