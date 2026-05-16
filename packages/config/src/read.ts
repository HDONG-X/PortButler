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
    protectedPorts: input.protectedPorts ?? defaultConfig.protectedPorts,
    neverKillProcessNames: input.neverKillProcessNames ?? defaultConfig.neverKillProcessNames,
    devPorts: input.devPorts ?? defaultConfig.devPorts,
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
      if (!(await file.exists())) return mergeConfig();
      const text = await file.text();
      const parsed = parse(text) as PortButlerConfigInput;
      return mergeConfig(parsed);
    },
    catch: (error) =>
      new Error(`读取配置失败。原因：${String(error)}。下一步：请检查 JSONC 语法或使用 --config 指定文件。`),
  });
}
