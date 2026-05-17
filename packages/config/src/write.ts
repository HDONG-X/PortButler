/**
 * Port Butler 文件说明：
 * 配置写入工具。
 * 负责创建目录、稳定序列化 JSON，并保留 config 包对磁盘格式的唯一控制权。
 * protect/unprotect/config init 等命令都通过这里写入，避免多个包各自实现文件写入。
 */
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
