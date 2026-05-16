import { Effect } from "effect";
import { dirname } from "node:path";
import { mkdir } from "node:fs/promises";
import { resolveConfigPath } from "./paths";
import type { PortButlerConfig } from "./schema";

/**
 * 写入完整配置。写入前会创建父目录，避免首次 protect/unprotect 因目录缺失失败。
 */
export function writeConfig(
  config: PortButlerConfig,
  explicitPath?: string,
): Effect.Effect<void, Error> {
  return Effect.tryPromise({
    try: async () => {
      const path = resolveConfigPath(explicitPath);
      await mkdir(dirname(path), { recursive: true });
      const text = `${JSON.stringify(config, null, 2)}\n`;
      await Bun.write(path, text);
    },
    catch: (error) =>
      new Error(`写入配置失败。原因：${String(error)}。下一步：请确认配置目录可写。`),
  });
}
