/**
 * Port Butler 文件说明：
 * 配置读取与合并逻辑。
 * 它读取 JSONC 文件、解析用户配置、与默认配置深度合并，并返回运行时可直接使用的配置对象。
 * 读取失败时会转换为 PortButlerError，给 CLI/TUI 提供一致的错误体验。
 */
import { Effect } from "effect";
import { parse } from "jsonc-parser";
import { defaultConfig } from "./defaults";
import { resolveConfigPath } from "./paths";
import type { PortButlerConfig, PortButlerConfigInput } from "./schema";

/**
 * 深度合并配置。只合并 Port Butler 明确支持的结构，避免未知字段污染运行时策略。
 */
export function mergeConfig(input: PortButlerConfigInput = {}): PortButlerConfig {
  return {
    ...defaultConfig,
    ...input,
    // 数组字段采用整体替换语义，避免默认端口和用户端口被意外混合。
    protectedPorts: input.protectedPorts ?? defaultConfig.protectedPorts,
    neverKillProcessNames: input.neverKillProcessNames ?? defaultConfig.neverKillProcessNames,
    devPorts: input.devPorts ?? defaultConfig.devPorts,
    // 嵌套对象采用浅层合并，用户只需要覆盖自己关心的策略开关。
    kill: { ...defaultConfig.kill, ...(input.kill ?? {}) },
    open: { ...defaultConfig.open, ...(input.open ?? {}) },
    docker: { ...defaultConfig.docker, ...(input.docker ?? {}) },
    output: { ...defaultConfig.output, ...(input.output ?? {}) },
  };
}

/**
 * 读取 JSONC 配置并与默认值合并。配置不存在时不会报错，而是返回默认配置。
 */
export function readConfig(explicitPath?: string): Effect.Effect<PortButlerConfig, Error> {
  return Effect.tryPromise({
    try: async () => {
      const path = resolveConfigPath(explicitPath);
      const file = Bun.file(path);
      // 没有配置文件不是错误；首次使用应直接落回保守默认值。
      if (!(await file.exists())) return mergeConfig();
      const text = await file.text();
      // jsonc-parser 支持注释，方便用户在本地配置中记录保护端口来源。
      const parsed = parse(text) as PortButlerConfigInput;
      return mergeConfig(parsed);
    },
    catch: (error) =>
      new Error(
        `读取配置失败。原因：${String(error)}。下一步：请检查 JSONC 语法或使用 --config 指定文件。`,
      ),
  });
}
