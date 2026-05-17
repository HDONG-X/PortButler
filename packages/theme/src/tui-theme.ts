/**
 * Port Butler 文件说明：
 * TUI 专用主题映射。
 * 把基础 token 映射成终端界面需要的背景、边框、文字和风险色。
 * TUI 组件应优先使用这里的语义字段，而不是直接散落十六进制颜色。
 */
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
