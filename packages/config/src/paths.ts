/**
 * 计算默认配置文件路径。支持 PORT_BUTLER_CONFIG 环境变量覆盖，方便测试和脚本隔离。
 */
export function resolveConfigPath(explicitPath?: string): string {
  if (explicitPath) return explicitPath;
  if (process.env.PORT_BUTLER_CONFIG) return process.env.PORT_BUTLER_CONFIG;
  if (process.platform === "win32") {
    const appData = process.env.APPDATA ?? process.env.USERPROFILE ?? ".";
    return `${appData}\\PortButler\\config.jsonc`;
  }
  const home = process.env.HOME ?? ".";
  return `${home}/.config/port-butler/config.jsonc`;
}
