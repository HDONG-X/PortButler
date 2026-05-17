/**
 * Port Butler 文件说明：
 * 端口解释主流程。
 * 它把 platform 的监听端口与进程信息、detector 的分类结果、config 的保护策略合并为 ExplainedPort。
 * 该模块是只读分析入口，不执行 kill/open/write 等副作用。
 */
import { Effect } from "effect";
import type { PortButlerConfig } from "@port-butler/config";
import { classifyProcess, scoreZombieProcess } from "@port-butler/detector";
import { inspectProcess, listListeningPorts } from "@port-butler/platform";
import type { ExplainedPort, ProcessInfo } from "./model";
import { isNeverKillProcess, isProtectedPort, resolveKillRisk } from "./protection";

/**
 * 根据平台扫描结果、进程详情、检测器和保护策略生成完整端口解释列表。
 */
export function listExplainedPorts(
  config: PortButlerConfig,
): Effect.Effect<ExplainedPort[], Error> {
  return Effect.gen(function* () {
    const bindings = yield* listListeningPorts();
    const uniqueBindings = dedupeBindings(bindings);
    const explained = yield* Effect.forEach(
      uniqueBindings,
      (binding) =>
        Effect.gen(function* () {
          // 某些系统进程会拒绝读取详情；端口列表仍应可用，因此降级成 unknown 进程。
          const process = yield* Effect.catchAll(inspectProcess(binding.pid), () =>
            Effect.succeed<ProcessInfo>({
              pid: binding.pid,
              ppid: null,
              name: "unknown",
              commandLine: null,
              cwd: null,
              startedAt: null,
              user: null,
            }),
          );
          const detected = classifyProcess(process, binding.localPort);
          // Docker 识别可被配置关闭，关闭后保留端口事实，但不再赋予 Docker 语义。
          const detection =
            !config.docker.enabled && detected.kind === "docker"
              ? {
                  kind: "unknown" as const,
                  confidence: 20,
                  isInfrastructure: false,
                  isDevServer: false,
                  reasons: ["Docker 识别已在配置中关闭"],
                }
              : detected;
          // 风险由保护端口、neverKill 名单和 detector 分类共同决定，保持安全口径集中。
          const protectedPort = isProtectedPort(binding.localPort, config);
          const neverKill = isNeverKillProcess(process, config);
          const risk = resolveKillRisk({ protected: protectedPort, neverKill, detection });
          const zombie = scoreZombieProcess({
            binding,
            process,
            detection,
            config,
            protected: protectedPort,
          });
          // neverKill 进程不参与僵尸清理评分，防止 clean 把系统级守护进程列入候选。
          const safeZombie = neverKill
            ? { zombieScore: 0, zombieReasons: ["进程位于永不终止清单"] }
            : zombie;
          return { binding, process, detection, protected: protectedPort, risk, ...safeZombie };
        }),
      { concurrency: 8 },
    );
    return explained.sort((a, b) => a.binding.localPort - b.binding.localPort);
  });
}

/**
 * 查找并解释单个端口。端口不存在时返回 null，交给调用方生成合适输出。
 */
export function explainPort(
  port: number,
  config: PortButlerConfig,
): Effect.Effect<ExplainedPort | null, Error> {
  return Effect.map(
    listExplainedPorts(config),
    (ports) => ports.find((item) => item.binding.localPort === port) ?? null,
  );
}

/**
 * 去重 IPv4/IPv6 或平台命令重复返回的同一 PID/端口记录。
 */
export function dedupeBindings<T extends { localAddress: string; localPort: number; pid: number }>(
  bindings: T[],
): T[] {
  const byPortAndPid = new Map<string, T>();
  for (const binding of bindings) {
    // 以 port+pid 为主键，而不是包含地址，避免双栈监听在 UI 中重复出现。
    const key = `${binding.localPort}:${binding.pid}`;
    const existing = byPortAndPid.get(key);
    if (!existing || addressRank(binding.localAddress) > addressRank(existing.localAddress)) {
      byPortAndPid.set(key, binding);
    }
  }
  return [...byPortAndPid.values()];
}

function addressRank(address: string): number {
  if (address === "0.0.0.0" || address === "::" || address === "*") return 0;
  if (address === "127.0.0.1" || address === "::1") return 2;
  return 3;
}
