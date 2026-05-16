/**
 * CLI 全局选项。所有命令共享这些安全和输出开关。
 */
export interface GlobalOptions {
  /** JSON 输出。 */
  json: boolean;
  /** 输出更多诊断。 */
  verbose: boolean;
  /** 只预览危险操作。 */
  dryRun: boolean;
  /** 自动确认。 */
  yes: boolean;
  /** 强制处理高风险目标。 */
  force: boolean;
  /** clean 是否包含基础设施。 */
  includeInfra: boolean;
  /** 指定配置文件。 */
  configPath?: string;
}

/**
 * 解析结果，command 为空时等价于 ls。
 */
export interface ParsedArgs {
  /** 命令名。 */
  command: string;
  /** 位置参数。 */
  positionals: string[];
  /** 全局选项。 */
  options: GlobalOptions;
}

/**
 * 轻量命令行解析器。固定支持架构说明书里的选项，避免引入过重依赖。
 */
export function parseArgs(args: string[]): ParsedArgs {
  const options: GlobalOptions = {
    json: false,
    verbose: false,
    dryRun: false,
    yes: false,
    force: false,
    includeInfra: false,
  };
  const positionals: string[] = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--json") options.json = true;
    else if (arg === "--verbose") options.verbose = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--yes" || arg === "-y") options.yes = true;
    else if (arg === "--force") options.force = true;
    else if (arg === "--include-infra") options.includeInfra = true;
    else if (arg === "--config") {
      const next = args[index + 1];
      if (!next) throw new Error("--config 需要路径参数。下一步：传入 --config <path>。");
      options.configPath = next;
      index += 1;
    } else if (arg === "--no-color") {
      process.env.NO_COLOR = "1";
    } else {
      positionals.push(arg);
    }
  }

  return {
    command: positionals[0] ?? "ls",
    positionals: positionals.slice(1),
    options,
  };
}

/**
 * 解析端口位置参数，并生成中文错误。
 */
export function parsePort(value: string | undefined): number {
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("端口参数无效。原因：端口必须是 1-65535 的整数。下一步：例如执行 pbt why 3000。");
  }
  return port;
}
