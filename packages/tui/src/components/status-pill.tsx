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
