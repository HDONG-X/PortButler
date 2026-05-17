/**
 * Port Butler 文件说明：
 * platform 层系统模型。
 * 定义监听端口、进程信息、命令执行器和 kill 结果等与操作系统交互相关的结构。
 * 这些类型不包含业务风险判断，保持 platform 只表达事实。
 */
/**
 * 平台层的端口监听记录。与 core 模型结构兼容，但平台层不依赖 core。
 */
export interface PlatformPortBinding {
  /** 本地地址。 */
  localAddress: string;
  /** 本地端口。 */
  localPort: number;
  /** 占用进程 PID。 */
  pid: number;
  /** 协议。 */
  protocol: "tcp";
}

/**
 * 平台层读取到的进程详情。
 */
export interface PlatformProcessInfo {
  /** 进程 PID。 */
  pid: number;
  /** 父进程 PID。 */
  ppid: number | null;
  /** 进程名。 */
  name: string;
  /** 完整命令行。 */
  commandLine: string | null;
  /** 工作目录。 */
  cwd: string | null;
  /** 启动时间。 */
  startedAt: Date | null;
  /** 用户名。 */
  user: string | null;
}

/**
 * 平台 kill 选项。调用方必须已经完成安全决策。
 */
export interface PlatformKillOptions {
  /** 是否优雅终止。 */
  graceful: boolean;
  /** 是否强制终止。 */
  force: boolean;
  /** Windows taskkill 是否处理子进程树。 */
  tree: boolean;
}

/**
 * 平台 kill 结果。
 */
export interface PlatformKillResult {
  /** PID。 */
  pid: number;
  /** 是否成功。 */
  ok: boolean;
  /** 中文消息。 */
  message: string;
}
