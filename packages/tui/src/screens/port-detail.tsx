/**
 * Port Butler 文件说明：
 * TUI 端口详情屏幕。
 * 展示单个 ExplainedPort 的归因、风险、保护状态和建议动作。
 * 该屏幕服务于 why 场景，帮助用户在 kill 前理解端口来源。
 */
import type { ExplainedPort } from "@port-butler/core";
import { tuiTheme } from "@port-butler/theme";

/**
 * 端口详情页，用于展示 why 命令同等信息。
 */
export function PortDetailScreen(props: { item: ExplainedPort | undefined }) {
  const item = () => props.item;
  return (
    <box flexDirection="column">
      <text fg={tuiTheme.text}>端口详情</text>
      <text fg={tuiTheme.dim}>
        {item() ? `PID ${item()!.process.pid} ${item()!.process.name}` : "暂无选择"}
      </text>
      <text fg={tuiTheme.dim}>{item()?.detection.reasons.join("；") ?? ""}</text>
    </box>
  );
}
