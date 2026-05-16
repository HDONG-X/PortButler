import type { ExplainedPort } from "@port-butler/core";
import { PortTable } from "../components/table";

/**
 * 端口列表页。当前 MVP 以列表为核心，快捷键触发详情、打开、保护和 kill。
 */
export function PortListScreen(props: { items: ExplainedPort[]; selected: number }) {
  return <PortTable items={props.items} selected={props.selected} />;
}
