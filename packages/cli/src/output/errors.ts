import { PortButlerError, toPortButlerError } from "@port-butler/core";

/**
 * 格式化致命错误。始终包含原因和下一步建议，verbose 时附带原始细节。
 */
export function formatFatalError(error: unknown, verbose = false): { text: string; exitCode: number } {
  const normalized =
    error instanceof PortButlerError
      ? error
      : error instanceof Error && error.message.includes("下一步")
        ? new PortButlerError({
            code: "CLI_ERROR",
            message: "命令参数或执行失败。",
            reason: error.message,
            suggestion: "请根据上面的下一步建议修正命令后重试。",
            exitCode: 2,
            detail: error,
          })
        : toPortButlerError(error);
  const lines = [
    normalized.message,
    `原因：${normalized.reason}`,
    `下一步：${normalized.suggestion}`,
  ];
  if (verbose && normalized.detail) lines.push(`诊断：${String(normalized.detail)}`);
  return { text: lines.join("\n"), exitCode: normalized.exitCode };
}
