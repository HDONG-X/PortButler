/**
 * Port Butler 配置文件结构。所有字段都有默认值，用户配置只需要覆盖想改的部分。
 */
export interface PortButlerConfig {
  /** 受保护端口，不允许 kill 和 clean 默认处理。 */
  protectedPorts: number[];
  /** 永不终止的系统或关键进程名。 */
  neverKillProcessNames: string[];
  /** 常见开发服务器端口，用于识别和僵尸评分。 */
  devPorts: number[];
  /** 僵尸进程运行时长阈值，单位分钟。 */
  zombieThresholdMinutes: number;
  /** kill 策略配置。 */
  kill: {
    /** 优雅终止后等待时长。 */
    graceMs: number;
    /** 是否处理进程树。 */
    tree: boolean;
    /** 默认是否强制终止。 */
    force: boolean;
  };
  /** 打开浏览器策略。 */
  open: {
    /** localhost 主机名。 */
    host: string;
    /** URL 协议。 */
    protocol: "http" | "https";
  };
  /** Docker 识别开关。 */
  docker: {
    /** 是否启用 Docker 规则。 */
    enabled: boolean;
  };
  /** 输出策略。 */
  output: {
    /** 是否默认启用颜色。 */
    color: boolean;
    /** 默认输出格式。 */
    defaultFormat: "table" | "json";
  };
}

/**
 * 用户配置的部分覆盖结构。数组保持完整数组类型，避免 Partial 把数组元素也变成可选。
 */
export interface PortButlerConfigInput {
  /** 覆盖保护端口。 */
  protectedPorts?: number[];
  /** 覆盖永不终止进程名。 */
  neverKillProcessNames?: string[];
  /** 覆盖开发端口。 */
  devPorts?: number[];
  /** 覆盖僵尸阈值。 */
  zombieThresholdMinutes?: number;
  /** 覆盖 kill 策略。 */
  kill?: Partial<PortButlerConfig["kill"]>;
  /** 覆盖打开浏览器策略。 */
  open?: Partial<PortButlerConfig["open"]>;
  /** 覆盖 Docker 策略。 */
  docker?: Partial<PortButlerConfig["docker"]>;
  /** 覆盖输出策略。 */
  output?: Partial<PortButlerConfig["output"]>;
}
