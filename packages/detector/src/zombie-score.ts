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

  if (input.detection.isDevServer) {
    score += 30;
    reasons.push("识别为开发服务器");
  }

  const ageMinutes = processAgeMinutes(input.process.startedAt);
  if (ageMinutes !== null && ageMinutes >= input.config.zombieThresholdMinutes) {
    score += 15;
    reasons.push(`运行时间超过 ${input.config.zombieThresholdMinutes} 分钟`);
  }

  if (input.process.ppid === null || input.process.ppid === 1) {
    score += 20;
    reasons.push("父进程缺失或疑似由系统托管");
  }

  if (input.process.cwd && !existsSync(input.process.cwd)) {
    score += 20;
    reasons.push("工作目录不存在");
  }

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

  if (input.detection.isInfrastructure) {
    score -= 80;
    reasons.push("基础设施服务默认不清理");
  }

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
