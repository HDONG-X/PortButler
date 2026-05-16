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
    const plan = yield* createCleanPlan(config, {
      includeInfra: options.includeInfra,
      yes: options.yes,
      dryRun: options.dryRun,
    });
    if (!options.yes || options.dryRun) return options.json ? renderJson(plan) : renderCleanPlan(plan);
    const results = yield* executeCleanPlan(plan, config, { ...options, yes: true });
    return options.json ? renderJson({ plan, results }) : `${renderCleanPlan(plan)}\n\n${renderKillResult(results)}`;
  });
}
