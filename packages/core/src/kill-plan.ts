/**
 * Port Butler 文件说明：
 * 端口释放的安全计划生成与执行逻辑。
 * createKillPlan 只负责解释风险并形成计划，executeKillPlan 才会真正调用 platform 终止进程。
 * 保护端口、高风险目标和 --force/--yes 规则都在这里收口，防止 UI 绕过安全策略。
 */
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

    // KillPlan 只保存执行所需的最小目标信息；更完整的解释留在 why/ls 输出里。
    const target = {
      pid: explained.process.pid,
      name: explained.process.name,
      port,
      kind: explained.detection.kind,
      risk: explained.risk,
      reasons: [...explained.detection.reasons, ...explained.zombieReasons],
    };

    // blocked 是硬拒绝：即使用户传 --yes，也不能绕过保护端口或 neverKill 进程。
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
    // dry-run 必须在确认检查前返回，确保用户可以安全预览任何风险等级的计划。
    if (options.dryRun) {
      return plan.targets.map((target) => ({
        pid: target.pid,
        ok: true,
        message: "dry-run：已生成计划，未执行终止。",
      }));
    }
    // 中高风险目标必须显式 --yes，避免把“生成计划”和“执行计划”混在一起。
    if (plan.requiresConfirmation && !options.yes) {
      return yield* Effect.fail(
        new PortButlerError({
          code: "CONFIRMATION_REQUIRED",
          message: "该 kill 计划需要确认。",
          reason: "目标不是低风险开发服务，直接终止可能影响 Docker、数据库或未知服务。",
          suggestion:
            "请检查 pbt kill <port> --dry-run 的输出，确认后加 --yes；高风险目标还需要 --force。",
          exitCode: 6,
        }),
      );
    }
    // high risk 再额外要求 --force；这是数据库、Docker、未知系统服务的最后一道闸门。
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

    // 同一个进程可能同时监听 IPv4/IPv6 或多个地址，同一 PID 只终止一次。
    const uniquePids = [...new Map(plan.targets.map((target) => [target.pid, target])).values()];
    return yield* Effect.forEach(
      uniquePids,
      (target) =>
        killProcess(target.pid, {
          graceful: true,
          force: options.force === true,
          tree: options.tree ?? true,
        }),
      { concurrency: 2 },
    );
  });
}
