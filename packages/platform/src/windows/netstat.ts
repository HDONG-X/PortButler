import type { PlatformPortBinding } from "../model";

/**
 * 解析 netstat -ano -p tcp 输出。正则取本地地址、状态和 PID，作为 Get-NetTCPConnection 的兜底。
 */
export function parseNetstat(output: string): PlatformPortBinding[] {
  const bindings: PlatformPortBinding[] = [];
  for (const line of output.split(/\r?\n/)) {
    const match = line.trim().match(/^TCP\s+(.+?):(\d+)\s+\S+\s+LISTENING\s+(\d+)$/i);
    if (!match) continue;
    bindings.push({
      localAddress: normalizeAddress(match[1]),
      localPort: Number(match[2]),
      pid: Number(match[3]),
      protocol: "tcp",
    });
  }
  return bindings;
}

function normalizeAddress(address: string): string {
  if (address === "0.0.0.0" || address === "[::]") return "0.0.0.0";
  return address.replace(/^\[(.*)\]$/, "$1");
}
