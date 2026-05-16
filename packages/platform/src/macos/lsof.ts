import type { PlatformPortBinding } from "../model";

/**
 * 解析 lsof 监听端口输出。正则只捕获最后的地址和端口段，兼容 IPv4、IPv6 和 *:3000。
 */
export function parseLsofListeningPorts(output: string): PlatformPortBinding[] {
  const lines = output.split(/\r?\n/).slice(1);
  const bindings: PlatformPortBinding[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const parts = trimmed.split(/\s+/);
    const pid = Number(parts[1]);
    const match = trimmed.match(/\bTCP\s+(.+):(\d+)\s+\(LISTEN\)$/);
    if (!Number.isFinite(pid) || !match) continue;
    bindings.push({
      localAddress: normalizeAddress(match[1]),
      localPort: Number(match[2]),
      pid,
      protocol: "tcp",
    });
  }
  return bindings;
}

function normalizeAddress(address: string): string {
  if (address === "*") return "0.0.0.0";
  if (address.startsWith("[")) return address.slice(1, -1);
  return address;
}
