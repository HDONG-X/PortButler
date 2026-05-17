/**
 * Port Butler 文件说明：
 * 清理僵尸开发进程的计划生成与执行逻辑。
 * 该模块只根据已解释的端口和配置筛选候选项，先生成 CleanPlan，再由调用方决定是否执行。
 * Docker/Postgres/Redis 等基础设施默认排除，体现 Port Butler 的保守安全模型。
 */
import { Effect } from "effect";
import type { PortButlerConfig } from "@port-butler/config";
import type { CleanPlan, KillExecutionOptions, KillResult } from "./model";
import { createKillPlan, executeKillPlan } from "./kill-plan";
import { listExplainedPorts } from "./ports";

/**
 * 生成僵尸开发进程清理计划。默认排除 Docker、Postgres、Redis 和受保护端口。
 */
export function createCleanPlan(
  config: PortButlerConfig,
  options: { includeInfra?: boolean; yes?: boolean; dryRun?: boolean },
): Effect.Effect<CleanPlan, Error> {
  return Effect.map(listExplainedPorts(config), (ports) => {
    const candidates = [];
    const skipped: CleanPlan["skipped"] = [];

    for (const item of ports) {
      if (item.protected) {
        skipped.push({ port: item.binding.localPort, pid: item.process.pid, reason: "端口受保护" });
        continue;
      }
      if (item.detection.isInfrastructure && !options.includeInfra) {
        skipped.push({
          port: item.binding.localPort,
          pid: item.process.pid,
          reason: "默认不清理 Docker、Postgres、Redis 等基础设施服务",
        });
        continue;
      }
      if (item.risk === "blocked" || item.risk === "high") {
        skipped.push({ port: item.binding.localPort, pid: item.process.pid, reason: "风险过高" });
        continue;
      }
      if (item.zombieScore >= 70) candidates.push(item);
    }

    return { candidates, skipped, previewOnly: !options.yes || options.dryRun === true };
  });
}

/**
 * 执行 clean 计划。它会为每个候选端口重新生成 kill plan，再统一交给 kill 执行器。
 */
export function executeCleanPlan(
  plan: CleanPlan,
  config: PortButlerConfig,
  options: KillExecutionOptions,
): Effect.Effect<KillResult[], Error> {
  return Effect.gen(function* () {
    const results: KillResult[] = [];
    for (const candidate of plan.candidates) {
      const killPlan = yield* createKillPlan(candidate.binding.localPort, config);
      const killed = yield* executeKillPlan(killPlan, { ...options, yes: true });
      results.push(...killed);
    }
    return results;
  });
}
