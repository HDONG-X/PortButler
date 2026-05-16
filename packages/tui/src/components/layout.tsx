import { keymap } from "../keymap";
import { tuiTheme } from "@port-butler/theme";

/**
 * 主布局：左侧工作区、右侧状态栏，视觉上贴近参考图的暗色极简风格。
 */
export function Layout(props: { children: unknown; status: string; count: number }) {
  return (
    <box flexDirection="row" width="100%" height="100%" backgroundColor={tuiTheme.background}>
      <box flexDirection="column" flexGrow={1} padding={1}>
        <box backgroundColor={tuiTheme.panel} padding={1} width="100%" marginBottom={1}>
          <text fg={tuiTheme.text}>Port Butler</text>
          <text fg={tuiTheme.dim}>  本地端口管家</text>
        </box>
        {props.children}
        <box backgroundColor={tuiTheme.panel} padding={1} width="100%" marginTop={1}>
          <text fg={tuiTheme.focus}>pbt</text>
          <text fg={tuiTheme.dim}>
            {"  "}
            {keymap.map(([key, label]) => `${key} ${label}`).join("  ")}
          </text>
        </box>
      </box>
      <box width={34} backgroundColor={tuiTheme.panel} padding={1} flexDirection="column">
        <text fg={tuiTheme.text}>Status</text>
        <text fg={tuiTheme.dim}>端口数量 {props.count}</text>
        <text fg={tuiTheme.dim}>{props.status}</text>
        <text fg={tuiTheme.safe}>● Port Butler 0.1.0</text>
      </box>
    </box>
  );
}
