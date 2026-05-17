/**
 * Port Butler 文件说明：
 * platform 包公共导出面。
 * core 和 CLI 只通过这里访问系统扫描、进程检查、终止进程和浏览器打开能力。
 * 包边界用于隔离 Windows/macOS 命令差异。
 */
export * from "./browser";
export * from "./doctor";
export * from "./model";
export * from "./process-inspector";
export * from "./process-killer";
export * from "./process-scanner";
export * from "./shell";
export * from "./macos/lsof";
export * from "./macos/ps";
export * from "./windows/netstat";
export * from "./windows/powershell";
