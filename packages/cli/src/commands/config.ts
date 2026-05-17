import { Effect } from "effect";
import { defaultConfig, readConfig, resolveConfigPath, writeConfig } from "@port-butler/config";
import type { GlobalOptions } from "../options";
import { renderJson } from "../output/json";

/**
 * pbt config：查看配置路径、当前合并配置，或初始化默认配置文件。
 */
export function configCommand(
  args: string[],
  options: GlobalOptions,
): Effect.Effect<string, Error> {
  return Effect.gen(function* () {
    const action = args[0] ?? "show";
    if (action === "path") {
      const path = resolveConfigPath(options.configPath);
      return options.json ? renderJson({ path }) : path;
    }

    if (action === "show") {
      const config = yield* readConfig(options.configPath);
      return renderJson(config);
    }

    if (action === "init") {
      yield* writeConfig(defaultConfig, options.configPath);
      const path = resolveConfigPath(options.configPath);
      return options.json ? renderJson({ path, written: true }) : `已写入默认配置：${path}`;
    }

    throw new Error(
      `未知 config 子命令：${action}。下一步：执行 pbt config path、pbt config show 或 pbt config init。`,
    );
  });
}
