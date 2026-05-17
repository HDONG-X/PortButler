/**
 * Port Butler 文件说明：
 * TUI 状态徽标组件。
 * 根据风险、保护状态或普通文本渲染紧凑标签，帮助列表快速扫描。
 * 颜色语义来自 theme，避免每个屏幕重复定义状态色。
 */
import { tuiTheme } from "@port-butler/theme";

/**
 * 风险状态标签。颜色来自 theme 包，避免界面直接写死业务色。
 */
export function StatusPill(props: { risk: string }) {
  const color = () =>
    props.risk === "low"
      ? tuiTheme.safe
      : props.risk === "medium"
        ? tuiTheme.warning
        : props.risk === "blocked"
          ? tuiTheme.danger
          : tuiTheme.danger;
  return <text fg={color()}>{props.risk}</text>;
}
