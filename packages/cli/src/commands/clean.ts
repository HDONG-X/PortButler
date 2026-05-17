/**
 * Port Butler 文件说明：
 * CLI clean 子命令的命令层适配器。
 * 它只负责读取配置、调用 core 生成清理计划、根据 --yes 决定是否执行，并把结果交给输出层格式化。
 * 危险动作必须先经过 CleanPlan，因此这里不能直接扫描或终止进程。
 */
import { Effect } from "effect";
import { readConfig } from "@port-butler/config";
import { createCleanPlan, executeCleanPlan } from "@port-butler/core";
import type { GlobalOptions } from "../options";
import { renderJson } from "../output/json";
import { renderCleanPlan, renderKillResult } from "../output/table";

/**
 * pbt clean：生成僵尸开发进程清理计划，默认只预览，不清理基础设施服务。
 */
export function cleanCommand(options: GlobalOptions): Effect.Effect<string, Error> {
  return Effect.gen(function* () {
    const config = yield* readConfig(options.configPath);
    const json = options.json || config.output.defaultFormat === "json";
    const plan = yield* createCleanPlan(config, {
      includeInfra: options.includeInfra,
      yes: options.yes,
      dryRun: options.dryRun,
    });
    if (!options.yes || options.dryRun) return json ? renderJson(plan) : renderCleanPlan(plan);
    const results = yield* executeCleanPlan(plan, config, {
      ...options,
      yes: true,
      force: options.force || config.kill.force,
      tree: config.kill.tree,
      graceMs: config.kill.graceMs,
    });
    return json
      ? renderJson({ plan, results })
      : `${renderCleanPlan(plan)}\n\n${renderKillResult(results)}`;
  });
}
