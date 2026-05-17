/**
 * Port Butler 文件说明：
 * 测试用假 shell 执行器。
 * 允许测试按命令字符串返回预设 stdout/stderr/exitCode，避免依赖真实系统命令。
 * 平台层和 core 层测试可以用它稳定复现复杂命令输出。
 */
/**
 * 测试用 fake shell 响应项。
 */
export interface FakeShellEntry {
  /** 命令匹配片段。 */
  match: string;
  /** stdout。 */
  stdout: string;
  /** stderr。 */
  stderr?: string;
  /** 退出码。 */
  exitCode?: number;
}

/**
 * 创建简单 fake shell，供解析器和未来集成测试注入命令响应。
 */
export function createFakeShell(entries: FakeShellEntry[]) {
  return async (command: string) => {
    const entry = entries.find((item) => command.includes(item.match));
    if (!entry) throw new Error(`fake shell 没有匹配命令：${command}`);
    return { stdout: entry.stdout, stderr: entry.stderr ?? "", exitCode: entry.exitCode ?? 0 };
  };
}
