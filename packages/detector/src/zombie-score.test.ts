import { describe, expect, test } from "bun:test";
import { defaultConfig } from "@port-butler/config";
import { scoreZombieProcess } from "./zombie-score";

describe("zombie score", () => {
  test("开发服务超过阈值会成为清理候选", () => {
    const score = scoreZombieProcess({
      binding: { localPort: 5173, pid: 100 },
      process: {
        pid: 100,
        ppid: 1,
        name: "node",
        commandLine: "node vite --host",
        cwd: null,
        startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        user: null,
      },
      detection: {
        kind: "vite",
        confidence: 90,
        isInfrastructure: false,
        isDevServer: true,
        reasons: [],
      },
      config: defaultConfig,
      protected: false,
    });
    expect(score.zombieScore).toBeGreaterThanOrEqual(70);
  });

  test("基础设施服务会被扣分", () => {
    const score = scoreZombieProcess({
      binding: { localPort: 5432, pid: 200 },
      process: {
        pid: 200,
        ppid: 1,
        name: "postgres",
        commandLine: "postgres -D data",
        cwd: null,
        startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        user: null,
      },
      detection: {
        kind: "postgres",
        confidence: 95,
        isInfrastructure: true,
        isDevServer: false,
        reasons: [],
      },
      config: defaultConfig,
      protected: true,
    });
    expect(score.zombieScore).toBe(0);
  });
});
