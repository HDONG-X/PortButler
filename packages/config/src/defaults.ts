/**
 * Port Butler 文件说明：
 * Port Butler 默认配置。
 * 这里集中定义保护端口、风险阈值、清理策略和打开浏览器策略，作为用户配置的合并基线。
 * 默认值偏保守：基础设施端口默认受保护，清理动作默认只预览。
 */
import type { PortButlerConfig } from "./schema";

/**
 * 默认保护端口。这里包含远程登录、Web、常见数据库和文档数据库端口，避免误杀基础服务。
 */
export const defaultProtectedPorts = [22, 80, 443, 5432, 6379, 3306, 27017];

/**
 * 默认配置。所有读取到的 JSONC 都会与它合并，保证调用方拿到完整结构。
 */
export const defaultConfig: PortButlerConfig = {
  protectedPorts: defaultProtectedPorts,
  neverKillProcessNames: [
    "system",
    "launchd",
    "kernel_task",
    "WindowServer",
    "Finder",
    "explorer.exe",
    "svchost.exe",
    "lsass.exe",
    "wininit.exe",
    "services.exe",
  ],
  devPorts: [3000, 3001, 3002, 5173, 5174, 8080, 4200, 8000, 4321, 5000],
  zombieThresholdMinutes: 120,
  kill: {
    graceMs: 2000,
    tree: true,
    force: false,
  },
  open: {
    host: "localhost",
    protocol: "http",
  },
  docker: {
    enabled: true,
  },
  output: {
    color: true,
    defaultFormat: "table",
  },
};
