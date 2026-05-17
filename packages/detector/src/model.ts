/**
 * Port Butler 文件说明：
 * detector 层数据模型。
 * 定义分类输入、分类结果、进程类型和僵尸评分结果，作为 detector 与 core 的契约。
 * 模型字段偏解释型，方便 CLI/TUI 把判断依据展示给用户。
 */
import type { PortButlerConfig } from "@port-butler/config";

/**
 * 检测器内部使用的最小进程信息，避免 detector 反向依赖 core。
 */
export interface DetectorProcessInfo {
  /** 进程 ID。 */
  pid: number;
  /** 父进程 ID。 */
  ppid: number | null;
  /** 进程名。 */
  name: string;
  /** 命令行。 */
  commandLine: string | null;
  /** 工作目录。 */
  cwd: string | null;
  /** 启动时间。 */
  startedAt: Date | null;
  /** 用户名。 */
  user: string | null;
}

/**
 * 检测器输出结果，字段与 core 模型保持结构兼容。
 */
export interface DetectorResult {
  /** 应用类型。 */
  kind: "node" | "vite" | "next" | "docker" | "postgres" | "redis" | "bun" | "unknown";
  /** 置信度。 */
  confidence: number;
  /** 是否基础设施服务。 */
  isInfrastructure: boolean;
  /** 是否开发服务器。 */
  isDevServer: boolean;
  /** 中文判断依据。 */
  reasons: string[];
}

/**
 * 僵尸评分输入。
 */
export interface ZombieScoreInput {
  /** 监听绑定。 */
  binding: { localPort: number; pid: number };
  /** 进程详情。 */
  process: DetectorProcessInfo;
  /** 检测结果。 */
  detection: DetectorResult;
  /** 配置。 */
  config: PortButlerConfig;
  /** 端口是否受保护。 */
  protected: boolean;
}
