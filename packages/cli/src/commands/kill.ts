/**
 * Port Butler 文件说明：
 * CLI kill 子命令的安全执行入口。
 * 它先读取配置并创建 KillPlan，再根据 --yes 和 --force 决定是否执行，保证扫描阶段不会直接杀进程。
 * 所有终端输出都从 KillPlan/KillResult 渲染，方便 dry-run 与真实执行保持同一种用户心智模型。
 */
import { Effect } from "effect";
import { readConfig } from "@port-butler/config";
import { createKillPlan, executeKillPlan } from "@port-butler/core";
import type { GlobalOptions } from "../options";
import { renderJson } from "../output/json";
import { renderKillPlan, renderKillResult } from "../output/table";

/**
 * pbt kill：先生成 kill plan，再根据用户选项执行，禁止扫描阶段直接终止进程。
 */
export function killCommand(port: number, options: GlobalOptions): Effect.Effect<string, Error> {
  return Effect.gen(function* () {
    const config = yield* readConfig(options.configPath);
    const json = options.json || config.output.defaultFormat === "json";
    const plan = yield* createKillPlan(port, config);
    if (!options.yes || options.dryRun || plan.blocked)
      return json ? renderJson(plan) : renderKillPlan(plan);
    const results = yield* executeKillPlan(plan, {
      ...options,
      force: options.force || config.kill.force,
      tree: config.kill.tree,
      graceMs: config.kill.graceMs,
    });
    return json
      ? renderJson({ plan, results })
      : `${renderKillPlan(plan)}\n\n${renderKillResult(results)}`;
  });
}
