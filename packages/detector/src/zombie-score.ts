/**
 * Port Butler 文件说明：
 * 僵尸开发进程评分器。
 * 根据端口、进程类型、命令行特征、空闲时长和配置权重计算 cleanup 候选分数。
 * 评分只表达清理倾向，最终是否执行仍由 clean plan 和用户确认决定。
 */
import { existsSync } from "node:fs";
import type { ZombieScoreInput } from "./model";

/**
 * 计算疑似僵尸开发进程评分。基础设施和受保护端口会被大幅扣分，避免 clean 误伤。
 */
export function scoreZombieProcess(input: ZombieScoreInput): {
  zombieScore: number;
  zombieReasons: string[];
} {
  let score = 0;
  const reasons: string[] = [];
  const command = (input.process.commandLine ?? "").toLowerCase();

  // 开发服务器是 clean 的主要目标，因此先给基础加分。
  if (input.detection.isDevServer) {
    score += 30;
    reasons.push("识别为开发服务器");
  }

  // 运行时间超过阈值说明它更可能是遗留会话，但单独不足以判定可清理。
  const ageMinutes = processAgeMinutes(input.process.startedAt);
  if (ageMinutes !== null && ageMinutes >= input.config.zombieThresholdMinutes) {
    score += 15;
    reasons.push(`运行时间超过 ${input.config.zombieThresholdMinutes} 分钟`);
  }

  // 父进程丢失或被系统托管，通常意味着原开发终端已经退出。
  if (input.process.ppid === null || input.process.ppid === 1) {
    score += 20;
    reasons.push("父进程缺失或疑似由系统托管");
  }

  // 工作目录不存在常见于项目被删除或移动后的残留进程。
  if (input.process.cwd && !existsSync(input.process.cwd)) {
    score += 20;
    reasons.push("工作目录不存在");
  }

  // 命令行关键词提供弱信号：它们会加分，但不会单独造成危险动作。
  if (
    command.includes("dev") ||
    /\bserve\b/.test(command) ||
    command.includes("vite") ||
    command.includes("next dev")
  ) {
    score += 10;
    reasons.push("命令行包含开发服务关键字");
  }

  if (input.config.devPorts.includes(input.binding.localPort)) {
    score += 5;
    reasons.push("监听常见开发端口");
  }

  // 基础设施服务必须强扣分，确保 clean 默认更偏向“不动它”。
  if (input.detection.isInfrastructure) {
    score -= 80;
    reasons.push("基础设施服务默认不清理");
  }

  // 用户保护端口是最强负信号，最终分数会被压到 0。
  if (input.protected) {
    score -= 100;
    reasons.push("端口受保护");
  }

  return { zombieScore: Math.max(0, Math.min(100, score)), zombieReasons: reasons };
}

function processAgeMinutes(startedAt: Date | null): number | null {
  if (!startedAt) return null;
  return Math.max(0, Math.floor((Date.now() - startedAt.getTime()) / 60000));
}
