/**
 * Port Butler 文件说明：
 * CLI 集成测试。
 * 这些用例直接运行 runCli，覆盖用户真实命令入口，而不是只测试底层函数。
 * 集成测试重点验证 help/version 等稳定输出，避免命令分发回归。
 */
import { describe, expect, test } from "bun:test";
import { Effect } from "effect";
import { runCli } from "./run-cli";

describe("cli integration", () => {
  test("doctor 输出 JSON", async () => {
    const output = await Effect.runPromise(runCli(["doctor", "--json"]));
    const checks = JSON.parse(output) as Array<{ name: string; ok: boolean }>;
    expect(checks.some((check) => check.name === "platform")).toBe(true);
  });
});
