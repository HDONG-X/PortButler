import { describe, expect, test } from "bun:test";
import { classifyProcess } from "./classify";

const base = { pid: 1, ppid: 2, cwd: null, startedAt: null, user: null };

describe("classifyProcess", () => {
  test("识别 Vite", () => {
    const result = classifyProcess({ ...base, name: "node", commandLine: "node vite --host" }, 5173);
    expect(result.kind).toBe("vite");
    expect(result.isDevServer).toBe(true);
  });

  test("识别 Next", () => {
    const result = classifyProcess({ ...base, name: "node", commandLine: "next dev" }, 3000);
    expect(result.kind).toBe("next");
  });

  test("识别基础设施", () => {
    expect(classifyProcess({ ...base, name: "postgres", commandLine: "postgres -D data" }, 5432).isInfrastructure).toBe(true);
    expect(classifyProcess({ ...base, name: "redis-server", commandLine: "redis-server" }, 6379).kind).toBe("redis");
    expect(classifyProcess({ ...base, name: "com.docker.backend", commandLine: "docker" }, 5432).kind).toBe("docker");
  });
});
