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
    const url = `${config.open.protocol}://${config.open.host}:${port}`;
    if (!options.dryRun) yield* openLocalhost(url);
    return options.json ? renderJson({ url, opened: !options.dryRun }) : `已打开 ${url}`;
  });
}
