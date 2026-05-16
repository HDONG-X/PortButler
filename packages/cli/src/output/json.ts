/**
 * 渲染稳定 JSON 输出，方便脚本调用和 JSON.parse。
 */
export function renderJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}
