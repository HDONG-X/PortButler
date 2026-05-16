import type { PortButlerConfig } from "@port-butler/config";
import type { DetectionResult, ProcessInfo, RiskLevel } from "./model";

/**
 * 判断端口是否受保护。保护端口拥有最高优先级，即便看起来像开发服务器也不能直接 kill。
 */
export function isProtectedPort(port: number, config: PortButlerConfig): boolean {
  return config.protectedPorts.includes(port);
}

/**
 * 判断进程名是否属于永不终止清单。比较时统一小写，兼容 Windows 的 .exe 命名。
 */
export function isNeverKillProcess(process: ProcessInfo, config: PortButlerConfig): boolean {
  const name = process.name.toLowerCase();
  return config.neverKillProcessNames.some((item) => item.toLowerCase() === name);
}

/**
 * 根据保护规则、进程类型和置信度生成 kill 风险等级。
 */
export function resolveKillRisk(input: {
  protected: boolean;
  neverKill: boolean;
  detection: DetectionResult;
}): RiskLevel {
  if (input.protected || input.neverKill) return "blocked";
  if (input.detection.isInfrastructure) return "high";
  if (input.detection.isDevServer && input.detection.confidence >= 75) return "low";
  if (input.detection.kind === "unknown") return "high";
  return "medium";
}
