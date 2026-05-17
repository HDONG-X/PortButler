import stringWidth from "string-width";
import type { CleanPlan, ExplainedPort, KillPlan, KillResult } from "@port-butler/core";

/**
 * 渲染端口列表表格。宽度计算使用 string-width，兼容中文输出对齐。
 */
export function renderPortTable(items: ExplainedPort[]): string {
  if (items.length === 0) return "当前没有发现正在监听的本地端口。";
  return table(
    ["PORT", "PID", "NAME", "KIND", "ADDR", "PROTECTED", "RISK", "SCORE"],
    items.map((item) => [
      String(item.binding.localPort),
      String(item.process.pid),
      item.process.name,
      item.detection.kind,
      item.binding.localAddress,
      item.protected ? "yes" : "no",
      item.risk,
      String(item.zombieScore),
    ]),
  );
}

/**
 * 渲染 why 命令的中文解释。
 */
export function renderWhy(item: ExplainedPort): string {
  return [
    `端口 ${item.binding.localPort} 正被占用`,
    "",
    `进程：${item.process.name}`,
    `PID：${item.process.pid}`,
    `识别：${item.detection.kind}`,
    `风险：${item.risk}`,
    `保护：${item.protected ? "是" : "否"}`,
    `判断依据：${item.detection.reasons.join("；") || "无"}`,
    `僵尸评分：${item.zombieScore}`,
    `清理依据：${item.zombieReasons.join("；") || "无"}`,
    `建议：${item.risk === "low" ? `可以使用 pbt kill ${item.binding.localPort} 释放端口` : "请先确认服务用途，再决定是否释放"}`,
  ].join("\n");
}

/**
 * 渲染 kill 计划，dry-run 和确认前都会使用它。
 */
export function renderKillPlan(plan: KillPlan): string {
  const rows = plan.targets.map((target) => [
    String(target.port),
    String(target.pid),
    target.name,
    target.kind,
    target.risk,
    target.reasons.join("；"),
  ]);
  return [
    `${plan.message}`,
    "",
    rows.length
      ? table(["PORT", "PID", "NAME", "KIND", "RISK", "REASON"], rows)
      : "没有可处理目标。",
  ].join("\n");
}

/**
 * 渲染 kill 执行结果。
 */
export function renderKillResult(results: KillResult[]): string {
  if (results.length === 0) return "没有执行任何终止操作。";
  return results.map((result) => `${result.ok ? "成功" : "失败"}：${result.message}`).join("\n");
}

/**
 * 渲染 clean 预览。
 */
export function renderCleanPlan(plan: CleanPlan): string {
  const rows = plan.candidates.map((item) => [
    String(item.binding.localPort),
    String(item.process.pid),
    item.process.name,
    item.detection.kind,
    String(item.zombieScore),
    item.zombieReasons.join("；"),
  ]);
  const skipped = plan.skipped.map((item) => `跳过 ${item.port}/${item.pid}：${item.reason}`);
  return [
    `发现 ${plan.candidates.length} 个疑似遗留开发进程：`,
    "",
    rows.length
      ? table(["PORT", "PID", "NAME", "KIND", "SCORE", "REASON"], rows)
      : "没有达到清理阈值的候选项。",
    "",
    ...skipped,
    "",
    plan.previewOnly && plan.candidates.length > 0 ? "执行 pbt clean --yes 清理这些进程。" : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function table(headers: string[], rows: string[][]): string {
  const widths = headers.map((header, index) =>
    Math.max(stringWidth(header), ...rows.map((row) => stringWidth(row[index] ?? ""))),
  );
  const renderRow = (row: string[]) =>
    row.map((cell, index) => cell + " ".repeat(widths[index] - stringWidth(cell))).join("  ");
  return [
    renderRow(headers),
    renderRow(headers.map((h, i) => "-".repeat(widths[i]))),
    ...rows.map(renderRow),
  ].join("\n");
}
