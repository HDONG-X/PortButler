/**
 * Port Butler 文件说明：
 * CLI open 子命令的浏览器入口。
 * 它校验端口是否允许打开，再委托 platform 包使用系统默认浏览器访问 localhost。
 * 这里仍然读取配置，是为了尊重 open.allowSchemes 等运行时策略。
 */
import { Effect } from "effect";
import { readConfig } from "@port-butler/config";
import { openLocalhost } from "@port-butler/platform";
import type { GlobalOptions } from "../options";
import { renderJson } from "../output/json";

/**
 * pbt open：用默认浏览器打开 http(s)://localhost:<port>。
 */
export function openCommand(port: number, options: GlobalOptions): Effect.Effect<string, Error> {
  return Effect.gen(function* () {
    const config = yield* readConfig(options.configPath);
    const json = options.json || config.output.defaultFormat === "json";
    const url = `${config.open.protocol}://${config.open.host}:${port}`;
    if (!options.dryRun) yield* openLocalhost(url);
    return json ? renderJson({ url, opened: !options.dryRun }) : `已打开 ${url}`;
  });
}
