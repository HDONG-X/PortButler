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
