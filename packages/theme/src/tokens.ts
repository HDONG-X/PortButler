/**
 * Port Butler 文件说明：
 * 基础设计 token。
 * 定义颜色、间距和风险色等跨界面共享的视觉常量。
 * token 只表达设计语义，不绑定具体组件实现。
 */
/**
 * Port Butler 的设计 token。TUI 和未来 Web 页面都从这里派生颜色和间距。
 */
export const themeTokens = {
  color: {
    bg: "#0b0b0b",
    panel: "#171717",
    border: "#2a2a2a",
    text: "#e7e7e7",
    muted: "#858585",
    accent: "#f5a524",
    blue: "#60a5fa",
    danger: "#ef4444",
    warning: "#f59e0b",
    success: "#22c55e",
  },
  spacing: {
    xs: 1,
    sm: 2,
    md: 4,
  },
} as const;
