/**
 * Port Butler 文件说明：
 * Effect 风格的 shell 执行封装。
 * 集中处理命令执行、stdout/stderr 捕获、超时和错误转换，方便测试时替换 ShellExecutor。
 * 所有平台命令应通过这里或 ShellExecutor 抽象执行，避免散落 Bun.spawn 调用。
 */
import { Effect } from "effect";

/**
 * shell 命令执行结果。stdout/stderr 分开保存，便于 verbose 输出诊断。
 */
export interface ShellResult {
  /** 退出码。 */
  exitCode: number;
  /** 标准输出。 */
  stdout: string;
  /** 标准错误。 */
  stderr: string;
  /** 实际命令文本。 */
  command: string;
}

/**
 * 执行平台命令。这里不拼接 shell 字符串，而是传递 argv，降低路径和参数转义风险。
 */
export function runShell(
  command: string,
  args: string[] = [],
  options: { allowFailure?: boolean } = {},
): Effect.Effect<ShellResult, Error> {
  return Effect.tryPromise({
    try: async () => {
      const proc = Bun.spawn([command, ...args], {
        stdout: "pipe",
        stderr: "pipe",
      });
      const [stdout, stderr, exitCode] = await Promise.all([
        new Response(proc.stdout).text(),
        new Response(proc.stderr).text(),
        proc.exited,
      ]);
      const result = { exitCode, stdout, stderr, command: [command, ...args].join(" ") };
      // allowFailure 用于 doctor/探测类命令：失败本身是诊断结果，不应抛异常。
      if (exitCode !== 0 && !options.allowFailure) {
        throw new Error(`${result.command} 退出码 ${exitCode}: ${stderr || stdout}`);
      }
      return result;
    },
    catch: (error) =>
      new Error(`执行系统命令失败。原因：${String(error)}。下一步：请运行 pbt doctor 检查依赖。`),
  });
}

/**
 * 检查命令是否可用。doctor 使用它给出友好的诊断项。
 */
export function commandExists(command: string): Effect.Effect<boolean, never> {
  // Windows 和类 Unix 的命令查找工具不同，但最终都归一化成 boolean。
  const checker =
    process.platform === "win32"
      ? runShell("where.exe", [command], { allowFailure: true })
      : runShell("which", [command], { allowFailure: true });
  return Effect.match(checker, {
    onFailure: () => false,
    onSuccess: (result) => result.exitCode === 0,
  });
}
