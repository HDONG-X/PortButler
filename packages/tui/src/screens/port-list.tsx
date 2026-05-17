/**
 * Port Butler 文件说明：
 * TUI 端口列表屏幕。
 * 展示扫描得到的端口概览，并把列表渲染委托给共享表格组件。
 * 列表屏幕保持只读，动作入口由命令输入负责。
 */
import type { ExplainedPort } from "@port-butler/core";
import { PortTable } from "../components/table";

/**
 * 端口列表页。当前 MVP 以列表为核心，快捷键触发详情、打开、保护和 kill。
 */
export function PortListScreen(props: { items: ExplainedPort[]; selected: number }) {
  return <PortTable items={props.items} selected={props.selected} />;
}
