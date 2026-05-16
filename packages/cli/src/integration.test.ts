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
