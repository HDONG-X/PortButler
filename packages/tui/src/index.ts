/**
 * Port Butler 文件说明：
 * TUI 包入口。
 * 向 CLI 暴露 startTui 和相关公共能力，隐藏具体组件文件布局。
 * 构建产物的 package exports 会指向这里生成的 dist 入口。
 */
export * from "./app";
