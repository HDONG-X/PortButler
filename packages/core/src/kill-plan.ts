import { Effect } from "effect";
import type { PortButlerConfig } from "@port-butler/config";
import { killProcess } from "@port-butler/platform";
import { PortButlerError } from "./errors";
import type { KillExecutionOptions, KillPlan, KillResult } from "./model";
import { explainPort } from "./ports";

/**
 * 为指定端口生成 kill 计划。此函数只做扫描和决策，绝不执行终止操作。
 */
export function createKillPlan(
  port: number,
  config: PortButlerConfig,
): Effect.Effect<KillPlan, Error> {
  return Effect.gen(function* () {
    const explained = yield* explainPort(port, config);
    if (!explained) {
      return {
        port,
        targets: [],
        blocked: true,
        message: `端口 ${port} 当前没有监听进程。`,
        requiresConfirmation: false,
      };
    }

    const target = {
      pid: explained.process.pid,
      name: explained.process.name,
      port,
      kind: explained.detection.kind,
      risk: explained.risk,
      reasons: [...explained.detection.reasons, ...explained.zombieReasons],
    };

    if (explained.risk === "blocked") {
      return {
        port,
        targets: [target],
        blocked: true,
        message: `端口 ${port} 受保护或进程位于永不终止清单中。`,
        requiresConfirmation: false,
      };
    }

    return {
      port,
      targets: [target],
      blocked: false,
      message: `准备释放端口 ${port}。`,
      requiresConfirmation: explained.risk !== "low",
    };
  });
}

/**
 * 执行 kill 计划。所有危险操作都只能从这里进入，确保扫描逻辑不会直接 kill。
 */
export function executeKillPlan(
  plan: KillPlan,
  options: KillExecutionOptions,
): Effect.Effect<KillResult[], Error> {
  return Effect.gen(function* () {
    if (plan.blocked) {
      return yield* Effect.fail(
        new PortButlerError({
          code: "PROTECTED_OR_BLOCKED",
          message: "无法执行 kill 计划。",
          reason: plan.message,
          suggestion: "如确实需要释放端口，请先取消保护，或确认该进程不在永不终止清单中。",
          exitCode: 4,
        }),
      );
    }
    if (options.dryRun) {
      return plan.targets.map((target) => ({
        pid: target.pid,
        ok: true,
        message: "dry-run：已生成计划，未执行终止。",
      }));
    }
    if (plan.requiresConfirmation && !options.yes) {
      return yield* Effect.fail(
        new PortButlerError({
          code: "CONFIRMATION_REQUIRED",
          message: "该 kill 计划需要确认。",
          reason: "目标不是低风险开发服务，直接终止可能影响 Docker、数据库或未知服务。",
          suggestion: "请检查 pbt kill <port> --dry-run 的输出，确认后加 --yes；高风险目标还需要 --force。",
          exitCode: 6,
        }),
      );
    }
    const hasHighRisk = plan.targets.some((target) => target.risk === "high");
    if (hasHighRisk && !options.force) {
      return yield* Effect.fail(
        new PortButlerError({
          code: "FORCE_REQUIRED",
          message: "拒绝终止高风险进程。",
          reason: "高风险进程可能是数据库、Docker 或未知系统服务。",
          suggestion: "确认无数据风险后，再执行同一命令并加上 --yes --force。",
          exitCode: 1,
        }),
      );
    }

    const uniquePids = [...new Map(plan.targets.map((target) => [target.pid, target])).values()];
    return yield* Effect.forEach(
      uniquePids,
      (target) =>
        killProcess(target.pid, {
          graceful: true,
          force: options.force === true,
          tree: true,
        }),
      { concurrency: 2 },
    );
  });
}
