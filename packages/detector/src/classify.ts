import type { DetectorProcessInfo, DetectorResult } from "./model";
import { nodeDevCommandHints } from "./rules";

/**
 * 识别进程类型。规则以进程名和命令行为主，端口只作为辅助信号，避免单靠端口误判。
 */
export function classifyProcess(process: DetectorProcessInfo, port: number): DetectorResult {
  const name = process.name.toLowerCase();
  const command = (process.commandLine ?? "").toLowerCase();
  const reasons: string[] = [];

  if (name.includes("docker") || command.includes("docker")) {
    return result("docker", 90, true, false, ["进程名或命令行包含 docker"]);
  }
  if (name.includes("postgres") || name.includes("postmaster") || command.includes("postgres")) {
    return result("postgres", 92, true, false, ["进程名或命令行包含 postgres"]);
  }
  if (name.includes("redis") || command.includes("redis-server")) {
    return result("redis", 92, true, false, ["进程名或命令行包含 redis"]);
  }
  if (command.includes("next dev") || command.includes(" next ")) {
    reasons.push("命令行包含 next dev 或 next");
    if (port === 3000 || port === 3001) reasons.push("监听 Next 常见开发端口");
    return result("next", 88, false, true, reasons);
  }
  if (command.includes("vite") || port === 5173 || port === 5174) {
    reasons.push(command.includes("vite") ? "命令行包含 vite" : "监听 Vite 常见端口");
    return result("vite", command.includes("vite") ? 90 : 72, false, true, reasons);
  }
  if (name === "bun" || name.endsWith("\\bun.exe") || command.includes("bun run")) {
    return result("bun", 76, false, true, ["进程名或命令行包含 bun"]);
  }
  if (name === "node" || name === "node.exe" || command.includes("node ")) {
    const matched = nodeDevCommandHints.filter((hint) => command.includes(hint.trim()));
    if (matched.length > 0) {
      return result("node", 78, false, true, [`命令行包含开发命令：${matched.join(", ")}`]);
    }
    return result("node", 60, false, false, ["进程名为 node，但缺少明确开发服务器特征"]);
  }
  return result("unknown", 20, false, false, ["没有命中已知服务规则"]);
}

function result(
  kind: DetectorResult["kind"],
  confidence: number,
  isInfrastructure: boolean,
  isDevServer: boolean,
  reasons: string[],
): DetectorResult {
  return { kind, confidence, isInfrastructure, isDevServer, reasons };
}
