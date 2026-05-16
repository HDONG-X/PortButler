import type { CleanPlan } from "@port-butler/core";
import { For } from "solid-js";
import { tuiTheme } from "@port-butler/theme";

/**
 * 清理预览页。执行清理前只显示候选项，仍需用户显式确认。
 */
export function CleanPreviewScreen(props: { plan: CleanPlan | null }) {
  return (
    <box flexDirection="column">
      <text fg={tuiTheme.text}>Clean Preview</text>
      <For each={props.plan?.candidates ?? []}>
        {(item) => (
          <text fg={tuiTheme.dim}>
            {item.binding.localPort} PID {item.process.pid} score {item.zombieScore}
          </text>
        )}
      </For>
    </box>
  );
}
