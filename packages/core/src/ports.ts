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
