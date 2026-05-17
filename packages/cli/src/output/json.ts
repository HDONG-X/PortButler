/**
 * Port Butler 文件说明：
 * CLI JSON 输出工具。
 * 所有结构化输出统一走这里，保证脚本消费时的缩进、换行和序列化行为一致。
 * 命令层只传业务对象，不在各处散落 JSON.stringify。
 */
/**
 * 渲染稳定 JSON 输出，方便脚本调用和 JSON.parse。
 */
export function renderJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}
