import { themeTokens } from "./tokens";

/**
 * TUI 颜色语义映射，避免界面组件直接依赖底层 token 名称。
 */
export const tuiTheme = {
  background: themeTokens.color.bg,
  panel: themeTokens.color.panel,
  border: themeTokens.color.border,
  text: themeTokens.color.text,
  dim: themeTokens.color.muted,
  focus: themeTokens.color.accent,
  safe: themeTokens.color.success,
  warning: themeTokens.color.warning,
  danger: themeTokens.color.danger,
  info: themeTokens.color.blue,
};
