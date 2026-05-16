import { For } from "solid-js";
import type { ExplainedPort } from "@port-butler/core";
import { tuiTheme } from "@port-butler/theme";
import { StatusPill } from "./status-pill";

/**
 * TUI 端口表格。这里仅渲染数据，端口操作由上层 App 的快捷键处理。
 */
export function PortTable(props: { items: ExplainedPort[]; selected: number }) {
  return (
    <box flexDirection="column" width="100%">
      <text fg={tuiTheme.dim}>PORT   PID     KIND       RISK       SCORE   PROCESS</text>
      <For each={props.items}>
        {(item, index) => {
          const selected = () => index() === props.selected;
          return (
            <box flexDirection="row" width="100%">
              <text fg={selected() ? tuiTheme.focus : tuiTheme.dim}>{selected() ? "▌ " : "  "}</text>
              <text fg={tuiTheme.text}>
                {String(item.binding.localPort).padEnd(6)}
                {String(item.process.pid).padEnd(8)}
                {item.detection.kind.padEnd(11)}
              </text>
              <StatusPill risk={item.risk} />
              <text fg={tuiTheme.text}>
                {"       "}
                {String(item.zombieScore).padEnd(8)}
                {item.process.name}
              </text>
            </box>
          );
        }}
      </For>
    </box>
  );
}
