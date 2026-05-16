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
    const plan = yield* createKillPlan(port, config);
    if (options.dryRun || plan.blocked) return options.json ? renderJson(plan) : renderKillPlan(plan);
    const results = yield* executeKillPlan(plan, options);
    return options.json ? renderJson({ plan, results }) : `${renderKillPlan(plan)}\n\n${renderKillResult(results)}`;
  });
}
