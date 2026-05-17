/**
 * Port Butler 文件说明：
 * CLI ui 子命令的 TUI 启动入口。
 * 为了让普通命令不加载 OpenTUI/Solid，TUI 使用动态 import 延迟加载。
 * 启动失败时返回可操作的下一步提示，方便用户先用 pbt ls 验证核心能力。
 */
import { Effect } from "effect";
import type { GlobalOptions } from "../options";

/**
 * pbt ui：启动终端交互界面。TUI 内部仍然只通过 core 执行业务动作。
 */
export function uiCommand(options: GlobalOptions): Effect.Effect<string, Error> {
  return Effect.tryPromise({
    try: async () => {
      const { startTui } = await import("@port-butler/tui");
      await startTui({ configPath: options.configPath });
      return "";
    },
    catch: (error) =>
      new Error(`启动 TUI 失败。原因：${String(error)}。下一步：请先运行 pbt ls 验证基础功能。`),
  });
}
