/**
 * Port Butler 文件说明：
 * 平台命令解析测试。
 * 使用 fixture 覆盖 Windows netstat/Get-NetTCPConnection 和 macOS lsof/ps 的文本解析。
 * 测试把系统命令格式变化限制在 parser 层，保护 core 不受平台输出影响。
 */
import { describe, expect, test } from "bun:test";
import { parseLsofListeningPorts } from "./macos/lsof";
import { parseNetstat } from "./windows/netstat";
import { parseCimProcessJson, parseGetNetTcpConnectionJson } from "./windows/powershell";

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

  test("解析 PowerShell JSON 日期格式", () => {
    const startedAt = new Date("2026-05-17T01:02:03.000Z");
    const output = JSON.stringify({
      ProcessId: 42,
      ParentProcessId: 7,
      Name: "node.exe",
      CommandLine: "node vite",
      CreationDate: `/Date(${startedAt.getTime()})/`,
    });
    expect(parseCimProcessJson(output, 42).startedAt?.getTime()).toBe(startedAt.getTime());
  });
});
