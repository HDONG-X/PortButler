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
      <text fg={tuiTheme.dim}>{item() ? `PID ${item()!.process.pid} ${item()!.process.name}` : "暂无选择"}</text>
      <text fg={tuiTheme.dim}>{item()?.detection.reasons.join("；") ?? ""}</text>
    </box>
  );
}
