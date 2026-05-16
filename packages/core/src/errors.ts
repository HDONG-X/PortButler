/**
 * Port Butler 的统一错误形状。所有面向用户的错误都必须包含中文原因和下一步建议。
 */
export class PortButlerError extends Error {
  readonly code: string;
  readonly reason: string;
  readonly suggestion: string;
  readonly exitCode: number;
  readonly detail?: unknown;

  constructor(input: {
    code: string;
    message: string;
    reason: string;
    suggestion: string;
    exitCode?: number;
    detail?: unknown;
  }) {
    super(input.message);
    this.name = "PortButlerError";
    this.code = input.code;
    this.reason = input.reason;
    this.suggestion = input.suggestion;
    this.exitCode = input.exitCode ?? 1;
    this.detail = input.detail;
  }
}

/**
 * 把未知异常转换成统一中文错误，避免 CLI 泄漏难懂堆栈。
 */
export function toPortButlerError(error: unknown): PortButlerError {
  if (error instanceof PortButlerError) return error;
  return new PortButlerError({
    code: "UNKNOWN",
    message: "Port Butler 遇到了未预期的错误。",
    reason: error instanceof Error ? error.message : String(error),
    suggestion: "请加上 --verbose 重新执行，并把输出作为排查线索。",
    detail: error,
  });
}
