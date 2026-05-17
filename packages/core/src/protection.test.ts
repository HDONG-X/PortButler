/**
 * Port Butler 文件说明：
 * 端口保护策略测试。
 * 覆盖默认保护端口、用户保护端口和系统风险策略，确保危险目标不会被误判为低风险。
 * 这些测试直接保护 kill/clean 的安全前置条件。
 */
import { describe, expect, test } from "bun:test";
import { defaultConfig } from "@port-butler/config";
import { isNeverKillProcess, isProtectedPort, resolveKillRisk } from "./protection";
import { dedupeBindings } from "./ports";

describe("protection policy", () => {
  test("默认保护关键端口", () => {
    expect(isProtectedPort(22, defaultConfig)).toBe(true);
    expect(isProtectedPort(5432, defaultConfig)).toBe(true);
  });

  test("保护端口阻止 kill", () => {
    const risk = resolveKillRisk({
      protected: true,
      neverKill: false,
      detection: {
        kind: "vite",
        confidence: 95,
        isInfrastructure: false,
        isDevServer: true,
        reasons: [],
      },
    });
    expect(risk).toBe("blocked");
  });

  test("同一 PID 和端口的多地址监听只展示一次", () => {
    const deduped = dedupeBindings([
      { localAddress: "::", localPort: 3000, pid: 42 },
      { localAddress: "0.0.0.0", localPort: 3000, pid: 42 },
      { localAddress: "127.0.0.1", localPort: 3000, pid: 42 },
    ]);
    expect(deduped).toEqual([{ localAddress: "127.0.0.1", localPort: 3000, pid: 42 }]);
  });

  test("永不终止清单匹配 Windows 进程名", () => {
    expect(
      isNeverKillProcess(
        {
          pid: 4,
          ppid: 0,
          name: "svchost.exe",
          commandLine: "svchost.exe",
          cwd: null,
          startedAt: null,
          user: null,
        },
        defaultConfig,
      ),
    ).toBe(true);
  });
});
