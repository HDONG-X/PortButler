import { Effect } from "effect";
import type { PortButlerConfig } from "@port-butler/config";
import { classifyProcess, scoreZombieProcess } from "@port-butler/detector";
import { inspectProcess, listListeningPorts } from "@port-butler/platform";
import type { ExplainedPort, ProcessInfo } from "./model";
import { isNeverKillProcess, isProtectedPort, resolveKillRisk } from "./protection";

/**
 * 根据平台扫描结果、进程详情、检测器和保护策略生成完整端口解释列表。
 */
export function listExplainedPorts(config: PortButlerConfig): Effect.Effect<ExplainedPort[], Error> {
  return Effect.gen(function* () {
    const bindings = yield* listListeningPorts();
    const uniqueBindings = dedupeBindings(bindings);
    const explained = yield* Effect.forEach(
      uniqueBindings,
      (binding) =>
        Effect.gen(function* () {
          const process = yield* Effect.catchAll(
            inspectProcess(binding.pid),
            () =>
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
          const detection = classifyProcess(process, binding.localPort);
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
          return { binding, process, detection, protected: protectedPort, risk, ...zombie };
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
  return Effect.map(listExplainedPorts(config), (ports) =>
    ports.find((item) => item.binding.localPort === port) ?? null,
  );
}

/**
 * 去重 IPv4/IPv6 或平台命令重复返回的同一 PID/端口记录。
 */
export function dedupeBindings<T extends { localAddress: string; localPort: number; pid: number }>(
  bindings: T[],
): T[] {
  const seen = new Set<string>();
  const output: T[] = [];
  for (const binding of bindings) {
    const key = `${binding.localPort}:${binding.pid}:${binding.localAddress}`;
    if (!seen.has(key)) {
      seen.add(key);
      output.push(binding);
    }
  }
  return output;
}
