/**
 * Port Butler 文件说明：
 * 用户配置路径解析。
 * 负责根据平台和环境变量选择 Port Butler 的默认配置文件位置。
 * 路径逻辑集中在这里，方便测试和未来支持更多平台。
 */
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
