/**
 * Port Butler 文件说明：
 * TUI 清理预览屏幕。
 * 用于展示 CleanPlan 的候选进程和预览/执行状态，让用户在清理前看到风险。
 * 屏幕组件只消费计划数据，不直接执行清理。
 */
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
