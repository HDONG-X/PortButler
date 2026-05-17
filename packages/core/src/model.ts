/**
 * Port Butler 文件说明：
 * core 层领域模型。
 * 定义端口解释、风险等级、kill plan、clean plan、诊断结果等跨包共享结构。
 * 这些类型是 CLI、TUI、detector、platform 之间的语言，字段含义应尽量稳定。
 */
/**
 * 当前正式支持的平台类型。Linux 预留给未来版本，当前遇到 Linux 会返回中文不支持错误。
 */
export type SupportedPlatform = "darwin" | "win32";

/**
 * Port Butler 能识别的本地服务类型。
 */
export type AppKind =
  | "node"
  | "vite"
  | "next"
  | "docker"
  | "postgres"
  | "redis"
  | "bun"
  | "unknown";

/**
 * 终止进程的风险等级。blocked 表示策略层禁止执行。
 */
export type RiskLevel = "low" | "medium" | "high" | "blocked";

/**
 * 平台扫描到的 TCP 监听记录，只描述事实，不包含业务判断。
 */
export interface PortBinding {
  /** 本地监听地址，例如 127.0.0.1、0.0.0.0 或 ::1。 */
  localAddress: string;
  /** 本地监听端口。 */
  localPort: number;
  /** 占用端口的进程 ID。 */
  pid: number;
  /** 协议，第一版只正式处理 TCP。 */
  protocol: "tcp";
}

/**
 * 进程详情，来自 ps、PowerShell CIM 或平台兜底命令。
 */
export interface ProcessInfo {
  /** 进程 ID。 */
  pid: number;
  /** 父进程 ID。权限不足或平台无法获取时为 null。 */
  ppid: number | null;
  /** 进程名，例如 node、postgres、redis-server。 */
  name: string;
  /** 完整命令行。权限不足时可能为 null。 */
  commandLine: string | null;
  /** 工作目录。多数平台命令无法稳定提供时允许为 null。 */
  cwd: string | null;
  /** 进程启动时间。无法解析时为 null。 */
  startedAt: Date | null;
  /** 当前用户。无法获取时为 null。 */
  user: string | null;
}

/**
 * 检测器对进程类型的判定结果。
 */
export interface DetectionResult {
  /** 识别出的应用类型。 */
  kind: AppKind;
  /** 识别置信度，范围 0 到 100。 */
  confidence: number;
  /** 是否属于数据库、Docker 等基础设施服务。 */
  isInfrastructure: boolean;
  /** 是否像开发服务器。 */
  isDevServer: boolean;
  /** 用于 why 命令展示的中文判断依据。 */
  reasons: string[];
}

/**
 * 端口、进程、识别结果和安全策略聚合后的展示模型。
 */
export interface ExplainedPort {
  /** 原始监听记录。 */
  binding: PortBinding;
  /** 进程详情，读取失败时保留最小信息。 */
  process: ProcessInfo;
  /** 类型识别结果。 */
  detection: DetectionResult;
  /** 端口是否受保护。 */
  protected: boolean;
  /** kill 风险等级。 */
  risk: RiskLevel;
  /** 僵尸开发进程评分。 */
  zombieScore: number;
  /** 僵尸评分依据。 */
  zombieReasons: string[];
}

/**
 * kill 计划中的单个目标。所有 kill 操作必须先生成这些目标，再由执行器消费。
 */
export interface KillTarget {
  /** 将被终止的 PID。 */
  pid: number;
  /** 进程名。 */
  name: string;
  /** 关联端口。 */
  port: number;
  /** 检测类型。 */
  kind: AppKind;
  /** 风险等级。 */
  risk: RiskLevel;
  /** 终止原因。 */
  reasons: string[];
}

/**
 * kill 计划。blocked 为 true 时执行器必须拒绝执行。
 */
export interface KillPlan {
  /** 目标端口。 */
  port: number;
  /** 计划目标。 */
  targets: KillTarget[];
  /** 是否被安全策略阻止。 */
  blocked: boolean;
  /** 阻止或提醒原因。 */
  message: string;
  /** 是否需要用户确认。 */
  requiresConfirmation: boolean;
}

/**
 * kill 执行选项，由 CLI 和 TUI 显式传入。
 */
export interface KillExecutionOptions {
  /** 只展示计划，不执行危险操作。 */
  dryRun?: boolean;
  /** 已经得到用户确认。 */
  yes?: boolean;
  /** 是否允许强制终止。 */
  force?: boolean;
  /** 是否终止子进程树。 */
  tree?: boolean;
  /** 优雅终止后的等待时长，预留给平台执行器使用。 */
  graceMs?: number;
  /** 是否输出更多诊断信息。 */
  verbose?: boolean;
}

/**
 * 平台 kill 的结果。执行器会按 PID 汇总展示。
 */
export interface KillResult {
  /** 被处理的 PID。 */
  pid: number;
  /** 是否成功发出终止命令。 */
  ok: boolean;
  /** 平台返回的中文消息。 */
  message: string;
}

/**
 * clean 命令生成的清理计划。默认只是预览，必须确认后才会执行。
 */
export interface CleanPlan {
  /** 候选端口。 */
  candidates: ExplainedPort[];
  /** 被排除的端口和原因。 */
  skipped: Array<{ port: number; pid: number; reason: string }>;
  /** 是否默认只是预览。 */
  previewOnly: boolean;
}
