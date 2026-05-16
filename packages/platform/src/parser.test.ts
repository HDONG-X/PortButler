import { describe, expect, test } from "bun:test";
import { parseLsofListeningPorts } from "./macos/lsof";
import { parseNetstat } from "./windows/netstat";
import { parseGetNetTcpConnectionJson } from "./windows/powershell";

describe("platform parsers", () => {
  test("解析 macOS lsof", () => {
    const output = `COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node    19231 user   22u  IPv4  12345      0t0  TCP 127.0.0.1:5173 (LISTEN)`;
    expect(parseLsofListeningPorts(output)).toEqual([
      { localAddress: "127.0.0.1", localPort: 5173, pid: 19231, protocol: "tcp" },
    ]);
  });

  test("解析 Windows Get-NetTCPConnection JSON", () => {
    const output = JSON.stringify({ LocalAddress: "0.0.0.0", LocalPort: 3000, OwningProcess: 42 });
    expect(parseGetNetTcpConnectionJson(output)[0]?.pid).toBe(42);
  });

  test("解析 Windows netstat", () => {
    const output = "  TCP    127.0.0.1:3000    0.0.0.0:0    LISTENING    4242";
    expect(parseNetstat(output)[0]).toEqual({
      localAddress: "127.0.0.1",
      localPort: 3000,
      pid: 4242,
      protocol: "tcp",
    });
  });
});
